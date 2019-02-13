
const colors = require('colors')  // eslint-disable-line
const msgPath = process.env.GIT_PARAMS
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(v\d+\.\d+\.\d+(-(alpha|beta|rc).\d+)?$)|((revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?: .{1,50})/

if (!commitRE.test(msg)) {
  console.error(
    `\n  ${colors.bgRed.white(' ERROR ')} ${colors.red(`invalid commit message format.`)}\n\n` +
    colors.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
    `    ${colors.green(`feat(compile): commit message`)}\n` +
    `    ${colors.green(`fix(module): commit message (close #28)`)}\n\n` +
    colors.red(`  See .github/COMMIT_CONVENTION.md for more details.\n`)
  )
  process.exit(1)
}
