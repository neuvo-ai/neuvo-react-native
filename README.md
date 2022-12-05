# NeuvoView

This is a React Native component that renders a WebView and allows for bi-directional communication between the app and the WebView.

## Installation

To use the `NeuvoView` component in your React Native app, you can install it by cloning this repository and linking locally.

## Usage

To use the `NeuvoView` component in your app, you first need to import it:

```typescript
import NeuvoView from 'neuvo-react-native/view';
```

Then, you can use the `NeuvoView` component in your app like this:

```jsx
<NeuvoView
  url="https://example.neuvo.ai"
  onReady={() => console.log('NeuvoView is ready')}
  onMessage={(data) => console.log(data)}
/>
```

The `NeuvoView` component takes the following props:

- `url`: The URL of the page that the WebView should load. This prop is required.
- `onReady`: A callback function that is called when the WebView finishes loading the page. This prop is optional.
- `onMessage`: A callback function that is called when the app receives a message from the WebView. This prop is optional.

The `NeuvoView` component also exposes the following public functions that can be called from the app to send messages to the WebView:

- `askQuestion(content)`: Sends a message with the `"ask"` action to the WebView.
- `sendSlots(content)`: Sends a message with the `"slots"` action to the WebView.

These public functions can be called like this:

```typescript
ref={(neuvoView) => this.neuvoView = neuvoView}
...
this.neuvoView.askQuestion('Asking a question');
this.neuvoView.sendSlots({ age: 15, pregnant: true });
```

## Notes

- The `WebView` component is restricted to loading pages from the URLs in the `allowedUrls` array. This can be modified by editing the `allowedUrls` constant in the `NeuvoView` component.
- The `mediaPlaybackRequiresUserAction` prop of the `WebView` component is set to `false`, which allows media playback to automatically start when the page is loaded. This can be modified by editing the `mediaPlaybackRequiresUserAction` prop of the `WebView` component in the `NeuvoView` component.
- The `NeuvoView` component uses the `JSON` object to stringify the messages that are sent to the WebView. This is necessary because the `postMessage` function of the `WebView` component only accepts strings as the message payload.

