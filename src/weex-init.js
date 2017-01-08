// weex init an project command
const yargs = require('yargs');
const argv = yargs.argv;

const generator = require('../build/generator');

generator.generate(argv._[0]);