const { WeexBuilder } = require("./lib/WeexBuilder");

export const build = async (source, target, options, callback) => {
  return new Promise((resolve, reject) => {
    if (
      !source ||
      typeof source !== "string" ||
      (Array.isArray(source) && source.length === 0)
    ) {
      reject(new Error("The source path can not be empty!"));
    }
    if (!target || typeof source !== "string") {
      reject(new Error("The output path can not be empty or non-string!"));
    }
    resolve(new WeexBuilder(source, target, options).build(callback));
  });
};

export default build