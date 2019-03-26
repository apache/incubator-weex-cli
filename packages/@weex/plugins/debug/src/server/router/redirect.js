const Router = require('koa-router')
const fs = require('fs')
const path = require('path')

const redirectHttpRouter = new Router()

redirectHttpRouter.get('/client/*', async (ctx, next) => {
  let content = fs.readFileSync(
    path.join(__dirname, '../../../frontend/public/index.html'),
    'utf-8'
  )
  ctx.response.status = 200
  ctx.response['content-type'] = 'text/html; charset=utf-8'
  ctx.response.body = content
  await next()
})

module.exports = redirectHttpRouter
