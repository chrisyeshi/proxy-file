# Proxy File

This node.js module provides persistent storage via syncing a JavaScript object to a JSON file. The monitored JavaScript object is serialized to disk on change.

The implementation uses a Proxy object to intercept the modifications done to the JavaScript object. A timer is used to bundle frequent modifications to a single serialization.

This is for people who are too lazy to setup a database for persistent storage.

# Usage Example

```javascript
const proxyStore = require('proxy-file');

const autoSerialized =
        proxyStore.createStore(
            'file-to-save-the-js-object.json',
            1000 /* timeout in ms (optional) */,
            undefined /* serialization function (optional) */);

// Following statements are automatically serialized to the file.
autoSerialized.hello = 'world';
autoSerialized.happy = 'coding';
```
