const { WeexBuilder } = require("../lib/WeexBuilder");

module.exports = context => {
  context.compile = async (source, dest, options, callback) => {
    if (
      !source ||
      typeof source !== "string" ||
      (Array.isArray(source) && source.length === 0)
    ) {
      context.logger.error("The source path can not be empty!");
    } else if (!dest || typeof source !== "string") {
      context.logger.error("The output path can not be empty or non-string!");
    } else {
      const result = await build(source, dest, options, callback);
      return result;
    }
  };

  context.compiler = WeexBuilder
};

async function build(source, dest, options, callback) {
  return new WeexBuilder(source, dest, options).build(callback);
}
