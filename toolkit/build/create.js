'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = create;
var path = require('path');
var fs = require('fs');
var npmlog = require('npmlog');

/*
create we file using standard weex template
*/

/*
let argv = require('yargs')
  .usage('wxc [name] [--command]')
  .example('# create one ".we" file\nwxc homepage -o ./example')
  .example('# force to create parted files\nwxc header -p -f -o ./components')
  .boolean('p')
  .alias('p', 'parted')
  .describe('p', 'create parted files "js/css/html"')
  .demand('o')
  .alias('o', 'out')
  .describe('o', 'the folder that write the file(s)')
  .boolean('f')
  .alias('f', 'force')
  .describe('f', 'force to replace exsisting file(s)')
  .argv;
*/

function getWeContent(name) {
    return '<template>\n  <div class="wxc-' + name + '"></div>\n</template>\n\n<style>\n.wxc-' + name + ' {}\n</style>\n\n<script>\nmodule.exports = {\n  data: {\n\n  },\n  methods: {\n\n  }\n};\n</script>\n';
}

function getPartedContent(name) {
    var JS = 'var template = require(\'./' + name + '.html\');\nvar style = require(\'./' + name + '.css\');\n\nmodule.exports = {\n  template: template,\n  style: style,\n  data: {\n\n  },\n  methods: {\n\n  }\n};\n';
    var CSS = '.wxc-' + name + ' {}';
    var HTML = '<div class="wxc-' + name + '"></div>';

    return {
        JS: JS,
        CSS: CSS,
        HTML: HTML
    };
}

function create(argv) {

    function write(name, type, content) {
        var filepath = path.join(output, name + '.' + type);
        if (fs.existsSync(filepath) && !argv.force) {
            npmlog.error('exists: ', '%s', filepath);
            npmlog.info('use --force to continue');
            return false;
        }
        fs.writeFileSync(filepath, content, 'utf-8');
        npmlog.info('write: ', '%s', filepath);
        return true;
    }

    var CWD = process.cwd();
    var output = path.join(CWD, argv.output);
    argv._.forEach(function (name) {
        if (argv.parted) {
            var content = getPartedContent(name);
            return write(name, 'js', content.JS) && write(name, 'css', content.CSS) && write(name, 'html', content.HTML);
        } else {
            var _content = getWeContent(name);
            return write(name, 'we', _content);
        }
    });
}