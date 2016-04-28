var koa = require("koa")
var mount = require('koa-mount')
var r =   require('koa-route')
var views = require('koa-views')
var staticServer = require('koa-static')

var app = koa();

// Debugger Server
var DS = { 
  index: function *(){
      yield this.render("weex-debugger")
  }
};

app.use(views("page",{ pagemap: {html: 'underscore'} }))
app.use(r.get('/',DS.index))


var appStatic = koa()
appStatic.use(staticServer("build"))
app.use(mount('/static',appStatic))


app.listen(3000)
console.log("http listening http://0.0.0.0:3000/")
