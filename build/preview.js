'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _defaultParams;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  preview .we or .vue files
var fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    opener = require('opener'),
    npmlog = require('npmlog'),
    httpServer = require('http-server'),
    wsServer = require('ws').Server,
    watch = require('node-watch'),
    os = require('os'),
    _ = require("underscore"),
    webpack = require('webpack'),
    webpackLoader = require('weex-loader'),
    qrcode = require('qrcode-terminal-alpha'),
    nwUtils = require('../build/nw-utils'),
    fsUtils = require('../build/fs-utils'),
    displayUtils = require('../build/display-utils'),
    debuggerServer = require('../build/debugger-server'),
    weFileCreate = require('../build/create'),
    generator = require('../build/generator'),
    chalk = require('chalk');

var VERSION = require('../package.json').version;

var defaultParams = (_defaultParams = {
  entry: '',
  output: '',
  fileExt: ['vue', 'we'],
  temDir: 'weex_tmp',
  h5RenderDir: 'h5_render',
  port: '8081',
  host: '127.0.0.1'
}, (0, _defineProperty3.default)(_defaultParams, 'output', 'no JSBundle output'), (0, _defineProperty3.default)(_defaultParams, 'websocketPort', '8082'), (0, _defineProperty3.default)(_defaultParams, 'qr', false), (0, _defineProperty3.default)(_defaultParams, 'smallqr', false), (0, _defineProperty3.default)(_defaultParams, 'transformPath', ''), (0, _defineProperty3.default)(_defaultParams, 'notopen', false), _defaultParams);
var WEEX_FILE_EXT = "we";
var WEEX_TRANSFORM_TMP = "weex_tmp";
var H5_Render_DIR = "h5_render";
var NO_PORT_SPECIFIED = -1;
var DEFAULT_HTTP_PORT = "8081";
var DEFAULT_WEBSOCKET_PORT = "8082";
var NO_JSBUNDLE_OUTPUT = "no JSBundle output";

//will update when argvProcess function call
var HTTP_PORT = NO_PORT_SPECIFIED;
var WEBSOCKET_PORT = NO_PORT_SPECIFIED;

webpackLoader.setLogLevel("WARN");

var Previewer = {
  init: function init(args) {
    if (args['_'].length == 0) {
      return;
    }
    var entry = args['_'][0];
    if (!this.__isWorkFile(entry)) {
      return console.log('Not a ".vue" or ".we" file');
    }
    if (args.port <= 0 || args.port >= 65336) {
      this.params.port = 8081;
    }
    this.params = (0, _assign2.default)({}, defaultParams, args);
    this.params.entry = entry;
    this.file = path.basename(entry);
    this.module = this.file.replace(/\..+/, '');
    this.fileType = /\.vue$/.test(this.file) ? 'vue' : 'we';
    this.fileDir = process.cwd();

    this.serverMark = false;
    if (!this.params.entry && this.params.transformPath) {
      this.serverMark = true;
      this.startWebServer();
      return;
    }
    this.fileFlow();
  },

  __isWorkFile: function __isWorkFile(filename) {
    if (!/\.(we|vue)$/.test(filename)) {
      return false;
    }
    return true;
  },

  fileFlow: function fileFlow() {
    var _this = this;

    var entry = this.params.entry;
    var output = this.params.ouput;
    if (this.params.output == 'no JSBundle output') {
      this.params.output = null;
      this.initTemDir();
      this.serverMark = true;
    }

    try {
      if (fs.lstatSync(entry).isFile()) {

        if (fs.lstatSync(entry).isDirectory()) {
          var _module = this.module;
          this.params.output = params.output = path.join(output, _module + '.js');
        }
      }
    } catch (e) {
      //fs.lstatSync my raise when outputPath is file but not exist yet.
    }

    if (this.params.watch) {
      (function () {
        npmlog.info('watching ' + entry);
        var self = _this;
        watch(entry, function (fileName) {
          if (/\.(we|vue)$/gi.test(fileName)) {
            npmlog.info(fileName + ' updated');
            try {
              if (fs.lstatSync(outputPath).isDirectory()) {
                var fn = path.basename(fileName).replace(/\..+/, '');
                output = path.join(outputPath, fn + '.js');
              }
            } catch (e) {}
            self.transforme(fileName, output);
          }
        });
      })();
    } else {
      this.transforme(entry, this.params.output);
    }
  },


  // build temp directory for web preview
  initTemDir: function initTemDir() {
    fse.removeSync(this.params.temDir);
    fs.mkdirSync(this.params.temDir);
    fse.copySync(__dirname + '/../vue-template/template', this.params.temDir + '/' + this.params.h5RenderDir);
    fse.mkdirsSync(this.params.temDir + '/' + this.params.h5RenderDir);
  },
  buildBundle: function buildBundle() {},
  transforme: function transforme(inputPath, outputPath) {
    var transformP = void 0;
    var self = this;
    if (fs.lstatSync(inputPath).isFile()) {
      if (this.fileType == 'vue') {
        transformP = fsUtils.replace(path.join(self.params.temDir + '/' + self.params.h5RenderDir + '/', 'app.js'), [{
          rule: "{{$module}}",
          scripts: path.join(process.cwd(), inputPath)
        }]).then(function () {
          var trans = self.transformTarget(inputPath, outputPath);
          return trans;
        });
      } else {
        transformP = self.transformTarget(inputPath, outputPath);
      }
    } else if (fs.lstatSync(inputPath).isDirectory) {
      try {
        fs.lstatSync(outputPath).isDirectory();
      } catch (e) {
        npmlog.info(yargs.help());
        npmlog.info("when input path is dir , output path must be dir too");
        process.exit(1);
      }

      var filesInTarget = fs.readdirSync(inputPath);
      filesInTarget = _.filter(filesInTarget, function (fileName) {
        return fileName.length > 2;
      });
      filesInTarget = _.filter(filesInTarget, function (fileName) {
        return fileName.substring(fileName.length - 2, fileName.length) == WEEX_FILE_EXT;
      });

      var filesInTargetPromiseList = _.map(filesInTarget, function (fileName) {
        var ip = path.join(inputPath, fileName);
        fileName = fileName.replace(/\.(we|vue)/, '');
        var op = path.join(outputPath, fileName + '.js');
        return self.transformTarget(ip, op);
      });
      transformP = _promise2.default.all(filesInTargetPromiseList);
    }

    transformP.then(function (jsBundlePathForRender) {

      console.log(process.cwd());
      if (self.serverMark == true) {
        // typeof jsBundlePathForRender == "string"

        //no js bundle output specified, start server for playgroundApp(now) or H5 renderer.
        self.startWebServer(jsBundlePathForRender);
        self.startWebSocket();
      } else {
        npmlog.info('weex JS bundle saved at ' + path.resolve(outputPath));
      }
    }).catch(function (e) {
      npmlog.error(e);
    });
  },
  transformTarget: function transformTarget(inputPath, outputPath) {
    var promiseData = { promise: null, resolver: null, rejecter: null };
    promiseData.promise = new _promise2.default(function (resolve, reject) {
      promiseData.resolver = resolve;
      promiseData.rejecter = reject;
    });
    var webpackConfig = this.setWebpackConfig(inputPath, outputPath);
    var filename = path.basename(inputPath).replace(/\..+/, '');
    //return promiseData.promise;

    webpack(webpackConfig, function (err, stats) {
      setTimeout(function () {
        displayUtils.displayWebpackStats(stats);
      }, 300);
      if (err) {
        promiseData.rejecter(err);
        if (err.name == "ModuleNotFoundError") {
          (function () {
            var moduleName = "THE_MISSING_MODULE_NAME";
            if (err.dependencies.length > 0 && err.dependencies[0].request) {
              moduleName = err.dependencies[0].request;
              if (moduleName.indexOf("/") > 0) {
                moduleName = moduleName.split("/")[0];
              }
            }
            setTimeout(function () {
              npmlog.info('Please try to enter directory where your we file saved, and run command \'npm install ' + moduleName + '\'');
            }, 100);
          })();
        } else {
          if (err.error) {
            setTimeout(function () {
              npmlog.error("critical syntax Error found , please check root tags or css syntax in your we file");
            }, 100);
          }
        }
      } else {
        if (outputPath) {
          promiseData.resolver(false);
        } else {
          promiseData.resolver(filename + '.js');
        }
      }
    });
    return promiseData.promise;
  },
  runWebpack: function runWebpack() {},
  setWebpackConfig: function setWebpackConfig(inputPath, outputPath) {
    var module = this.module;
    var bundleWritePath = null;
    if (outputPath) {
      bundleWritePath = outputPath;
    } else {
      bundleWritePath = path.join(this.fileDir, this.params.temDir + '/' + this.params.h5RenderDir + '/' + module + '.js');
    }
    inputPath = path.resolve(inputPath);
    var entryValue = '';
    if (this.fileType == 'vue') {
      entryValue = this.params.temDir + '/' + this.params.h5RenderDir + '/app.js?entry=true';
    } else {
      entryValue = inputPath + '?entry=true';
    }
    var webpackConfig = {
      entry: entryValue,
      output: {
        path: path.dirname(bundleWritePath),
        filename: path.basename(bundleWritePath)
      },
      module: {
        loaders: [{
          test: /\.we(\?[^?]+)?$/,
          loaders: ['weex']
        }, {
          test: /\.js(\?[^?]+)?$/,
          loader: 'babel',
          exclude: /node_modules/
        }, {
          test: /\.vue(\?[^?]+)?$/,
          loader: 'vue'
        }]
      },

      babel: {
        presets: [require.resolve("babel-preset-es2015")]
      },

      resolve: {
        root: [path.dirname(inputPath), path.join(path.dirname(inputPath), "node_modules/"), process.cwd(), path.join(process.cwd(), "node_modules/")]
      },
      resolveLoader: {
        root: [path.join(path.dirname(__dirname), "node_modules/")]
      },
      debug: true,
      bail: true
    };
    return webpackConfig;
  },
  startWebServer: function startWebServer(fileName) {
    var options = {
      root: ".",
      cache: "-1",
      showDir: true,
      autoIndex: true
    };
    var self = this;

    if (this.params.transformPath) {
      options.root = this.params.transformPath;
      options.before = [fsUtils.getTransformerWraper(options.root, self.transformTarget)];
    } else {
      options.before = [fsUtils.getTransformerWraper(process.cwd(), self.transformTarget)];
    }
    self.bindProcessEvent();
    var server = httpServer.createServer();

    var port = this.params.port;
    //npmlog.info(`http port: ${port}`)        
    server.listen(port, "0.0.0.0", function () {
      npmlog.info(new Date() + ('http  is listening on port ' + port));

      if (self.transformServerPath) {
        var IP = nwUtils.getPublicIP();
        if (self.params.host != DEFAULT_HOST) {
          IP = self.params.host;
        }
        npmlog.info('target file in local path ' + self.parmas.transformPath + ' will be transformer to JS bundle\nplease access http://' + IP + ':' + port + '/');
        return;
      }

      if (self.params.qr || self.params.smallqr) {
        self.showQR();
        return;
      }
      var previewUrl = 'http://' + self.params.host + ':' + port + '/' + WEEX_TRANSFORM_TMP + '/' + H5_Render_DIR + '/?hot-reload_controller&page=' + fileName + '&loader=xhr';
      var vueRegArr = [{
        rule: /{{\$script}}/,
        scripts: '\n<script src="./assets/phantom-limb.js"></script>\n<script src="./assets/vue.runtime.js"></script>\n<script src="./assets/weex-vue-render/index.js"></script>\n      '
      }, {
        rule: /{{\$script2}}/,
        scripts: '<script src="' + self.module + '.js"></script>'
      }];
      var weRegArr = [{
        rule: /{{\$script}}/,
        scripts: '\n<script src="./assets/weex-html5/weex.js"></script>\n<script src="./assets/weex-init.js"></script>\n      '
      }, {
        rule: /{{\$script2}}/,
        scripts: ''
      }];
      var regarr = vueRegArr;
      if (/\.we$/.test(self.params.entry)) {
        regarr = weRegArr;
      }
      fsUtils.replace(path.join(self.params.temDir + '/' + self.params.h5RenderDir + '/', 'weex.html'), regarr).then(function () {
        self.open(previewUrl);
      }).catch(function (err) {
        console.log(err);
        npmlog.error("replace file failed!");
      });
    });
  },
  showQR: function showQR() {
    var IP = this.getIP();
    var wsport = this.params.websocketPort;
    var jsBundleURL = 'http://' + IP + ':' + this.params.port + '/' + this.params.temDir + '/' + this.params.h5RenderDir + '/' + this.module + '.js?wsport=' + this.params.websocketPort;
    // npmlog output will broken QR in some case ,some we using console.log
    console.log('The following QR encoding url is\n' + jsBundleURL + '\n');
    qrcode.generate(jsBundleURL, { small: this.params.smallqr });
    console.log("\nPlease download Weex Playground app from https://github.com/alibaba/weex and scan this QR code to run your app, make sure your phone is connected to the same Wi-Fi network as your computer runing WeexToolkit.\n");
  },
  bindProcessEvent: function bindProcessEvent() {
    var self = this;
    process.on('uncaughtException', function (err) {
      if (err.errno === 'EADDRINUSE') {
        npmlog.info('The server has been setted up.');
      } else {
        console.log(err);
      }
      process.exit(1);
    });
    process.on('SIGINT', function () {
      console.log(chalk.green("weex  server stoped"));
      fsUtils.deleteFolderRecursive(self.params.temDir);
      process.exit();
    });

    process.on('SIGTERM', function () {
      console.log(chalk.green("weex server stoped"));
      fsUtils.deleteFolderRecursive(self.params.temDir);
      process.exit();
    });
  },
  getIP: function getIP() {
    var IP = nwUtils.getPublicIP();
    if (this.params.host != '') {
      IP = this.params.host;
    }
    return IP;
  },
  startWebSocket: function startWebSocket(fileName) {
    var port = this.params.websocketPort;
    var wss = wsServer({ port: port });
    var self = this;
    npmlog.info(new Date() + ('WebSocket  is listening on port ' + port));
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        npmlog.info('received: %s', message);
      });
      ws.send("ws server ok");
      self.wsConnection = ws;
      self.watchForWSRefresh(fileName);
    });
  },
  watchForWSRefresh: function watchForWSRefresh(fileName) {
    var self = this;
    watch(path.dirname(this.params.entry), function (fileName) {

      if (!!fileName.match('' + self.params.temDir)) {
        return;
      }
      console.log(fileName);
      if (/\.(js|we|vue)$/gi.test(fileName)) {
        var transformP = self.transformTarget(self.params.entry, self.params.output);
        transformP.then(function (fileName) {
          console.log('refresh!');
          self.wsConnection.send("refresh");
        });
      }
    });
  },
  open: function open(url) {
    if (!this.params.notopen) {
      opener(url);
    } else {
      npmlog.info('weex preview url:  ' + url);
    }
  }
};

module.exports = function (args) {
  Previewer.init(args);
};