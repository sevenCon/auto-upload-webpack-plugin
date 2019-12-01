let ftpUploader = require('./ftpUploader.js');

class AutoUploadWebpackPlugin {
  constructor(options) {
    this.callback = function(cb) {
      new ftpUploader(options, cb);
    };
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync('AutoUpload', (stats, callback) => {
      console.log('Hello World!');
      this.callback(callback);
    });
  }
}

module.exports = AutoUploadWebpackPlugin;
