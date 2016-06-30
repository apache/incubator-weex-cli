'use strict';

var prompt = require('prompt');
var fs = require('fs-extra');
var path = require('path');

exports.generate = function () {
  var name = path.resolve('.').split(path.sep).pop();
  getName(name, function (err, result) {
    if (err) {
      return;
    }
    copy();
    replace(result.name);
  });
};

function getName(defaultName, done) {
  var schema = {
    properties: {
      name: {
        message: 'Project Name',
        default: defaultName
      }
    }
  };
  prompt.start();
  prompt.get(schema, done);
}

function copy() {
  var files = [];
  var src = path.join(__dirname, '..', 'project-template');
  var dest = '.';
  walk(src, files);
  files.forEach(function (file) {
    var relative = path.relative(src, file);
    var finalPath = path.join(dest, relative).replace(/\.npmignore$/, '.gitignore');
    if (!fs.existsSync(finalPath)) {
      console.log('file: ' + finalPath + ' created.');
      fs.copySync(file, finalPath);
    } else {
      console.log('file: ' + finalPath + ' already existed.');
    }
  });
}

function replace(name) {
  var files = ['package.json', 'README.md'];
  files.forEach(function (file) {
    var content = fs.readFileSync(file, { encoding: 'utf-8' });
    content = content.replace(/<=\s*(.+)\s*=>/ig, function (defaultName) {
      return name || defaultName;
    });
    fs.writeFileSync(file, content);
  });
}

/**
 * ref: http://stackoverflow.com/a/16684530
 */
function walk(dir, files) {
  var list = fs.readdirSync(dir);

  list.forEach(function (file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file, files);
    } else {
      files.push(file);
    }
  });
}