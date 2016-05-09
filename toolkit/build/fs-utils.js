'use strict';

var fs = require('fs'),
    _ = require("underscore"),
    weexTransformer = require('weex-transformer'),
    path = require('path');

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

function copyRecursiveSync(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.linkSync(src, dest);
  }
}

//wrapper for union

function getTransformerWraper(rootPath) {

  var transformerWraper = function transformerWraper(req, res) {
    var filePath = req.url;
    if (filePath.endsWith(".we")) {
      //console.log(filePath)
      if (filePath[0] == "/") {
        filePath = filePath.substring(1, filePath.length);
      }
      filePath = path.join(rootPath, filePath);
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Server Error\n');
        } else {
          var filename = path.basename(filePath).replace(/\..+/, '');
          var transRes = weexTransformer.transform(filename, data, "");
          var logs = transRes.logs;
          try {
            logs = _.filter(logs, function (l) {
              return l.reason.indexOf("Warning:") == 0 || l.reason.indexOf("Error:") == 0;
            });
            if (logs.length > 0) {
              console.info('weex transformer complain:  ' + filePath + ' \n');
            }
            _.each(logs, function (l) {
              return console.info('    line' + l.line + ',column' + l.column + ':\n        ' + l.reason + '\n');
            });
          } catch (e) {
            console.error(e);
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(transRes.result);
        }
      });
    } else {
      res.emit('next');
    }
  };

  return transformerWraper;
}

module.exports = {
  deleteFolderRecursive: deleteFolderRecursive,
  copyRecursiveSync: copyRecursiveSync,
  getTransformerWraper: getTransformerWraper
};