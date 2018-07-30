module.exports = {
  name: "debug",
  description: "Debug weex bundle",
  alias: "d",
  run: async context => {
    const options = context.parameters.options;
    const source = context.parameters.first;
    const target = context.parameters.second;
    const logger = context.logger;
    console.log(options)
  }
};
