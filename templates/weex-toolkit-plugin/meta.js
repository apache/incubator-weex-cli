const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

// const {
//   addTestAnswers
// } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    // before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }
      console.log(Object.keys(options))
      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },

  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
    }
  },
  // filters: {
  //   // filter by prompts keyword
  // },
  complete: function (data, {
    logger
  }) {
    const green = logger.colors.green

    sortDependencies(data, green)

    const cwd = data.dest ? data.dest : path.join(process.cwd(), data.inPlace ? '' : data.destDirName)
    installDependencies(cwd, data.autoInstall, green)
      .then(() => {
        return runLintFix(cwd, data, green)
      })
      .then(() => {
        printMessage(data, logger.colors)
      })
      .catch(e => {
        logger.error(`Error: ${e}`)
      })
  },
}
