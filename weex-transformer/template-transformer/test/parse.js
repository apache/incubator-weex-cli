var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
var expect = chai.expect
chai.use(sinonChai)

var templater = require('../')

function stringify(json) {
  return JSON.stringify(json, function replacer(key, value) {
    if (typeof value === 'function') {
      return value.toString()
    }
    return value;
  }, 2)
}

describe('parse', function () {
  it('parse normal template code', function (done) {
    var code = '<container><text>Hello</text><img class="a {{x}} c" src="{{y}}" /><image style="opacity: {{z}}"></image></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', attr: {value: 'Hello'}},
          {type: 'image', classList: function () {return ['a', this.x, 'c']}, attr: {src: function () {return this.y}}},
          {type: 'image', style: {opacity: function () {return this.z}}}
        ]
      },
      deps: ['container', 'text', 'image'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse root with space around', function (done) {
    var code = ' <container></container> '
    var expected = {
      jsonTemplate: {
        type: 'container'
      },
      deps: ['container'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse multiple root', function (done) {
    var code = '<container></container><container></container>'
    var expected = {
      jsonTemplate: {},
      deps: [],
      log: [{reason: 'ERROR: only one root element required', line: 1, column: 1}]
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse root attributes', function (done) {
    var code = '<container id="main" style="x: a; y: b" class="a b c" x="a" if="a" onclick="a"><text>abc</text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        id: 'main',
        style: {x: 'a', y: 'b'},
        classList: ['a', 'b', 'c'],
        attr: {x: 'a'},
        shown: function () {return this.a},
        events: {click: 'a'},
        children: [
          {type: 'text', attr: {value: 'abc'}}
        ]
      },
      deps: ['container', 'text'],
      log: [
        {line: 1, column: 1, reason: 'WARNING: `x` is not a standard property name'},
        {line: 1, column: 1, reason: 'WARNING: `y` is not a standard property name'}
      ]
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse and ignore space text value', function (done) {
    var code = '<container>\n  <text>abc</text>\t</container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', attr: {value: 'abc'}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse text space around data', function (done) {
    var code = '<container><text> a {{c}} </text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', attr: {value: function () {return 'a ' + (this.c)}}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse id', function (done) {
    var code = '<container><text></text><text id="abc"></text><text id="{{abc}}"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text'},
          {type: 'text', id: 'abc'},
          {type: 'text', id: function () {return this.abc}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse class', function (done) {
    var code = '<container><text></text><text class="a b c"></text><text class="a {{b}} c"></text><text class="a b{{b}} c"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text'},
          {type: 'text', classList: ['a', 'b', 'c']},
          {type: 'text', classList: function () {return ['a', this.b, 'c']}},
          {type: 'text', classList: function () {return ['a', 'b' + (this.b), 'c']}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse complex class', function (done) {
    var code = '<container><text class="a b{{b ? \'d\' : \'f\' }} c"></text><text class=" b{{b ? \'d\' : \'f\' }} a {{c + d}}"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', classList: function () {return ['a', 'b' + (this.b?'d':'f'), 'c']}},
          {type: 'text', classList: function () {return ['b' + (this.b?'d':'f'), 'a', this.c+this.d]}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse style', function (done) {
    var code = '<container><text></text><text style="color: #FF0000; background-color: rgba(2,2,2,2); padding: 8px;"></text><text style="x: a; y: b; z: {{c}}"></text><text style="background-color: {{active ? \'#ff0000\' : \'#00ff00\'}};"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text'},
          {type: 'text', style: {color: '#FF0000', padding: 8}},
          {type: 'text', style: {x: 'a', y: 'b', z: function () {return this.c}}},
          {type: 'text', style: {backgroundColor: function () {return this.active?'#ff0000':'#00ff00'}}}
        ]
      },
      deps: ['container', 'text'],
      log: [
        {line: 1, column: 25, reason: 'ERROR: property value `rgba(2,2,2,2)` is not valid for `background-color`'},
        {line: 1, column: 25, reason: 'NOTE: property value `8px` is autofixed to `8`'},
        {line: 1, column: 109, reason: 'WARNING: `x` is not a standard property name'},
        {line: 1, column: 109, reason: 'WARNING: `y` is not a standard property name'},
        {line: 1, column: 109, reason: 'WARNING: `z` is not a standard property name'}
      ]
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse if', function (done) {
    var code = '<container><text if="a"></text><text if="{{a}}"></text><text if="{{a()}}"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', shown: function () {return this.a}},
          {type: 'text', shown: function () {return this.a}},
          {type: 'text', shown: function () {return this.a()}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse repeat', function (done) {
    var code = '<container><text repeat="a"></text><text repeat="{{a}}"></text><text repeat="{{a()}}"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', repeat: function () {return this.a}},
          {type: 'text', repeat: function () {return this.a}},
          {type: 'text', repeat: function () {return this.a()}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse repeat key/value', function (done) {
    var code = '<container><text repeat="v in listOrMap"></text><text repeat="{{v in listOrMap}}"></text><text repeat="(k, v) in listOrMap"></text><text repeat="{{(k, v) in listOrMap}}"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', repeat: {expression: function () {return this.listOrMap}, value: 'v'}},
          {type: 'text', repeat: {expression: function () {return this.listOrMap}, value: 'v'}},
          {type: 'text', repeat: {expression: function () {return this.listOrMap}, key: 'k', value: 'v'}},
          {type: 'text', repeat: {expression: function () {return this.listOrMap}, key: 'k', value: 'v'}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse else with if', function (done) {
    var code = '<container><text if="a && b"></text><text else></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', shown: function () {return this.a&&this.b}},
          {type: 'text', shown: function () {return !(this.a&&this.b)}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse else without if', function (done) {
    var code = '<container><container><text></text><text else></text></container><container><text else></text></container></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'container', children: [{type: 'text'}, {type: 'text'}]},
          {type: 'container', children: [{type: 'text'}]}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse append', function (done) {
    var code = '<container append="tree"><container append="{{mode}}"></container></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        append: 'tree',
        children: [
          {type: 'container', append: function () {return this.mode}}
        ]
      },
      deps: ['container'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse events', function (done) {
    var code = '<container><text onclick="a" onappear="{{a()}}"></text><text onclick="{{a}}" onappear="{{a(x, 1, \'2\', $event)}}"></text><text onappear="{{a(x, $event, 1, \'2\')}}"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', events: {click: 'a', appear: function ($event) {this.a($event)}}},
          {type: 'text', events: {click: 'a', appear: function ($event) {this.a(this.x,1,'2',$event)}}},
          {type: 'text', events: {appear: function ($event) {this.a(this.x,$event,1,'2')}}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse attributes', function (done) {
    var code = '<container><text x="a" y="b"></text><text x="{{a}}" y="b"></text><text x="a" y="{{b()}}"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', attr: {x: 'a', y: 'b'}},
          {type: 'text', attr: {x: function () {return this.a}, y: 'b'}},
          {type: 'text', attr: {x: 'a', y: function () {return this.b()}}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse default attributes', function (done) {
    var code = '<container><cell></cell></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'cell', append: 'tree'}
        ]
      },
      deps: ['container', 'cell'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse value', function (done) {
    var code = '<container><text value="a"></text><text value="a{{b}}c"></text><text>a</text><text>a{{b}}c</text><text value="a{{b}}c">d{{e}}f</text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', attr: {value: 'a'}},
          {type: 'text', attr: {value: function () {return 'a' + (this.b) + 'c'}}},
          {type: 'text', attr: {value: 'a'}},
          {type: 'text', attr: {value: function () {return 'a' + (this.b) + 'c'}}},
          {type: 'text', attr: {value: function () {return 'd' + (this.e) + 'f'}}}
        ]
      },
      deps: ['container', 'text'],
      log: [
        {line: 1, column: 12, reason: 'NOTE: `value` could be written as text content in <text>'},
        {line: 1, column: 35, reason: 'NOTE: `value` could be written as text content in <text>'},
        {line: 1, column: 98, reason: 'NOTE: `value` could be written as text content in <text>'}
      ]
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse complex value', function (done) {
    var code = '<container><text>{{data.items[0].title[0].valueDesc}}</text><text>{{ a }} and {{ b[c.d][0] ? \'a\' : "b" }} hhh {{parseInt("65")}}</text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', attr: {value: function () {return this.data.items[0].title[0].valueDesc}}},
          {type: 'text', attr: {value: function () {return (this.a) + ' and ' + (this.b[this.c.d][0]?'a':"b") + ' hhh ' + (parseInt("65"))}}}
        ]
      },
      deps: ['container', 'text'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse hyphenated attr name', function (done) {
    var code = '<container><text aaa-bbb-ccc ddd-eee-fff="ggg-hhh-iii" style="padding-left: 3; -webkit-transform: none;"></text></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'text', attr: {aaaBbbCcc: '', dddEeeFff: 'ggg-hhh-iii'}, style: {paddingLeft: 3, WebkitTransform: 'none'}}
        ]
      },
      deps: ['container', 'text'],
      log: [{line: 1, column: 12, reason: 'WARNING: `-webkit-transform` is not a standard property name'}]
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse empty attr value', function (done) {
    var code = '<container><input value="" placeholder=""></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'input', attr: {value: '', placeholder: ''}}
        ]
      },
      deps: ['container', 'input'],
      log: []
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse node which has no children', function (done) {
    var code = ' <container><tabheader><text>aaa</text></tabheader></container> '
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {
            type: 'tabheader',
            children: [{type: 'text', attr: {value: 'aaa'}}]
          }
        ]
      },
      deps: ['container', 'tabheader', 'text'],
      log: [{line: 1, column: 13, reason: 'ERROR: tag `tabheader` should not have children'}]
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })

  it('parse component', function (done) {
    var code = '<container><component></component><component is="foo"></component><component is="{{foo}}"></component></container>'
    var expected = {
      jsonTemplate: {
        type: 'container',
        children: [
          {type: 'container'},
          {type: 'foo'},
          {type: function () {return this.foo}}
        ]
      },
      deps: ['container', 'foo'],
      log: [{line: 1, column: 12, reason: 'WARNING: tag `component` should have an `is` attribute, otherwise it will be regarded as a `container`'}]
    }
    templater.parse(code, function (err, result) {
      expect(stringify(result)).eql(stringify(expected))
      done()
    })
  })
})
