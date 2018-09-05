import { TEMPLATE_NAME } from './utils/index';
const download = require('download-git-repo');
import * as path from 'path';
import * as fs from 'fs';
import render from './render';
import * as rimraf from 'rimraf';

interface Metadate {
  [propName: string]: any;
}
const defautlTarget = path.join(path.dirname(__dirname), TEMPLATE_NAME);
export function generator(projectName: string, source: string, dest:string, metadata: Metadate):Promise<boolean> {

  console.log('generator.ts', projectName, source, dest);

  return new Promise((resolve, reject) => {
    render(source, dest, metadata);
  });
}

interface CloneOption {
  cache: boolean;
}

export function clone(templateUrl: string, target = defautlTarget, option?: CloneOption) {
  console.log('templateUrl', templateUrl, target)
  return new Promise((resolve, reject) => {
    if (option && option.cache) {
      resolve(target);
    } else if(fs.existsSync(target)) {
      rimraf(target, () => {
        done();
      });
    } else {
      done();
    }
    function done() {
      download(templateUrl, target, { clone: true }, (err) => {
        // download('direct:https://github.com/balloonzzq/webpack.git#temp', target, { clone: true }, (err) => {
        console.log(err ? 'downloadError' : 'Success');
        if (err) {
          reject(err);
        } else {
          resolve(target);
        }
      });
    }
  });
}
