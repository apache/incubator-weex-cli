const path = require("path");

module.exports = {
  name: "build",
  alias: "b",
  run: async context => {
    const options = context.parameters.options;
    const source = context.parameters.first;
    const target = context.parameters.second;
    const logger = context.logger;
    if (source && target) {
      const progressBar = logger.progress();
      let maxProgress = 0;
      await context.build(
        source,
        target,
        {
          onProgress: function(complete, action) {
            if (complete > maxProgress) {
              maxProgress = complete;
            } else {
              complete = maxProgress;
            }
            progressBar.show(action, complete);
          },
          watch: options.watch || options.w,
          devtool: options.devtool || options.d,
          ext: path.extname(source) || options.ext || options.e || "vue|we",
          web: options.web || options.w,
          min: options.min || options.m,
          config: options.config || options.c,
          base: options.base || options.b
        },
        (error, output, json) => {
          progressBar.hide();
          if (error) {
            logger.error("Build Failed!");
            if (Array.isArray(error)) {
              error.forEach(e => {
                logger.error(e.replace("/n", "\n"));
              });
            } else if (error.stack) {
              logger.error(error.stack.replace("/n", "\n"));
            } else {
              logger.error(error.replace("/n", "\n"));
            }
          } else {
            logger.log(output.toString());
          }
        }
      );
    }
  }
};
