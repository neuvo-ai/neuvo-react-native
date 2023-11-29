import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

// Create an array of URLs that the WebView is allowed to load
const allowedUrls = [
  'https://*.neuvo.ai',
  'https://*.neuvola.com'
];

function wrapMessage(data) {
  return `window.postMessage('${JSON.stringify(data)}')`;
}

class NeuvoView extends Component {
  constructor(props) {
    super(props);
    this.loaded = false;
    this.state = {
      data: null,
    };
  }

  // This function is called when the WebView loads a page
  onLoad = () => {
    if (this.loaded) return;
    this.loaded = true;
    this.props.onReady();
  };

  // This function is called when the app receives a message from the WebView
  onMessage = event => {
    this.setState({data: event.nativeEvent.data});
  };

  askQuestion = content => {
    const message = {
      action: 'ask',
      content,
    };
    this.webview.injectJavaScript(wrapMessage(message));
  };

  getVersion = () => {
    const message = {
      action: 'version'
    };
    this.webview.injectJavaScript(wrapMessage(message));
  };

  setOnline = () => {
    const message = {
      action: 'online'
    };
    this.webview.injectJavaScript(wrapMessage(message));
  }

  setOffline = () => {
    const message = {
      action: 'offline'
    };
    this.webview.injectJavaScript(wrapMessage(message));
  }

  sendSlots = content => {
    const message = {
      action: 'slots',
      content,
    };
    this.webview.injectJavaScript(wrapMessage(message));
  };

  render() {
    return (
      <WebView
        ref={webview => (this.webview = webview)}
        onLoad={this.onLoad}
        onMessage={this.onMessage}
        source={{uri: this.props.url}}
        originWhitelist={allowedUrls}
        mediaPlaybackRequiresUserAction={false}
      />
    );
  }
}

export { NeuvoView };