# AutoUploadWebpackPlugin

This is webpack plugin to upload the static resource to server after webpack builded

## usage

```
let AutoUploadWebpackPlugin = require("AutoUploadWebpackPlugin");
new AutoUploadWebpackPlugin({
  // follow is required
  host:"127.0.0.1",
  user:"root",
  password:"******",
  localDir:"/admin/local/localDir",
  remoteDir:"/usr/root/remoteDir",
  include:[] //  String or Array, dir or files include, default *
  exclude:[],//  String or Array,dir or files include, default none
});
```

## property

- `localDir`, resource directory in local, absolute path
- `remoteDir`, upload server directory , absolute path
- `include`, default [\.*], Array, RegExp is valid,
- `exclude`, default null, Array, RegExp is valid,
