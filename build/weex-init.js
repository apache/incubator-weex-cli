'use strict';

// weex init an project command
var yargs = require('yargs');
var argv = yargs.argv;

var generator = require('../build/generator');

generator.generate(argv._[0]);