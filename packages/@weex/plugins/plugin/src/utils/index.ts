import * as npm from 'npm'
import * as colors from 'colors'
import * as path from 'path'
import * as fs from 'fs-extra'

const isNewVersionPlugin = (pluginName, version) => {
  return new Promise((resolve, reject) => {
    let trynum = 0
    npm.load( ()=> {
      const load =  (npmName) => {
        npm.commands.info([npmName + '@' + version],  (error, result) => {
          let prefix
          if (error && trynum === 0) {
            trynum++
            if (npmName === 'weex-gcanvas') {
              prefix = 'weex-plugin--'
            }
            else {
              prefix = 'weex-plugin-'
            }
            load(prefix + npmName)
          }
          else if (error && trynum !== 0) {
            reject(error) 
          }
          else {
            const packages = result[version]
            if (packages.android || packages.ios || packages.web) {
              const supports = []
              if (packages.android) {
                supports.push('Android')
              }
              if (packages.ios) {
                supports.push('iOS')
              }
              if (packages.web) {
                supports.push('Web')
              }
              console.log(colors.green(`This plugin support for ${supports.join(',')} platforms.`))
              resolve({
                ios: packages.ios,
                android: packages.android,
                web: packages.web,
                version: packages.version,
                name: packages.name,
                weexpack: packages.weexpack,
                pluginDependencies: packages.pluginDependencies
              })
            }
            else {
              resolve(false)
            }
          }
        })
      }
      load(pluginName)
    })
  })
}

const findXcodeProject = (dir) => {
 if (!fs.existsSync(dir)) {
   return false
 }
 const files = fs.readdirSync(dir)
 const sortedFiles = files.sort()
 for (let i = sortedFiles.length - 1; i >= 0; i--) {
   const fileName = files[i]
   const ext = path.extname(fileName)

   if (ext === '.xcworkspace') {
     return {
       name: fileName,
       isWorkspace: true
     }
   }
   if (ext === '.xcodeproj') {
     return {
       name: fileName,
       isWorkspace: false
     }
   }
 }
 return null
}

const isIOSProject = (dir) => {
  const result = findXcodeProject(dir)
  return result
}

export default {
  isNewVersionPlugin,
  isIOSProject
}