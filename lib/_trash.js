'use strict';

const fse = require('fs-extra');

const trash = async () => {
  console.log('argv=', process.argv);
  try {
    await fse.removeAsync(process.argv[2]);
    console.log('done');
    process.exit()
  }
  catch (e) {
    console.log('error', e);
    process.exit(1)
  }
}