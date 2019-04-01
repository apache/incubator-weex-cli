const cli = require('./cli')
const sinon = require('sinon')

sinon.stub(console, 'error')

// set jest timeout to very long, because these take a while
beforeAll(() => jest.setTimeout(90 * 1000))
// reset back
afterAll(() => jest.setTimeout(5 * 1000))

test('cli should be a function', async () => {
  expect(typeof cli).toBe('function')
})

test('try to start cli', async () => {
  const testArgv = [
    'node',
    'weex',
    '-f',
    '-v'
  ]
  const result = await cli(testArgv)
  expect(console.error.called).toBeFalsy()
})
