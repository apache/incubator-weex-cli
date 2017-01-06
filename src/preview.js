//  preview .we or .vue files
const fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    opener = require('opener'),
    npmlog = require('npmlog'),     
    httpServer = require('http-server'),
    wsServer = require('ws').Server,
    watch =  require('node-watch'),
    os  = require('os'),
    _   = require("underscore"),
    webpack = require('webpack'),
    webpackLoader = require('weex-loader'),
    qrcode = require('qrcode-terminal-alpha'),          
    nwUtils =  require('../build/nw-utils'),      
    fsUtils = require('../build/fs-utils'),
    displayUtils = require('../build/display-utils'),            
    debuggerServer =  require('../build/debugger-server'),
    weFileCreate = require('../build/create'),
    generator = require('../build/generator'),
    chalk = require('chalk');

const VERSION = require('../package.json').version

const defaultParams = {
  entry: '',
  output: '',
  fileExt: ['vue','we'],
  temDir: 'weex_tmp',
  h5RenderDir: 'h5_render',
  port: '8081',
  host: '127.0.0.1',
  output: 'no JSBundle output',
  websocketPort: '8082',
  qr: false,
  smallqr: false,
  transformPath:'',
  notopen: false,
};
const WEEX_FILE_EXT = "we"
const WEEX_TRANSFORM_TMP = "weex_tmp"
const H5_Render_DIR = "h5_render"
const NO_PORT_SPECIFIED =  -1
const DEFAULT_HTTP_PORT  = "8081"
const DEFAULT_WEBSOCKET_PORT = "8082"
const NO_JSBUNDLE_OUTPUT = "no JSBundle output"

//will update when argvProcess function call
var HTTP_PORT = NO_PORT_SPECIFIED         
var WEBSOCKET_PORT   = NO_PORT_SPECIFIED  

webpackLoader.setLogLevel("WARN")

let Previewer = {
  init: function(args) {
    if(args['_'].length == 0) {
      return;
    }
    let entry = args['_'][0];
    if(!this.__isWorkFile(entry)) {
      return console.log('Not a ".vue" or ".we" file');   
    }
    if(args.port <=0 || args.port >= 65336) {
      this.params.port = 8081;
    }
    this.params = Object.assign({},defaultParams,args);
    this.params.entry = entry;
    this.file = path.basename(entry);
    this.module = this.file.replace(/\..+/, '');
    this.fileType = /\.vue$/.test(this.file) ? 'vue':'we';
    this.fileDir = process.cwd();
   
    this.serverMark = false;
    if (!this.params.entry  &&  this.params.transformPath){
      this.serverMark = true;            
      this.startWebServer();
      return;
    }
    this.fileFlow()
  },
  
 
  __isWorkFile: function(filename) {
    if(!/\.(we|vue)$/.test(filename)) {
      return false;
    }
    return true; 
  },
  
  fileFlow() {
    let entry = this.params.entry; 
    let output = this.params.ouput;
    if (this.params.output == 'no JSBundle output'){
      this.params.output = null;
      this.initTemDir();
      this.serverMark = true;                          
    }

    try{        
      if (fs.lstatSync(entry).isFile()){

        if (fs.lstatSync(entry).isDirectory()){
          let module = this.module;            
          this.params.output =  params.output = path.join(output , `${module}.js`)
        }
      }
    }catch(e){
        //fs.lstatSync my raise when outputPath is file but not exist yet.
    }

    if (this.params.watch){
      npmlog.info(`watching ${entry}`);
      let self = this;
      watch(entry, function (fileName){
          if (/\.(we|vue)$/gi.test(fileName)){
              npmlog.info(`${fileName} updated`)
              try{                    
                  if (fs.lstatSync(outputPath).isDirectory()){
                      let fn = path.basename(fileName).replace(/\..+/, '')            
                      output = path.join(outputPath , `${fn}.js`)
                  }
              }catch(e){}
              self.transforme(fileName,output);
          }
      })
    }else{
      this.transforme(entry,this.params.output);
    }
  },
  
  // build temp directory for web preview
  initTemDir() {
    fse.removeSync(this.params.temDir);
    fs.mkdirSync(this.params.temDir)
    fse.copySync(`${__dirname}/../vue-template/template` , `${this.params.temDir}/${this.params.h5RenderDir}`);
    fse.mkdirsSync(`${this.params.temDir}/${this.params.h5RenderDir}`);
    
  },
  
  buildBundle() {
    
    
  },
  transforme(inputPath,outputPath){
    let transformP;
    let self = this;        
    if (fs.lstatSync(inputPath).isFile()){
      if(this.fileType == 'vue') {
        transformP = fsUtils.replace(path.join(`${self.params.temDir}/${self.params.h5RenderDir}/`,'app.js'),[
          {
            rule: "{{$module}}",
            scripts: path.join(process.cwd(),inputPath) ,
          }
        ]).then(() => {
          let trans = self.transformTarget(inputPath , outputPath);
          return trans;
        })   
      } else {
        transformP  = self.transformTarget(inputPath , outputPath);  
      }

    }else if (fs.lstatSync(inputPath).isDirectory){
        try{
            fs.lstatSync(outputPath).isDirectory();
        }catch(e){
            npmlog.info(yargs.help())
            npmlog.info("when input path is dir , output path must be dir too")
            process.exit(1)    
        }

        let filesInTarget = fs.readdirSync(inputPath)
        filesInTarget = _.filter(filesInTarget , (fileName)=>(fileName.length > 2 ) )        
        filesInTarget = _.filter(filesInTarget , (fileName)=>( fileName.substring(fileName.length - 2 ,  fileName.length) ==  WEEX_FILE_EXT ) )

        let filesInTargetPromiseList  = _.map(filesInTarget , function(fileName){
            let ip = path.join( inputPath , fileName)
            fileName = fileName.replace(/\.(we|vue)/, '')                            
            let op = path.join( outputPath , `${fileName}.js`  )
            return self.transformTarget(ip , op)
        })
        transformP = Promise.all(filesInTargetPromiseList)
    }

    transformP.then( function(jsBundlePathForRender){
      
      console.log(process.cwd());
      if (self.serverMark == true) {  // typeof jsBundlePathForRender == "string"

          //no js bundle output specified, start server for playgroundApp(now) or H5 renderer.
        self.startWebServer(jsBundlePathForRender);
        self.startWebSocket();

      }else{
          npmlog.info('weex JS bundle saved at ' + path.resolve(outputPath));          
      }
      
    }).catch(function(e){
        npmlog.error(e)
    });      
  },
  
  transformTarget(inputPath , outputPath){
    let promiseData = {promise: null,resolver: null,rejecter: null}
    promiseData.promise = new Promise(function (resolve, reject) {
        promiseData.resolver = resolve
        promiseData.rejecter = reject
    })    
    let webpackConfig = this.setWebpackConfig(inputPath,outputPath);
    let filename = path.basename(inputPath).replace(/\..+/, '');
    //return promiseData.promise;
     
    webpack(webpackConfig,function(err,stats){
        setTimeout(()=> {           
          displayUtils.displayWebpackStats(stats);
        }, 300);         
        if (err){
          promiseData.rejecter(err)
          if (err.name == "ModuleNotFoundError"){
              let moduleName = "THE_MISSING_MODULE_NAME"
              if ((err.dependencies.length > 0 )  && err.dependencies[0].request)   {
                  moduleName = err.dependencies[0].request
                  if (moduleName.indexOf("/") > 0){
                      moduleName = moduleName.split("/")[0]
                  }
              }
              setTimeout(()=> {
                npmlog.info(`Please try to enter directory where your we file saved, and run command 'npm install ${moduleName}'`)
              },100);
          }else{
            if (err.error){
              setTimeout(() => {
                  npmlog.error("critical syntax Error found , please check root tags or css syntax in your we file");
              },100)
            }
          }

        }else{
          if (outputPath){
            promiseData.resolver(false)            
          }else{
            promiseData.resolver(`${filename}.js`)            
          }
        }
    })
    return promiseData.promise;
  },
  
  runWebpack() {
    
  },
  
  
  setWebpackConfig(inputPath,outputPath) {
    let module = this.module;
    let bundleWritePath = null;
    if (outputPath){
        bundleWritePath = outputPath
    }else{
        bundleWritePath = path.join(this.fileDir,`${this.params.temDir}/${this.params.h5RenderDir}/${module}.js`);
    }
    inputPath = path.resolve(inputPath);
    let entryValue = '';
    if(this.fileType == 'vue') {
      entryValue = `${this.params.temDir}/${this.params.h5RenderDir}/app.js?entry=true`;  
    }else {
      entryValue = `${inputPath}?entry=true`;  
    }
    let webpackConfig = {
        entry: entryValue,
        output: {
            path:   path.dirname(bundleWritePath),
            filename: path.basename(bundleWritePath)
        },
        module: {
            loaders: [
                {
                    test: /\.we(\?[^?]+)?$/,
                    loaders: ['weex']
                },
                {
                  test: /\.js(\?[^?]+)?$/,
                  loader: 'babel',
                  exclude: /node_modules/
                },
                {
                    test: /\.vue(\?[^?]+)?$/,
                    loader: 'vue'
                }
                
            ]
        },
        
        babel:{
          presets: [require.resolve("babel-preset-es2015")],
        },
        
        resolve:{
            root:[ path.dirname(inputPath),  path.join (path.dirname(inputPath) ,"node_modules/") ,process.cwd(), path.join(process.cwd(), "node_modules/")  ]
        },
        resolveLoader: {
            root: [ path.join( path.dirname(__dirname), "node_modules/")]
        },                
        debug:true,
        bail:true
    };
    return webpackConfig;
    
  },
  
  startWebServer(fileName) {
    let options = {
        root: ".",
        cache: "-1",
        showDir: true,
        autoIndex: true
    }
    let self = this;

    if (this.params.transformPath){
        options.root = this.params.transformPath;
        options.before = [ fsUtils.getTransformerWraper(options.root, self.transformTarget ) ];   
    }else{
        options.before = [ fsUtils.getTransformerWraper(process.cwd(), self.transformTarget ) ]     
    }
    self.bindProcessEvent();
    let server = httpServer.createServer();
    
    let port = this.params.port;
    //npmlog.info(`http port: ${port}`)        
    server.listen(port, "0.0.0.0", function () {
      npmlog.info((new Date()) + `http  is listening on port ${port}`)

      if (self.transformServerPath){
          let IP =  nwUtils.getPublicIP()
          if (self.params.host != DEFAULT_HOST){
              IP = self.params.host;
          }
          npmlog.info(`target file in local path ${self.parmas.transformPath} will be transformer to JS bundle\nplease access http://${IP}:${port}/`);
          return;
      }

      if (self.params.qr || self.params.smallqr){
          self.showQR();
          return;
      }
      let previewUrl = `http://${self.params.host}:${port}/${WEEX_TRANSFORM_TMP}/${H5_Render_DIR}/?hot-reload_controller&page=${fileName}&loader=xhr`;
      let vueRegArr = [
        {
          rule: /{{\$script}}/,
          scripts:`
<script src="./assets/phantom-limb.js"></script>
<script src="./assets/vue.runtime.js"></script>
<script src="./assets/weex-vue-render/index.js"></script>
      ` 
        },
        {
          rule: /{{\$script2}}/,
          scripts:'<script src="' + self.module +  '.js"></script>', 
        }
      ];
      let weRegArr = [
        {
          rule: /{{\$script}}/,
          scripts:`
<script src="./assets/weex-html5/weex.js"></script>
<script src="./assets/weex-init.js"></script>
      ` 
        },
        {
          rule: /{{\$script2}}/,
          scripts:'', 
        }
      ];
      let regarr = vueRegArr;
      if(/\.we$/.test(self.params.entry)) {
        regarr = weRegArr; 
      }
      fsUtils.replace(path.join(`${self.params.temDir}/${self.params.h5RenderDir}/`,'weex.html'),regarr).then(() => {
        self.open(previewUrl);
         
      }).catch((err) => {
        console.log(err);
        npmlog.error("replace file failed!");
      })
      
    });
    
  },
  
  showQR(){
    let IP = this.getIP();   
    let wsport = (WEBSOCKET_PORT == NO_PORT_SPECIFIED) ? DEFAULT_WEBSOCKET_PORT : WEBSOCKET_PORT
    let jsBundleURL = `http://${IP}:${this.param.port}/${this.params.temDir}/${this.params.h5RenderDir}/${this.params.entry}?wsport=${this.params.websocketPort}`;
    // npmlog output will broken QR in some case ,some we using console.log
    console.log(`The following QR encoding url is\n${jsBundleURL}\n`);
    qrcode.generate(jsBundleURL,{small: this.params.smallqr});
    console.log("\nPlease download Weex Playground app from https://github.com/alibaba/weex and scan this QR code to run your app, make sure your phone is connected to the same Wi-Fi network as your computer runing WeexToolkit.\n")
  },
  
  bindProcessEvent() {
    let self = this;
    process.on('uncaughtException', function(err) {
      if(err.errno === 'EADDRINUSE') {
        npmlog.info('The server has been setted up.');
      }else {
        console.log(err);  
      }    
      process.exit(1);
    }); 
   process.on('SIGINT', function () {
        console.log(chalk.green("weex  server stoped"));
        fsUtils.deleteFolderRecursive(self.params.temDir)        
        process.exit() 
    }) 

   
    process.on('SIGTERM', function () {
        console.log(chalk.green("weex server stoped"));
        fsUtils.deleteFolderRecursive(self.params.temDir);
        process.exit() 
    })  
  },
  
  getIP () {
    let IP =   nwUtils.getPublicIP();
    if (this.parmas.host != ''){
        IP = this.host
    }
    return IP;
    
  },
  startWebSocket(fileName){
    let port = this.params.websocketPort;
    let wss = wsServer({port: port})
    let self = this
    npmlog.info((new Date()) + `WebSocket  is listening on port ${port}`)         
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            npmlog.info('received: %s', message);
        });
        ws.send("ws server ok")
        self.wsConnection = ws
        self.watchForWSRefresh(fileName)
    })
  },
  
  watchForWSRefresh(fileName){
    let self = this;
    watch(path.dirname(this.params.entry), function(fileName){
        
        if (!!fileName.match(`${self.params.temDir}`))  {
            return
        }
        console.log(fileName);
        if (/\.(js|we|vue)$/gi.test(fileName)){
            let transformP  = self.transformTarget(self.params.entry, self.params.output)
            transformP.then( function(fileName){
                console.log('refresh!');
                self.wsConnection.send("refresh");                    
            })
        }
    });
  },
  
  open(url) {
    if (!this.params.notopen){
      opener(url);
    }else{
      npmlog.info(`weex preview url:  ${url}`)
    }
  },
};

module.exports = function(args) {
  Previewer.init(args);
};




