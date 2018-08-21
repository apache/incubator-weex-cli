'use strict';

const fse = require('fs-extra');

console.log('argv=', process.argv);

try {
  fse.removeSync(process.argv[2]);
  console.log('done');
  process.exit()
}
catch (e) {
  console.log('error', e);
  process.exit(1)
}