const path = require("path");
const pkg = require('../package.json')

module.exports = {
  name: "build",
  description: "Module for package Android/iOS/Web platform",
  alias: "c",
  run: async (
    {
      logger,
      parameters,
      inquirer,
      meta,
      compile
    }
  ) => {
    logger.log('Packaging a project for preview is meaningless.')
    logger.log('We are thinking about how to better define this module.')
    logger.log('Please do not use this command for the time being.')

    logger.log('\nFor more infomations, you can see:')

    logger.log(logger.colors.grey('https://github.com/weexteam/weex-toolkit/blob/master/README.md'))
  }
};
