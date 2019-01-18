#!/usr/bin/env node
"use strict";

// first, do a sniff test to ensure our dependencies are met
const sniff = require('../lib/sniff')
const colors = require('colors')

// check the node version
if (!sniff.isNewEnough) {
  console.log('Node.js 7.6.0 + is required to run. You have ' + sniff.nodeVersion + '.');
  console.log(colors.grey('You can install the latest version here: https://nodejs.org/en/'))
  process.exit(1);
}

require('../lib/cli')(process.argv);

process.on('SIGINT', function () {
  process.exit();
});