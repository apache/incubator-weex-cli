'use strict';

var path = require('path');
var fs = require('fs');
var md5 = require('md5');
var loaderUtils = require('loader-utils');
var blocker = require('weex-transformer/lib/blocker');

var pkg = require('./package.json');
var transformerVersion = pkg.dependencies['weex-transformer'].match(/\d+(?:\.\d+){0,2}/)[0];

var templater;
var styler;
var scripter;

var MODULE_EXPORTS_REG = /module\.exports/g;
var REQUIRE_REG = /require\((["'])(\@weex\-module\/[^\)\1]+)\1\)/g;

function parseScript(loader, params, source, config, data) {
    if (!scripter) {
        return Promise.reject('please use a script parser. ex. weex-scripter');
    }

    var target = scripter.fix(source);
    var name = params.resourceQuery.name || 
                    path.basename(params.resourcePath).replace(/\..*$/, '');

    if (params.resourceQuery.entry === true) {
        name = md5(source);
    }

    target = target.replace(MODULE_EXPORTS_REG, '__weex_module__.exports')
                .replace(REQUIRE_REG, '__weex_require__($1$2$1)');

    target = ';__weex_define__("@weex-component/' + name + '", [], ' + 
                'function(__weex_require__, __weex_exports__, __weex_module__)' + 
                '{\n' + target + '\n})';

    if (params.resourceQuery.entry === true) {
        target += '\n;__weex_bootstrap__("@weex-component/' + name + '", ' + 
                    String(config) + ', ' + 
                    String(data) + ')';
    }

    return Promise.resolve(target);
}

function logWarning(loader, log) {
    if (log && log instanceof Array) {
        log.forEach(function(l) {
            loader.emitWarning(l.reason + '\t@' + l.line + ':' + l.column)
        });
    }
}

function parseStyle(loader, params, source) {
    return new Promise(function(resolve, reject) {
        if (!styler) {
            return reject('please use a style parser. ex. weex-styler');
        }

        styler.parse(source, function(err, obj) {
            if (err) {
                reject(err);
            } else {
                logWarning(loader, obj.log);
                var target = JSON.stringify(obj.jsonStyle, null, '  ');
                resolve(target);
            }
        });
    });
}

var FUNC_START = '#####FUN_S#####';
var FUNC_START_REG = new RegExp('["\']' + FUNC_START, 'g');
var FUNC_END = '#####FUN_E#####';
var FUNC_END_REG = new RegExp(FUNC_END + '["\']', 'g');
function stringifyFunction(key, value) {
    if (typeof value === 'function') {
      return  FUNC_START + value.toString() + '#####FUN_E#####';
    }
    return value;
}

function parseTemplate(loader, params, source, deps) {
    return new Promise(function(resolve, reject) {
        if (!templater) {
            return reject('please use a template parser. ex. weex-styler');
        }

        templater.parse(source, function(err, obj) {
            if (err) {
                reject(err);
            } else {
                logWarning(loader, obj.log);

                if (deps && obj.deps) {
                    var context = path.dirname(params.resourcePath);
                    obj.deps.map(function(dep) {
                        var filename = './' + dep + '.we';
                        var filepath = path.resolve(context, filename);
                        if (fs.existsSync(filepath)) {
                            return filepath;
                        }
                    }).forEach(function(dep) {
                        if (dep) {
                            deps.push(dep);
                        }
                    });
                }

                var target = JSON.stringify(obj.jsonTemplate, stringifyFunction, '  ');
                target = target.replace(FUNC_START_REG, '')
                        .replace(FUNC_END_REG, '');

                resolve(target);
            }
        });
    });
}

function parseWeexFile(loader, params, source) {
    var results;
    var deps = [];

    return new Promise(function(resolve, reject) {
        blocker.format(source, function(err, ret) {
            if (err) {
                reject(err);
            } else {
                results = ret;
                resolve();
            }
        });
    }).then(function() {
        var promises = [Promise.resolve(), Promise.resolve()];
        var content;

        if (results.template) {
            content = results.template.content;
            promises[0] = parseTemplate(loader, params, content, deps);
        }
        if (results.styles) {
            content = results.styles.reduce(function(pre, cur) {
                return pre + '\n' + cur.content;
            }, '');
            promises[1] = parseStyle(loader, params, content);
        }

        return Promise.all(promises);
    }).then(function(ret) {
        var template = ret[0];
        var style = ret[1];

        var content = '';
        var config = {};
        var data;

        if (results.scripts) {
            content += results.scripts.reduce(function(pre, cur) {
                return pre + '\n;' + cur.content;
            }, '');
        }

        var requireContent = '';
        if (deps.length) {
            requireContent += deps.map(function(dep) {
                if (!content.match(new RegExp('require\\(["\']./' + path.basename(dep) + '["\']\\)', 'g'))) {
                    return 'require("' + dep + '");';
                } else {
                    return '';
                }
            }).join('\n');

            content = requireContent + '\n' + content;
        }

        if (template) {
            content += '\n;module.exports.template=' + template;
        }

        if (style) {
            content += '\n;module.exports.style=' + style;
        }

        if (results.config) {
            config = JSON.parse(results.config.content);
        }
        config.transformerVersion = transformerVersion;
        config = JSON.stringify(config);

        if (results.data) {
            data = results.data.content;
        }
        
        return parseScript(loader, params, content, config, data);
    });
}

function partedLoader(type, loader, params, source) {
    var promise;
    switch(type) {
        case 'script':
            var config = JSON.stringify({
                transformerVersion: transformerVersion
            });
            promise = parseScript(loader, params, source, config);
            break;
        case 'style':
            promise = parseStyle(loader, params, source);
            break;
        case 'tpl':
            promise = parseTemplate(loader, params, source);
            break;
        case 'we':
        default:
            promise = parseWeexFile(loader, params, source);
            break;
    }
    return promise;
}

function loader(source) {
    var self = this;
    this.cacheable && this.cacheable();

    var callback = this.async();
    var params = {
        loaderQuery: loaderUtils.parseQuery(this.query),
        resourceQuery: loaderUtils.parseQuery(this.resourceQuery),
        resourcePath: this.resourcePath
    };
    var type = params.loaderQuery.type || 'we';
    var promise = partedLoader(type, this, params, source);

    promise.then(function(result) {
        if (type === 'style' || type === 'tpl' || type === 'template') {
            result = 'module.exports=' + result;
        }
        // console.log('\n[' + type + ', ' + params.resourcePath + ']\n', source, '\n=========>\n', result + '\n');
        callback(null, result);
    }).catch(function(err) {
        self.emitError(err.toString());
        callback(err.toString(), '');
    });
}

loader.useScripter = function(module) {
    scripter = module;
}

loader.useStyler = function(module) {
    styler = module;
}

loader.useTemplater = function(module) {
    templater = module;
}

module.exports = loader;