var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
var expect = chai.expect
chai.use(sinonChai)

var styler = require('../')

describe('parse', function () {

  it('parse normal style code', function (done) {
    var code = 'html {color: #000000;}\n\n.foo {color: red; background-color: rgba(255,255,255,0.6); -webkit-transform: rotate(90deg); width: 200px; left: 0; right: 0px}'
    styler.parse(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({foo: {color: '#FF0000', backgroundColor: 'rgba(255,255,255,0.6)', WebkitTransform: 'rotate(90deg)', width: 200, left: 0, right: 0}})
      expect(data.log).eql([
        {line: 1, column: 1, reason: 'ERROR: Selector `html` is not supported. Weex only support single-classname selector'},
        {line: 3, column: 7, reason: 'NOTE: property value `red` is autofixed to `#FF0000`'},
        {line: 3, column: 60, reason: 'WARNING: `-webkit-transform` is not a standard property name'},
        {line: 3, column: 94, reason: 'NOTE: property value `200px` is autofixed to `200`'},
        {line: 3, column: 117, reason: 'NOTE: property value `0px` is autofixed to `0`'}
      ])
      done()
    })
  })

  it('parse and fix prop value', function (done) {
    var code = '.foo {font-size: 200px;}'
    styler.parse(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({foo: {fontSize: 200}})
      done()
    })
  })

  it('parse and ensure number type value', function (done) {
    var code = '.foo {line-height: 40;}\n\n .bar {line-height: 20px;}'
    styler.parse(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({foo: {lineHeight: 40}, bar: {lineHeight: 20}})
      done()
    })
  })

  it('handle complex class definition', function (done) {
    var code = '.foo, .bar {font-size: 20; color: #000000}\n\n .foo, .bar, .baz {color: #ff5000; height: 30;}'
    styler.parse(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({
        foo: {fontSize: 20, color: '#ff5000', height: 30},
        bar: {fontSize: 20, color: '#ff5000', height: 30},
        baz: {color: '#ff5000', height: 30}
      })
      done()
    })
  })

  it('handle syntax error', function (done) {
    var code = 'asdf'
    styler.parse(code, function (err, data) {
      expect(err).is.an.array
      expect(err[0].toString()).eql('Error: undefined:1:5: missing \'{\'')
      expect(err[0].reason).eql('missing \'{\'')
      expect(err[0].filename).eql(undefined)
      expect(err[0].line).eql(1)
      expect(err[0].column).eql(5)
      expect(err[0].source).eql('')
      expect(data.log).eql([{line: 1, column: 5, reason: 'ERROR: undefined:1:5: missing \'{\''}])
      done()
    })
  })
})
