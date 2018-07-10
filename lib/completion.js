#! /usr/bin/env node

const tabtab = require('tabtab')({
  name: 'weex',
  // cache: !process.env.WEEX_CACHE_COMPLETION
  cache: false
});

// General handler. Gets called on `program <tab>` and `program stuff ... <tab>`
tabtab.on('weex', function(data, done) {
  done(null, ['help', 'build', 'create']);
});

// Specific handler. Gets called on `weex run <tab>`
tabtab.on('run', function(data, done) {
  done(null, ['ios', 'android', 'web']);
});

// Specific handler. Gets called on `weex build <tab>`
tabtab.on('build', function(data, done) {
  done(null, ['ios', 'android', 'web']);
});



module.exports = tabtab;