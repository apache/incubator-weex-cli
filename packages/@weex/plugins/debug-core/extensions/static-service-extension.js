const path = require("path");

module.exports = context => {
  context.staticService = {
    getSourceLocation: () => {
      return path.join(__dirname, '../frontend/')
    },
    getInspectorReleactivePath: () => {
      return `inspector/inspector.html`
    }
  }
};
