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
    logger.log('Packaging a project which is used for preview is meaningless.')
    logger.log('We are thinking about how to better define this module.')
    logger.log('Please do not use this command for the time being.')

    logger.log('\nFor more infomations, you can see:')

    logger.log(logger.colors.grey('https://github.com/weexteam/weex-toolkit/blob/master/README.md'))
  
    logger.log('\nOr you can give us some advice here:')

    logger.log(logger.colors.grey('https://github.com/weexteam/weex-toolkit/issues/new?labels=@weex-cli/build'))
    
  }
};
