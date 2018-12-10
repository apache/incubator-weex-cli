const path = require('path')
const fs = require('fs')

import { PLATFORM_TYPES } from './const'

const replacer = {
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
  }
}

class PlatformConfigResolver {
  public def: any = null

  constructor(def: any) {
    this.def = def
  }

  private resolveConfigDef = (source, configDef, config, key) => {
    if (configDef.type) {
      if (config[key] === undefined) {
        console.warn('Config:[' + key + '] must have a value!')
        return source
      }
      return replacer[configDef.type](source, configDef.key, config[key])
    } else {
      return configDef.handler(source, config[key], replacer)
    }
  }

  resolve(config, basePath) {
    basePath = basePath || process.cwd()
    for (let d in this.def) {
      if (this.def.hasOwnProperty(d)) {
        const targetPath = path.join(basePath, d)
        let source = fs.readFileSync(targetPath).toString()
        for (const key in this.def[d]) {
          if (this.def[d].hasOwnProperty(key)) {
            const configDef = this.def[d][key]
            if (Array.isArray(configDef)) {
              configDef.forEach(def => {
                source = this.resolveConfigDef(source, def, config, key)
              })
            } else {
              source = this.resolveConfigDef(source, configDef, config, key)
            }
          }
        }
        fs.writeFileSync(targetPath, source)
      }
    }
  }
}

const androidConfigResolver = new PlatformConfigResolver({
  'app/build.gradle': {
    AppId: {
      type: 'regexp',
      key: /(applicationId ")[^"]*(")/g,
    }
  },
  'app/src/main/res/values-zh-rCN/strings.xml': {
    AppName: {
      type: 'xmlTag',
      key: 'app_name',
    },
    SplashText: {
      type: 'xmlTag',
      key: 'dummy_content',
    }
  },
  'app/src/main/res/values/strings.xml': {
    AppName: {
      type: 'xmlTag',
      key: 'app_name',
    },
    SplashText: {
      type: 'xmlTag',
      key: 'dummy_content',
    }
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
    }
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
