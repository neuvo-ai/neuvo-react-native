// Import React, WebView, JSON, and Component from react-native
import React, { Component } from 'react';
import { WebView, JSON } from 'react-native-webview';

// Create an array of URLs that the WebView is allowed to load
const allowedUrls = [
  'https://*.neuvo.ai',
  'https://*.neuvola.com'
];

// Create a component that renders a WebView
class NeuvoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  // This function is called when the WebView loads a page
  onLoad = () => {
    // Send a "ready" event to the parent of the React component
    this.props.onReady();
  }

  // This function is called when the app receives a message from the WebView
  onMessage = (event) => {
    // Update the state with the data from the message
    this.setState({ data: event.nativeEvent.data });
  }

  // This function sends a message with the "ask" action to the WebView
  askQuestion = (content) => {
    // Create a JSON object with the "ask" action and the specified message payload
    const message = {
      action: 'ask',
      content,
    };

    // Send the message to the WebView
    this.webview.postMessage(JSON.stringify(message));
  }

  // This function sends a message with the "slots" action to the WebView
  sendSlots = (content) => {
    // Create a JSON object with the "slots" action and the specified message payload
    const message = {
      action: 'slots',
      content,
    };

    // Send the message to the WebView
    this.webview.postMessage(JSON.stringify(message));
  }

  render() {
    return (
      <WebView
        ref={(webview) => this.webview = webview}
        onLoad={this.onLoad}
        onMessage={this.onMessage}
        source={{ uri: this.props.url }}
        originWhitelist={allowedUrls}
        mediaPlaybackRequiresUserAction={false}
      />
    );
  }
}

export { NeuvoView }