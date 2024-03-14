# NeuvoView

This is a React Native component that renders a WebView and allows for bi-directional communication between the app and the WebView.

## HTTPS
Loading the SPA from `http://localhost:8080` while making API requests to the Neuvo API's using HTTPS involves a scenario where mixed content (secure HTTPS and insecure HTTP), needing some configuration for both Android and iOS:

### Android
- **ClearText Traffic:** Android, by default, does not allow HTTP traffic for apps targeting Android 9 (API level 28) or higher. You would need to allow clearText traffic for your localhost in your `AndroidManifest.xml` file. This can be done by adding the following configuration inside the `<application>` tag:

  ```xml
  <application
      android:usesCleartextTraffic="true">
      ...
  </application>
  ```
  
  However, allowing cleartext traffic for all your app's communication is not recommended due to security reasons. A better approach is to specify domain-specific configurations using a network security configuration file:

  ```xml
  <application
      android:networkSecurityConfig="@xml/network_security_config">
  ```

  And in `res/xml/network_security_config.xml`:

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <network-security-config>
      <domain-config cleartextTrafficPermitted="true">
          <domain includeSubdomains="true">localhost</domain>
      </domain-config>
  </network-security-config>
  ```

### iOS
- **App Transport Security (ATS):** iOS enforces secure connections by default through ATS, which blocks cleartext HTTP. To allow HTTP connections, you need to modify your app's `Info.plist` to include exceptions for the domains you wish to allow HTTP communication with. For localhost, the configuration would look like this:

  ```xml
  <key>NSAppTransportSecurity</key>
  <dict>
      <key>NSExceptionDomains</key>
      <dict>
          <key>localhost</key>
          <dict>
              <key>NSExceptionAllowsInsecureHTTPLoads</key>
              <true/>
              <key>NSIncludesSubdomains</key>
              <true/>
          </dict>
      </dict>
  </dict>
  ```