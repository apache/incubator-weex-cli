const uniqueTempDir = require('unique-temp-dir')
const path = require('path')

async function simple(context) {
  const template = path.resolve(`${__dirname}/../templates/simple`)
  const dir = uniqueTempDir({ create: true })
  const target = path.resolve(`/${dir}/`)

  const result = await context.template.generate(target, template, {})
  return target
}

module.exports = { name: 'simple', run: simple }
