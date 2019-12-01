const assert = require('assert');
const utils = require('../utils/fn.js');
let path = require('path');
let AutoUploadWebpackPlugin = require('../index.js');
let webpack = require('webpack');

let webpackConfig = {
  mode: 'production',
  entry: {
    index: path.resolve('src/index.js')
  },
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: '',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve('./dist')
  },
  plugins: [
    new AutoUploadWebpackPlugin({
      host: 'localhost',
      user: 'xxxxx',
      password: 'xxxxxx',
      remoteDir: '/Users/quanlincong/openSource/blog-github/demo/webpack/auto-upload-webpack-plugin/remote',
      localDir: '/Users/quanlincong/openSource/blog-github/demo/webpack/auto-upload-webpack-plugin/dist',
      include: /.*/
    })
  ]
};

// auto-upload-webpack-plugin
let describe = describe('webpack', function() {
  describe('webpack.AutoUploadWebpackPlugin()', function() {
    // on mac install vsftpd to start a ftp service
    // config file : /usr/local/etc/vsftpd.conf
    it('upload to local ftp server', function(done) {
      webpack(webpackConfig).
    });
  });
});
