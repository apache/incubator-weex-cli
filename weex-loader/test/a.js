require('./b?name=goto');
require('./copyright.we?name=copyright');

var c = require('./lib/c');

module.exports = {
    data: {
        text: 'Hello ' + c.name
    }
}

module.exports.style = require('./a.less');
module.exports.template = require('./a.tpl');