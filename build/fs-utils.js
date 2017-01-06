'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs'),
    os = require('os'),
    url = require('url'),
    path = require('path'),
    fse = require('fs-extra'),
    _ = require("underscore");

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function copyRecursiveSync(src, dest, reFilter) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    try {
      fs.mkdirSync(dest);
    } catch (e) {
      fse.removeSync(dest);
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function (childItemName) {
      if (reFilter.test(childItemName) && /[^(weex_tmp)]/.test(childItemName)) {
        // TODO: hardcode
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      }
    });
  } else {
    try {
      fs.linkSync(src, dest);
    } catch (e) {
      fse.removeSync(dest);
      fs.linkSync(src, dest);
    }
  }
}
//wrapper for union
function getTransformerWraper(rootPath, transformerFunc) {
  var transformerWraper = function transformerWraper(req, res) {
    var urlObj = url.parse(req.url);
    var filePath = urlObj.pathname;
    if (filePath.endsWith(".we")) {
      (function () {
        if (filePath[0] == "/") {
          filePath = filePath.substring(1, filePath.length);
        }
        var wePath = path.join(rootPath, filePath);
        //console.log(`file ${filePath}`)                                                  
        //console.log(`root  ${rootPath}`)          
        //console.log(`we ${wePath}`)                              
        var filename = path.basename(wePath).replace(/\..+/, '');
        var tmpdir = os.tmpdir();
        var jsPath = path.join(tmpdir, filename + '.js');
        var transformP = transformerFunc(wePath, jsPath);
        transformP.then(function () {
          fs.readFile(jsPath, 'utf8', function (err, data) {
            if (err) {
              console.error(err);
              res.writeHead(500, {
                'Content-Type': 'text/plain'
              });
              res.end('Server Error\n');
            } else {
              res.writeHead(200, {
                'Content-Type': 'application/javascript'
              });
              res.end(data);
            }
          });
        }).catch(function (e) {
          console.error(e);
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          });
          res.end('Server Error\n');
        });
      })();
    } else {
      res.emit('next');
    }
  };
  return transformerWraper;
}

// replace file contents
function replace(filePath, regarr) {
  return new _promise2.default(function (resolve, reject) {
    var content = fs.readFileSync(filePath, {
      encoding: 'utf-8'
    });
    return resolve(content);
  }).then(function (content) {
    regarr.forEach(function (regObj) {
      content = content.replace(regObj.rule, function () {
        return regObj.scripts;
      });
    });
    return fs.writeFileSync(filePath, content);
  });
}

module.exports = {
  deleteFolderRecursive: deleteFolderRecursive,
  copyRecursiveSync: copyRecursiveSync,
  getTransformerWraper: getTransformerWraper,
  replace: replace
};