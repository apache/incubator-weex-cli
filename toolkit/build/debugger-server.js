'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var koa = require("koa");
var mount = require('koa-mount');
var r = require('koa-route');
var views = require('koa-views');
var staticServer = require('koa-static');

var app = koa();

// Debugger Server
var DS = {
  index: _regenerator2.default.mark(function index() {
    return _regenerator2.default.wrap(function index$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.render("weex-debugger");

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, index, this);
  })
};

app.use(views("page", { pagemap: { html: 'underscore' } }));
app.use(r.get('/', DS.index));

var appStatic = koa();
appStatic.use(staticServer("build"));
app.use(mount('/static', appStatic));

app.listen(3000);
console.log("http listening http://0.0.0.0:3000/");