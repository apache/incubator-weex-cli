var expect = require('chai').expect

var weex = require('../')
var fs = require('fs')
var File = require('gulp-util').File
var transformerVersion = require('../node_modules/weex-transformer/package.json').version

function readFile(filepath) {
  if (fs.existsSync(filepath)) {
    return fs.readFileSync(filepath, {encoding: 'utf-8'}) || ''
  }
  return ''
}

function removeEndingLineBreak(code) {
  if (code.length && code[code.length - 1] === '\n') {
    return code.substr(0, code.length - 1)
  }
  return code
}

function addVersionInfo(code) {
  return code.replace('###TRANSFORMER_VERSION###', transformerVersion)
}

describe('gulp-weex', function () {

  it('transform new format', function (done) {
    var file = new File({
      path: 'test/fixtures/single.html',
      cwd: '.',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/single.html')
    })

    var expected = removeEndingLineBreak(addVersionInfo(readFile('test/expected/single.bundle')))
    var stream = weex()
    stream.on('data', function (newFile) {
      expect(newFile).is.an.object
      expect(newFile.contents).is.existed
      expect(newFile.contents.toString()).eql(expected)
      done()
    })

    stream.write(file)
    stream.end()
  })

  it('transform module not entry', function (done) {
    var file = new File({
      path: 'test/fixtures/single.html',
      cwd: '.',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/single.html')
    })

    var expected = removeEndingLineBreak(readFile('test/expected/single-not-entry.bundle'))
    var stream = weex({isEntry: false})
    stream.on('data', function (newFile) {
      expect(newFile).is.an.object
      expect(newFile.contents).is.existed
      expect(newFile.contents.toString()).eql(expected)
      done()
    })

    stream.write(file)
    stream.end()
  })

  it('transform old format', function (done) {
    var file = new File({
      path: 'test/fixtures/single.html',
      cwd: '.',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/single.html')
    })

    var expected = removeEndingLineBreak(addVersionInfo(readFile('test/expected/single-old.bundle')))
    var stream = weex({oldFormat: true})
    stream.on('data', function (newFile) {
      expect(newFile).is.an.object
      expect(newFile.contents).is.existed
      expect(newFile.contents.toString()).eql(expected)
      done()
    })

    stream.write(file)
    stream.end()
  })

  it('transform components', function (done) {
    var file = new File({
      path: 'test/fixtures/multi.html',
      cwd: '.',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/multi.html')
    })

    var expected = removeEndingLineBreak(addVersionInfo(readFile('test/expected/multi.bundle')))
    var stream = weex({logLevel: 'NOTE'})
    stream.on('data', function (newFile) {
      expect(newFile).is.an.object
      expect(newFile.contents).is.existed
      expect(newFile.contents.toString()).eql(expected)
      done()
    })

    stream.write(file)
    stream.end()
  })
})
