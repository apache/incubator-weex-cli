var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
var expect = chai.expect
chai.use(sinonChai)

var styler = require('../')

describe('validate', function () {

  it('parse normal style code', function (done) {
    var code = {
      foo: {
        color: '#FF0000',
        width: '200',
        position: 'sticky',
        zIndex: 4
      }
    }
    styler.validate(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({foo: {color: '#FF0000', width: 200, position: 'sticky', zIndex: 4}})
      expect(data.log).eql([])
      done()
    })
  })

  it('parse length', function (done) {
    var code = {
      foo: {
        width: '200px',
        paddingLeft: '300',
        margin: '10.5px',
        left: '0',
        right: '0px',
        marginRight: 'asdf'
      }
    }
    styler.validate(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({foo: {
        width: 200,
        paddingLeft: 300,
        margin: 10.5,
        left: 0,
        right: 0
      }})
      expect(data.log).eql([
        {reason: 'NOTE: property value `200px` is autofixed to `200`'},
        {reason: 'NOTE: property value `10.5px` is autofixed to `10.5`'},
        {reason: 'NOTE: property value `0px` is autofixed to `0`'},
        {reason: 'ERROR: property value `asdf` is not supported for `margin-right` (only number and pixel values are supported)'}
      ])
      done()
    })
  })

  it('parse number', function (done) {
    var code = {
      foo: {
        opacity: '1'
      },
      bar: {
        opacity: '0.5'
      },
      baz: {
        opacity: 'a'
      },
      boo: {
        opacity: '0.5a'
      },
      zero: {
        opacity: '0'
      }
    }
    styler.validate(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({
        foo: {
          opacity: 1
        },
        bar: {
          opacity: 0.5
        },
        baz: {},
        boo: {},
        zero: {
          opacity: 0
        }
      })
      expect(data.log).eql([
        {reason: 'ERROR: property value `a` is not supported for `opacity` (only number is supported)'},
        {reason: 'ERROR: property value `0.5a` is not supported for `opacity` (only number is supported)'}
      ])
      done()
    })
  })

  it('parse integer', function (done) {
    var code = {
      foo: {
        zIndex: '1'
      },
      bar: {
        zIndex: '0.5'
      },
      baz: {
        zIndex: 'a'
      },
      boo: {
        zIndex: '0.5a'
      },
      zero: {
        zIndex: '0'
      }
    }
    styler.validate(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({
        foo: {
          zIndex: 1
        },
        bar: {},
        baz: {},
        boo: {},
        zero: {
          zIndex: 0
        }
      })
      expect(data.log).eql([
        {reason: 'ERROR: property value `0.5` is not supported for `z-index` (only integer is supported)'},
        {reason: 'ERROR: property value `a` is not supported for `z-index` (only integer is supported)'},
        {reason: 'ERROR: property value `0.5a` is not supported for `z-index` (only integer is supported)'}
      ])
      done()
    })
  })

  it('parse color', function (done) {
    var code = {
      foo: {
        color: '#FF0000',
        backgroundColor: '#ff0000'
      },
      bar: {
        color: '#F00',
        backgroundColor: '#f00'
      },
      baz: {
        color: 'red',
        backgroundColor: 'lightpink'
      },
      rgba: {
        color: 'rgb(23, 0, 255)',
        backgroundColor: 'rgba(234, 45, 99, .4)'
      },
      transparent: {
        color: 'transparent',
        backgroundColor: 'asdf'
      },
      errRgba: {
        color: 'rgb(266,0,255)',
        backgroundColor: 'rgba(234,45,99,1.3)'
      }
    }
    styler.validate(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({
        foo: {
          color: '#FF0000',
          backgroundColor: '#ff0000'
        },
        bar: {
          color: '#FF0000',
          backgroundColor: '#ff0000'
        },
        baz: {
          color: '#FF0000',
          backgroundColor: '#FFB6C1'
        },
        rgba: {
          color: 'rgb(23,0,255)',
          backgroundColor: 'rgba(234,45,99,0.4)'
        },
        transparent: {
          color: 'rgba(0,0,0,0)'
        },
        errRgba: {}
      })
      expect(data.log).eql([
        {reason: 'NOTE: property value `#F00` is autofixed to `#FF0000`'},
        {reason: 'NOTE: property value `#f00` is autofixed to `#ff0000`'},
        {reason: 'NOTE: property value `red` is autofixed to `#FF0000`'},
        {reason: 'NOTE: property value `lightpink` is autofixed to `#FFB6C1`'},
        {reason: 'ERROR: property value `asdf` is not valid for `background-color`'},
        {reason: 'ERROR: property value `rgb(266,0,255)` is not valid for `color`'},
        {reason: 'ERROR: property value `rgba(234,45,99,1.3)` is not valid for `background-color`'}
      ])
      done()
    })
  })

  it('parse enum', function (done) {
    var code = {
      foo: {
        position: 'absolute'
      },
      bar: {
        position: 'relative'
      },
      baz: {
        position: 'fixed'
      },
      boo: {
        position: ''
      }
    }
    styler.validate(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({
        foo: {
          position: 'absolute'
        },
        bar: {
          position: 'relative'
        },
        baz: {
          position: 'fixed'
        },
        boo: {}
      })
      expect(data.log).eql([
        {reason: 'NOTE: property value `relative` is the DEFAULT value for `position` (could be removed)'},
        {reason: 'ERROR: property value `` is not supported for `position` (supported values are: `relative`|`absolute`|`sticky`|`fixed`)'}
      ])
      done()
    })
  })

  it('parse unknown', function (done) {
    var code = {
      foo: {
        abc: '123',
        AbcDef: '456',
        abcDef: 'abc'
      }
    }
    styler.validate(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({
        foo: {
          abc: 123,
          AbcDef: 456,
          abcDef: 'abc'
        }
      })
      expect(data.log).eql([
        {reason: 'WARNING: `abc` is not a standard property name'},
        {reason: 'WARNING: `-abc-def` is not a standard property name'},
        {reason: 'WARNING: `abc-def` is not a standard property name'}
      ])
      done()
    })
  })

  it('parse complex style code', function (done) {
    var code = {
      foo: {
        color: 'red',
        WebkitTransform: 'rotate(90deg)',
        width: '200px'
      }
    }
    styler.validate(code, function (err, data) {
      expect(err).is.undefined
      expect(data).is.an.object
      expect(data.jsonStyle).eql({foo: {color: '#FF0000', WebkitTransform: 'rotate(90deg)', width: 200}})
      expect(data.log).eql([
        {reason: 'NOTE: property value `red` is autofixed to `#FF0000`'},
        {reason: 'WARNING: `-webkit-transform` is not a standard property name'},
        {reason: 'NOTE: property value `200px` is autofixed to `200`'}
      ])
      done()
    })
  })
})
