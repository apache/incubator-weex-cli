const path = require("path");

module.exports = context => {
  context.static = {
    getSourceLocation: () => {
      return path.join(__dirname, '../frontend/')
    },
    getInspectorReleactivePath: () => {
      return `inspector/inspector.html`
    }
  }
};
