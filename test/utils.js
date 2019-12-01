var assert = require('assert');
const utils = require('../utils/fn.js');
let describe = describe('utils', function() {
  describe('utils.getRelativePath()', function() {
    it('utils.getRelativePath()', function() {
      let filename = utils.getRelativePath(__dirname, __filename);
      assert.equal(filename, '/ftpUploader.js');
    });
  });

  describe('utils.match()', function() {
    it('a/b/c/x.js match /a/b/c/*', function() {
      assert.equal(utils.match(['/a/b/c/*'], 'a/b/c/x.js'), true);
    });
    it('./a/b/c/x.js match /a/**/c/', function() {
      assert.equal(utils.match(['/a/**/c/'], './a/b/c/x.js'), true);
    });
    it('./a/b/c/x.js match /a/b', function() {
      assert.equal(utils.match(['/a/b'], './a/b/c/x.js'), true);
    });
    it('./a/b/c/x.js match *', function() {
      assert.equal(utils.match(['*'], './a/b/c/x.js'), true);
    });
    it('./a/b/c/x.js match b', function() {
      assert.equal(utils.match(['b'], './a/b/c/x.js'), true);
    });
  });

  describe('utils.isDir()', function() {
    it('__dirname is isDir', function() {
      assert.equal(utils.isDir(__dirname), true);
    });
  });

  describe('utils.isFile()', function() {
    it('__filename is a file', function() {
      assert.equal(utils.isFile(__filename), true);
    });
  });

  describe('utils.isArray()', function() {
    it('__filename is exists', function() {
      assert.equal(utils.exists(__filename), true);
    });
  });

  describe('utils.isNull()', function() {
    it('utils.isNull(null)', function() {
      assert.equal(utils.isNull(__filename), true);
    });
  });

  describe('utils.isObject()', function() {
    it('utils.isObject({})', function() {
      assert.equal(utils.isObject({}), true);
    });
  });

  describe('utils.promisefy()', function() {
    it('utils.promisefy()', function(done) {
      let readdir = utils.promisefy(fs, fs.readdir);
      readdir(__dirname, 'utf8')
        .then(files => {
          assert.ok(true);
        })
        .catch(e => {
          console.trace(e);
          assert.ok(false);
        });
    });
  });
});
