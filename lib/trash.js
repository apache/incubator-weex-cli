'use strict';

const path = require('path');
const spawn = require('cross-spawn');

module.exports = function(file) {
  console.log(process.execPath, path.join(__dirname, '_trash.js'))
  try {
    spawn(
      process.execPath,
      [path.join(__dirname, '_trash.js'), file],
      {'stdio': ['ignore', 'ignore', 'ignore'], 'detached': true}
    ).unref();
  } catch(e) {
    console.log(e)
  }
};