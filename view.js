import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNFS from '@dr.pogodin/react-native-fs'; // Updated import
import StaticServer from '@dr.pogodin/react-native-static-server'; // Updated import
import { WebView } from 'react-native-webview';

const BASE_URL = 'https://url'; // TODO: use the correct URL here
const LOCAL_PATH = `${RNFS.DocumentDirectoryPath}/`;
let server = null;

// Adjust the allowed URLs as per your requirements
const allowedUrls = ['https://*.neuvo.ai', 'https://*.neuvola.com'];

function wrapMessage(data) {
  return `window.postMessage('${JSON.stringify(data)}', '*')`;
}

const NeuvoView = (props) => {
  const [spaUrl, setSpaUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const webviewRef = useRef(null);

  useEffect(() => {
    // TODO: This is automatic at the moment but we can split it into an interaction
    checkForUpdates();
    return () => {
      if (server) {
        server.stop();
      }
    };
  }, []);

  // This function only checks for updates and decides whether an update is needed.
  const checkForUpdates = async () => {
    try {
      const serverVersionResponse = await fetch(`${BASE_URL}/version.json`);
      const serverVersion = await serverVersionResponse.json();
      const localVersionPath = `${LOCAL_PATH}/version.json`;
      const localVersionExists = await RNFS.exists(localVersionPath);
      let localVersion = null;
      if (localVersionExists) {
        localVersion = JSON.parse(await RNFS.readFile(localVersionPath));
      }
      if (!localVersion || serverVersion.build !== localVersion.build) {
        // If versions differ, trigger update process through user interaction
        return true; // Indicate that an update is needed
      }
      return false; // No update needed
    } catch (error) {
      console.error('Error checking for updates:', error);
      setError('Failed to check for updates'); // Set error state
      throw new Error('Failed to check for updates');
    }
  };

  const updateLocalAssets = async () => {
    await RNFS.mkdir(LOCAL_PATH).catch(e => console.log(e));

    await downloadFile('model.json');
    const modelJsonPath = `${LOCAL_PATH}/model.json`;
    const model = JSON.parse(await RNFS.readFile(modelJsonPath));

    if (model.weightsManifest) {
        for (const group of model.weightsManifest) {
            for (const path of group.paths) {
                await downloadFile(path);
            }
        }
    }

    await downloadFile('files.json');
    const filesJsonPath = `${LOCAL_PATH}/files.json`;
    const files = JSON.parse(await RNFS.readFile(filesJsonPath));
    for (const fileName of files) {
        await downloadFile(fileName);
    }
  };

  // This function performs the update
  const performUpdate = async () => {
    try {
      await updateLocalAssets();
      const serverVersionResponse = await fetch(`${BASE_URL}/version.json`);
      const serverVersion = await serverVersionResponse.json();
      const localVersionPath = `${LOCAL_PATH}/version.json`;
      await RNFS.writeFile(localVersionPath, JSON.stringify(serverVersion), 'utf8');
      startLocalServer();
    } catch (error) {
      console.error('Error updating assets:', error);
      setError('Failed to update assets');
      throw new Error('Failed to update assets');
    }
  };

  const downloadFile = async (fileName) => {
    const url = `${BASE_URL}/${fileName}`;
    const localFilePath = `${LOCAL_PATH}/${fileName}`;

    try {
      const response = await fetch(url, { method: 'HEAD' });
      const lastModifiedRemote = response.headers.get('last-modified');
      const etagRemote = response.headers.get('etag');

      const fileInfo = await RNFS.stat(localFilePath).catch(() => null);
      if (fileInfo && fileInfo.mtime) {
        const lastModifiedLocal = new Date(fileInfo.mtime).toGMTString();

        if (lastModifiedRemote === lastModifiedLocal) {
          console.log(`${fileName} is up to date. No download needed.`);
          return;
        }
      }

      const contentResponse = await fetch(url);
      const content = await contentResponse.text();
      await RNFS.writeFile(localFilePath, content, 'utf8');
    } catch (error) {
      console.error(`Error downloading ${fileName}:`, error);
      throw new Error(`Failed to download ${fileName}`);
    }
  };

  const startLocalServer = () => {
    if (server) {
      server.stop();
    }
    server = new StaticServer(1337, LOCAL_PATH);
    server.start().then(url => {
      console.log(`Serving Neuvo chat at ${url}`);
      setSpaUrl(url);
    });
  };

  const onLoad = () => {
    if (loaded) {
      return;
    }
    setLoaded(true);
    props.onReady && props.onReady();
  };

  const onMessage = (event) => {
    setData(event.nativeEvent.data);
  };

  const askQuestion = (content) => {
    const message = {
      action: 'ask',
      content,
    };
    webviewRef.current.injectJavaScript(wrapMessage(message));
  };

  const getVersion = () => {
    const message = {
      action: 'version',
    };
    webviewRef.current.injectJavaScript(wrapMessage(message));
  };

  const setOnline = () => {
    const message = {
      action: 'online',
    };
    webviewRef.current.injectJavaScript(wrapMessage(message));
  };

  const setOffline = () => {
    const message = {
      action: 'offline',
    };
    webviewRef.current.injectJavaScript(wrapMessage(message));
  };

  const sendSlots = (content) => {
    const message = {
      action: 'slots',
      content,
    };
    webviewRef.current.injectJavaScript(wrapMessage(message));
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {spaUrl ? (
        <WebView
          ref={webviewRef}
          onLoad={onLoad}
          onMessage={onMessage}
          source={{ uri: spaUrl }}
          originWhitelist={['*']} // Adjust as necessary
          allowUniversalAccessFromFileURLs={true} // This might be necessary for local-HTTP to HTTPS requests
          mediaPlaybackRequiresUserAction={false}
        />
      ) : (
        <View style={styles.loadingContainer}>
          {/* TODO: do we have some error indicator we could use? */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { NeuvoView };
