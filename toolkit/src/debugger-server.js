var koa = require("koa")
var mount = require('koa-mount')
var r =   require('koa-route')
var views = require('koa-views')


var app = koa();
// Debugger Server
var DS = { 
  index: function *(){
      yield this.render("weex-debugger")
  }
};

app.use(views("page",{ pagemap: {html: 'underscore'} }))
app.use(r.get('/',DS.index))
app.listen(3000)
