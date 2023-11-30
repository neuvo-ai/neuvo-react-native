# NeuvoView

This is a React Native component that renders a WebView and allows for bi-directional communication between the app and the WebView.

## Installation

To use the `NeuvoView` component in your React Native app, you can install it by cloning this repository and linking locally.

## Usage

To use the `NeuvoView` component in your app, you first need to import it:

```typescript
import {NeuvoView} from 'neuvo-react-native/view';
```

To link the `NeuvoView` component to a ref, you need to create a ref:

```typescript
  const neuvoViewRef = useRef(null);  // Create a ref


Then, you can use the `NeuvoView` component in your app like this:

```jsx
<NeuvoView
  ref={neuvoViewRef}
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
- `setOnline()`: Sends a message with the `"online"` action to the WebView.
- `setOffline()`: Sends a message with the `"offline"` action to the WebView.

These public functions can be called like this:

```typescript
ref={(neuvoView) => this.neuvoView = neuvoView}
...
this.neuvoViewRef.current.askQuestion('Asking a question');
this.neuvoViewRef.current.sendSlots({ age: 15, pregnant: true });
this.neuvoViewRef.current.setOnline(); // Tells the bot that we have connectivity
this.neuvoViewRef.current.setOffline(); // Tells the bot that we don't have connectivity
```

## Notes

- The `WebView` component is restricted to loading pages from the URLs in the `allowedUrls` array. This can be modified by editing the `allowedUrls` constant in the `NeuvoView` component.
- The `mediaPlaybackRequiresUserAction` prop of the `WebView` component is set to `false`, which allows media playback to automatically start when the page is loaded. This can be modified by editing the `mediaPlaybackRequiresUserAction` prop of the `WebView` component in the `NeuvoView` component.
- The `NeuvoView` component uses the `JSON` object to stringify the messages that are sent to the WebView. This is necessary because the `postMessage` function of the `WebView` component only accepts strings as the message payload.

## Full `App.tsx` example

```typescript
import React, {useRef} from 'react';

import {NeuvoView} from 'neuvo-react-native/view';

function App(): JSX.Element {
  const neuvoViewRef: React.MutableRefObject<NeuvoView> = useRef(null); // Create a ref

  return (
    <NeuvoView
      ref={neuvoViewRef} // Attach the ref to your component
      url="https://example.neuvo.ai/?language=en&load-offline=true#offline"
      onReady={() => {
        console.log('NeuvoView is ready');

        // Simulating setting it to online in 45 seconds
        setTimeout(() => {
          neuvoViewRef.current.setOnline();
        }, 45000);

        // Simulating asking a question in 30 seconds
        setTimeout(() => {
          neuvoViewRef.current.askQuestion('Hello there!'); // Use the ref to call the method
        }, 30000);
      }}
      onMessage={(data: any) => {
        // Received data from the chat that can be parsed
        console.log(data);
      }}
    />
  );
}

export default App;
```