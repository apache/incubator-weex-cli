import * as fse from 'fs-extra'
import * as path from 'path'
import * as glob from 'glob'

import { PLATFORM_TYPES } from './const'

class PlatformConfigResolver {
  public def: any = null

  private replacer: {
    plist: any
    xmlTag: any
    xmlAttr: any
    regexp: any
    moveAndReplacePackageName: any
  } = {
    plist(source, key, value) {
      const r = new RegExp('(<key>' + key + '</key>\\s*<string>)[^<>]*?</string>', 'g')
      if (key === 'WXEntryBundleURL' || key === 'WXSocketConnectionURL') {
        if (key === 'WXEntryBundleURL') {
          value = path.join('bundlejs', value)
        }
        if (!r.test(source)) {
          return source.replace(
            /<\/dict>\n?\W*?<\/plist>\W*?\n?\W*?\n?$/i,
            match => `  <key>${key}</key>\n  <string>${value}</string>\n${match}`,
          )
        }
      }
      return source.replace(r, '$1' + value + '</string>')
    },
    xmlTag(source, key, value, tagName = 'string') {
      const r = new RegExp(`<${tagName} name="${key}" .*>[^<]+?</${tagName}>`, 'g')
      return source.replace(r, `<${tagName} name="${key}">${value}</${tagName}>`)
    },
    xmlAttr(source, key, value, tagName = 'string') {
      const r = new RegExp(`<${tagName} name="${key}"\\s* value="[^"]*?"\\s*/>`, 'g')
      return source.replace(r, `<${tagName} name="${key}" value="${value}"/>`)
    },
    regexp(source, regexp, value) {
      return source.replace(regexp, function(m, a, b) {
        return a + value + (b || '')
      })
    },
    moveAndReplacePackageName(oldname, newname, basePath) {
      const oldPath = oldname.split('.').join('/')
      const newPath = newname.split('.').join('/')
      const javaSourcePath = 'app/src/main'
      const options = {}
      const files = glob.sync(path.join(basePath, javaSourcePath, '**/*.+(java|xml)'), options)
      if (Array.isArray(files)) {
        files.forEach(file => {
          let data = fse.readFileSync(file, 'utf8')
          data = data.replace(new RegExp(oldname, 'ig'), newname)
          fse.outputFileSync(file.replace(new RegExp(oldPath, 'ig'), newPath), data)
        })
      }
      if (oldPath !== newPath && Array.isArray(files) && files.length > 0) {
        // remove old java source
        fse.removeSync(path.join(basePath, javaSourcePath, 'java', oldPath))
      }
    },
  }

  constructor(def: any) {
    this.def = def
  }

  private resolveConfigDef = (source, configDef, config, key, basePath) => {
    if (configDef.type) {
      if (config[key] === undefined) {
        console.warn('Config:[' + key + '] must have a value!')
        return source
      }
      return this.replacer[configDef.type](source, configDef.key, config[key])
    } else {
      return configDef.handler(source, config[key], this.replacer, basePath)
    }
  }

  resolve(config, basePath) {
    basePath = basePath || path.join(process.cwd(), `platforms/${config.platform}`)
    for (let d in this.def) {
      if (this.def.hasOwnProperty(d)) {
        const targetPath = path.join(basePath, d)
        let source = fse.readFileSync(targetPath).toString()
        for (let key in this.def[d]) {
          if (this.def[d].hasOwnProperty(key)) {
            const configDef = this.def[d][key]
            if (Array.isArray(configDef)) {
              configDef.forEach(def => {
                source = this.resolveConfigDef(source, def, config, key, basePath)
              })
            } else {
              source = this.resolveConfigDef(source, configDef, config, key, basePath)
            }
          }
        }
        fse.writeFileSync(targetPath, source)
      }
    }
  }
}

const androidConfigResolver = new PlatformConfigResolver({
  'app/build.gradle': {
    AppId: {
      type: 'regexp',
      key: /(applicationId ")[^"]*(")/g,
    },
  },
  'app/src/main/res/values-zh-rCN/strings.xml': {
    AppName: {
      type: 'xmlTag',
      key: 'app_name',
    },
    SplashText: {
      type: 'xmlTag',
      key: 'dummy_content',
    },
  },
  'app/src/main/res/values/strings.xml': {
    AppName: {
      type: 'xmlTag',
      key: 'app_name',
    },
    SplashText: {
      type: 'xmlTag',
      key: 'dummy_content',
    },
  },
  'app/src/main/res/xml/app_config.xml': {
    WeexBundle: {
      handler: function(source, value, replacer) {
        if (!value) {
          return source
        }
        if (/https?/.test(value)) {
          source = replacer.xmlAttr(source, 'launch_locally', 'false', 'preference')
          return replacer.xmlAttr(source, 'launch_url', value, 'preference')
        } else {
          source = replacer.xmlAttr(source, 'launch_locally', 'true', 'preference')
          const name = value.replace(/\.(we|vue)$/, '.js')
          return replacer.xmlAttr(source, 'local_url', 'file://assets/dist/' + name, 'preference')
        }
      },
    },
  },
  'app/src/main/AndroidManifest.xml': {
    AppId: {
      handler: function(source, value, replacer, basePath) {
        if (!value) {
          return source
        }
        if (/package="(.*)"/.test(source)) {
          let match = /package="(.*)"/.exec(source)
          if (match[1]) {
            replacer.moveAndReplacePackageName(match[1], value, basePath)
            return source.replace(new RegExp(`${match[1]}`, 'ig'), value)
          }
          return source
        } else {
          return source
        }
      },
    },
  },
})

const iOSConfigResolver = new PlatformConfigResolver({
  'WeexDemo/WeexDemo-Info.plist': {
    AppName: {
      type: 'plist',
      key: 'CFBundleDisplayName',
    },
    Version: {
      type: 'plist',
      key: 'CFBundleShortVersionString',
    },
    BuildVersion: {
      type: 'plist',
      key: 'CFBundleVersion',
    },
    AppId: {
      type: 'plist',
      key: 'CFBundleIdentifier',
    },
    WeexBundle: {
      type: 'plist',
      key: 'WXEntryBundleURL',
    },
    Ws: {
      type: 'plist',
      key: 'WXSocketConnectionURL',
    },
  },
  'WeexDemo.xcodeproj/project.pbxproj': {
    CodeSign: [
      {
        type: 'regexp',
        key: /("?CODE_SIGN_IDENTITY(?:\[sdk=iphoneos\*])?"?\s*=\s*").*?(")/g,
      },
      {
        type: 'plist',
        key: 'CODE_SIGN_IDENTITY(\\[sdk=iphoneos\\*])?',
      },
    ],
    Profile: [
      {
        type: 'regexp',
        key: /(PROVISIONING_PROFILE\s*=\s*")[^"]*?(")/g,
      },
      {
        type: 'plist',
        key: 'PROVISIONING_PROFILE',
      },
    ],
  },
})

export default {
  [PLATFORM_TYPES.ios]: iOSConfigResolver,
  [PLATFORM_TYPES.android]: androidConfigResolver,
}
