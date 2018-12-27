import * as fse from 'fs-extra'

export default {
  
  applyPatch(file, patch) {
    let content = fse.readFileSync(file, 'utf8')

    if (content.match(patch.findPattern)) {
      content = content.replace(patch.findPattern, '')
    }

    content = content.replace(patch.pattern, match => `${patch.patch}${match}`)
    fse.writeFileSync(file, content)
  },

  makeBuildPatch(name, version) {
    let patch = ''
    if (version) {
      patch = `\tpod '${name}', '${version}'\n`
    }
    else {
      patch = `\tpod '${name}'\n`
    }

    return {
      pattern: /\t*pod\s+'\w+'\s*,?.*\n/,
      patch: patch,
      findPattern: new RegExp('\\t*pod\\s+\'' + name + '\'\\s*,?.*\\n', 'g')
    }
  },

  revokePatch(file, patch) {
    fse.writeFileSync(file, fse.readFileSync(file, 'utf8').replace(patch.findPattern, ''))
  }

}