module.exports = {
  name: "{{name}}",
  // alias: "{{name}}",
  run: async context => {
    context.logger.info('Plugin {{name}}')
  }
};
