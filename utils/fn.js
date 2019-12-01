let fs = require('fs');
let logUtils = require('./log.js');

// get relative path from fromRoot
// return relative path
function getRelativePath(path, fromRoot) {
  // no slash at last char
  if (fromRoot.slice(-1) === '/') fromRoot = fromRoot.slice(0, -1);
  let relativePath = path.split(fromRoot);
  return relativePath[1];
}
// console.log(getRelativePath('/a/b/c/s/d.js', '/a/b/c/'));

// check the path is in restrict rules
// @rules ['a', '/a', '*']   @relativePath './' | './../' | ''
function match(rules, relativePath) {
  if (typeof rules === 'string') rules = [rules];
  if (!rules.length) return false;

  // extract a/./b => a/b unless startWidth './'
  if (relativePath.startsWith('./')) {
    relativePath = relativePath.slice(1);
  }

  relativePath = prettyPath(relativePath);

  return rules.some(rule => {
    let isRegExp = rule instanceof RegExp;

    let isString = typeof rule === 'string';
    if (isRegExp) {
      // RegExp rules
      return rule.test(relativePath);
    } else if (isString) {
      // string rules
      // * => [^/]+,
      // xx/* => xx\/.*
      // xx/xx/*.js => xx\/xx\/[^\/]+.js
      // xx/**/a.js => xx/.*\/a.js
      if (rule.startsWith('/')) {
        rule = '^' + rule;
      }
      // console.log('/a/**/b'.replace(/\*\*/g, '.*'));
      rule = rule.replace(/\*\*/g, '.*');

      // /a/* => /a/[^\\]+
      // console.log('/a/*'.replace(/\*/g, '[^\\]+'))
      rule = rule.replace(/\*/g, '[^\\]+');

      // /a/b => \/a\/b
      // console.log('/a/b'.replace(/\//g, '\\/'))
      rule = rule.replace(/\//g, '\\/');

      return new RegExp(rule).test(relativePath);
    }
  });
}
// console.log(match(['a'], '/a/b/c/d'));

// check path is exist
function exists(path) {
  return fs.existsSync(path);
}

// check path is file
function isFile(path) {
  return exists(path) && fs.statSync(path).isFile();
}

// check path is dir
function isDir(path) {
  return exists(path) && fs.statSync(path).isDirectory();
}

// get type of the params
function getType(val) {
  return Object.prototype.toString.call(val);
}
function isArray(val) {
  return getType(val) === '[object Array]';
}
function isObject(val) {
  return getType(val) === '[object Object]';
}
function isNull(val) {
  return getType(val) === '[object Null]';
}

// promisefy utils fn return a promise
function promisefy(context, fn) {
  // check the fn is undefine;
  if (!fn || (typeof fn !== 'object' && typeof fn !== 'function'))
    return logUtils.error(`promisefy parameter must be required, now context ${context}, fnName is ${fn}!`);

  // wrapper fn
  return function() {
    let resolve, reject;
    let promise = new Promise((rs, rj) => {
      resolve = rs;
      reject = rj;
    });

    // error check
    let args = Array.from(arguments);
    args.push(function(err, files) {
      if (err) reject(err);
      resolve(files);
    });
    fn.bind(context)(...args);

    return promise;
  };
}

// clear relative path
function prettyPath(filePath) {
  // extract a/b1/./b2 => 'a/b1/b2'
  filePath = filePath.replace(/\.\//g, '');

  // extract a/b1/../b2 => 'a/b2'
  filePath = filePath.replace(/[^/]+\/\.\.\//g, '');

  return filePath;
}

module.exports = {
  getRelativePath,
  match,
  exists,
  isFile,
  isDir,
  isArray,
  isNull,
  isObject,
  promisefy,
  prettyPath
};
