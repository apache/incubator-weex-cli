'use strict';

var prompt = require('prompt');
var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
exports.generate = function (name) {
  if (typeof name == 'undefined') {
    (function () {
      var dirname = path.resolve('.').split(path.sep).pop();
      getName(dirname, chalk.green('Generate project in current directory?(Y/n)'), function (err, result) {
        if (result.name.toLowerCase() === 'n') {
          return;
        }
        var dirpath = process.cwd();
        var projectName = result.name.toLocaleLowerCase() === 'y' ? dirname : result.name;
        copy(projectName, dirpath);
        replace(projectName, dirpath);
      });
    })();
  } else {
    getName(name, chalk.green('Init your Project'), function (err, result) {
      if (err) {
        return;
      }
      var projectName = result.name;
      var dirpath = path.join(process.cwd(), projectName);
      createProject(projectName, dirpath);
    });
  }
};

function getName(name) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Project Name";
  var done = arguments[2];

  var schema = {
    properties: {
      name: {
        message: message,
        default: name
      }
    }
  };
  prompt.start();
  prompt.get(schema, done);
}

// init a project
function createProject(name, dirpath) {
  fs.mkdir(dirpath, 484, function (err) {
    if (err) {
      if (err.code == 'EEXIST') {
        return console.log(chalk.red('the folder "' + name + '" exists! Please rename your project.'));
      } else {
        console.error(err);
      }
    } else {
      copy(name, dirpath);
      replace(name, dirpath);
    }
  });
}

function copy(name, dirpath) {
  var files = [];
  var src = path.join(__dirname, '..', 'vue-template/template');
  walk(src, files);
  files.forEach(function (file) {
    var relative = path.relative(src, file);
    var finalPath = path.join(dirpath, relative).replace(/\.npmignore$/, '.gitignore');
    if (!fs.existsSync(finalPath)) {
      console.log(chalk.grey('file: ' + finalPath + ' created.'));

      fs.copySync(file, finalPath);
    } else {
      console.log('file: ' + finalPath + ' already existed.');
    }
  });
}

function replace(name, dirpath) {
  var files = ['package.json', 'README.md'];
  files.forEach(function (file) {
    var filePath = path.join(dirpath, file);
    var content = fs.readFileSync(filePath, {
      encoding: 'utf-8'
    });
    content = content.replace(/<=\s*(.+)\s*=>/ig, function (defaultName) {
      return name || defaultName;
    });
    fs.writeFileSync(filePath, content);
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