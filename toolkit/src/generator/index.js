const prompt = require('prompt')
const fs = require('fs-extra')
const path = require('path')

exports.generate = function () {
  name = path.resolve('.').split(path.sep).pop()
  getName(name, function (err, result) {
    if (err) {
      return
    }
    copy()
    replace(result.name)
  })
}

function getName(defaultName, done) {
  const schema = {
    properties: {
      name: {
        message: 'Project Name',
        default: defaultName
      }
    }
  };
  prompt.start()
  prompt.get(schema, done)
}

function copy() {
  const files = []
  const src = path.join(__dirname, 'assets')
  const dest = '.'
  walk(src, files)
  files.forEach(file => {
    const relative = path.relative(src, file)
    const finalPath = path.join(dest, relative)
    fs.copySync(file, finalPath)
  })
}

function replace(name) {
  const files = ['package.json', 'README.md']
  files.forEach(file => {
    var content = fs.readFileSync(file, {encoding: 'utf-8'})
    content = content.replace(/<=\s*(.+)\s*=>/ig, function (defaultName) {
      return name || defaultName
    })
    fs.writeFileSync(file, content)
  })
}

/**
 * ref: http://stackoverflow.com/a/16684530
 */
function walk (dir, files) {
  const list = fs.readdirSync(dir)

  list.forEach(function (file) {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      walk(file, files)
    }
    else {
      files.push(file)
    }
  })
}
