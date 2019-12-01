/**
 * author: lincong quan
 * date: 2019-11-25
 * description: This is a function that can upload files to remote host by ftp parellel.
 */

let SftpClient = require('ssh2-sftp-client');
let fs = require('fs');
let path = require('path');
let utils = require('./utils/fn.js');
let logUtils = require('./utils/log');
let readdir = utils.promisefy(fs, fs.readdir);

class ftpUploader {
  constructor(options, cb) {
    let isPass = this.paramsValidator(options);
    if (!isPass) return;

    // base remote host connection information.
    let { host, user, port = 22, password } = options;
    this.config = {
      host,
      port,
      user,
      password
    };
    // which dir you want to upload.
    this.localDir = utils.prettyPath(path.resolve(options.localDir));

    // where you want to place in the remote host.
    this.remoteDir = options.remoteDir;

    // files you want to upload, if null,
    // it will upload all file and dir to remote host.
    this.include = (utils.isArray(options.include) && options.include.length ? options.include : [options.include]) || [/.*/];

    // files you don't want to upload.
    this.exclude = (utils.isArray(options.exclude) ? options.exclude : [options.exclude]) || [];

    // initialize a ftpClient
    this.client = new SftpClient();

    this.start(cb);
  }
  // retrieve all files need to be uploaded,
  // and upload it to host by ftp.
  async start(cb) {
    // check the source dir is exist or not
    let isExisted = utils.exists(this.localDir);
    if (!isExisted) return utils.error(`the target dir ${this.localDir} is not exist`);

    let files = await readdir(this.localDir, 'utf-8');
    files = files.map(file => path.resolve(this.localDir, file));
    let allFiles = await this.getFilesRecursive(files, this.include, this.exclude);

    logUtils.log(allFiles);

    // start upload
    this.client
      .connect(this.config)
      .then(async () => {
        for (let file of allFiles) {
          if (file.isDir) {
            let uploadDir = `${this.remoteDir}${file.relativePath}`;
            let isExist = await this.client.exists(uploadDir);
            if (!isExist) await this.client.mkdir(uploadDir, true);
            continue;
          }
          // using concurrency
          let uploadedFile = await this.client.fastput(file.absolutedPath, this.remoteDir + file.relativePath);
          logUtils.log(uploadedFile);
        }
      })
      .then(() => {
        this.client.end();
        cb();
      })
      .catch(err => {
        logUtils.error(err);
      });
  }
  // retrieve all dir , get the file path
  async getFilesRecursive(files, include, exclude) {
    let pools = [];
    let fromRoot = this.localDir;
    // let destRoot = this.remoteDir;

    for (let item of files) {
      let relativePath = utils.getRelativePath(item, fromRoot);

      if (utils.match(exclude, relativePath)) continue;
      if (!include.length || utils.match(include, relativePath)) {
        // file or dir
        let file = {
          absolutedPath: item,
          relativePath: relativePath,
          isDir: utils.isDir(item)
        };
        pools.push(file);

        if (file.isDir) {
          let subFiles = await readdir(item, 'utf-8');
          subFiles = subFiles.map(sf => path.resolve(item, sf));
          let subRetFiles = await this.getFilesRecursive(subFiles, include, exclude);
          pools = pools.concat(subRetFiles);
        }
      }
    }

    return pools;
  }
  // required key check is undefined or not
  paramsValidator(options) {
    let ret =
      ['host', 'user', 'password', 'localDir', 'remoteDir'].every(key => {
        if (!options[key]) {
          return utils.error(`parameter ${key} is require, can't not pass ${options[key]}`);
        }
        return true;
      }) || false;

    // check localDir path is a reachable dir or not
    if (!utils.isDir(options.localDir)) {
      throw Error(`options.localDir ${options.localDir} is not a reachable path`);
    }

    // check remoteDir path is a reachable path or not
    return ret;
  }
}

module.exports = ftpUploader;
