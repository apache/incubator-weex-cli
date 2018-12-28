import * as fs from 'fs'
import * as tar from 'tar'
import * as zlib from 'zlib'
import * as https from 'https'

const registryurl = 'registry.npmjs.org'

const getNpmPackageInfo = async (packagename: string, version: string = 'latest') => {
  return new Promise((resolve, reject) => {
    return https.get(
      {
        host: registryurl,
        path: `/${packagename}/${version}`,
      },
      response => {
        let body = ''
        response.on('data', function(data) {
          body += data
        })
        response.on('end', function() {
          let parse = JSON.parse(body)
          resolve(parse)
        })
        response.on('error', function(error) {
          console.log(error)
          resolve(error)
        })
      },
    )
  })
}

const getLastestVersion = async name => {
  return new Promise(async (resolve, reject) => {
    let trynum = 0
    const load = async npmName => {
      if (!npmName) {
        reject('Unknow plugin')
        return
      }
      let info: any = await getNpmPackageInfo(npmName)
      let prefix
      if (info.error && trynum === 0) {
        trynum++
        if (npmName === 'weex-gcanvas') {
          prefix = 'weex-plugin--'
        } else {
          prefix = 'weex-plugin-'
        }
        await load(prefix + npmName)
      } else if (info.error && trynum !== 0) {
        reject(info.error)
        return
      } else {
        resolve(info.version)
      }
    }
    await load(name)
  })
}

const unpackTgz = (packageTgz, unpackTarget) => {
  const extractOpts = { type: 'Directory', path: unpackTarget, strip: 1 }

  return new Promise((resolve, reject) => {
    fs.createReadStream(packageTgz)
      .on('error', function(err) {
        reject('Unable to open tarball ' + packageTgz + ': ' + err)
      })
      .pipe(zlib.createUnzip())
      .on('error', function(err) {
        reject('Error during unzip for ' + packageTgz + ': ' + err)
      })
      .pipe(tar.Extract(extractOpts))
      .on('error', function(err) {
        reject('Error during untar for ' + packageTgz + ': ' + err)
      })
      .on('end', function(result) {
        resolve(result)
      })
  })
}

export default {
  getNpmPackageInfo,
  getLastestVersion,
  unpackTgz,
}
