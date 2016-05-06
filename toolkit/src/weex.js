const fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    opener = require('opener'),
    httpServer = require('http-server'),
    http = require('http'),
    WebSocketServer = require('websocket').server,
    watch =  require('node-watch'),
    os  = require('os'),
    _   = require("underscore"),
    qrcode = require('qrcode-terminal'),    
    weexTransformer = require('weex-transformer'),
    nwUtils =  require('../build/nw-utils'),      
    fsUtils = require('../build/fs-utils'),      
    debuggerServer =  require('../build/debugger-server');


const WEEX_FILE_EXT = "we"
const WEEX_TRANSFORM_TMP = "weex_tmp"
const H5_Render_DIR = "h5_render"
const PREVIEW_SERVER_PORT = "8081"
const WEBSOCKET_PORT = "8082"
const NO_JSBUNDLE_OUTPUT = "no JSBundle output"

class Previewer{

    constructor( inputPath , outputPath , transformWatch ,host , shouldOpenBrowser  , displayQR ,  transformServerPath ){
        this.inputPath = inputPath
        this.host = host
        this.shouldOpenBrowser = shouldOpenBrowser
        this.displayQR = displayQR
        this.transformServerPath = transformServerPath
        
        this.serverMark = false

        if (!inputPath  &&  transformServerPath){
            this.serverMark = true            
            this.startServer()
            return
        }
        
        if ( outputPath == NO_JSBUNDLE_OUTPUT){
            this.outputPath = outputPath = null
            this.tempDirInit()
            this.serverMark = true             
            // when no js bundle output specified, start server for playgroundApp(now) or H5 renderer.                   
        }else{
            this.outputPath =  outputPath               
        }

        if (fs.lstatSync(inputPath).isFile()){
            try{
                if (fs.lstatSync(outputPath).isDirectory()){
                    let fileName = path.basename(inputPath).replace(/\..+/, '')            
                    this.outputPath =  outputPath = path.join(this.outputPath , `${fileName}.js`)
                }
            }catch(e){
                //fs.lstatSync my raise when outputPath is file but not exist yet.
            }
        }

        if (transformWatch){
            console.log(`watching ${inputPath}`)
            let self = this
            watch(inputPath, function (fileName){
                if (/\.we$/gi.test(fileName)){
                    console.log(`${fileName} updated`)
                    self.transforme(inputPath,outputPath)
                }
            })
        }else{
            this.transforme(inputPath,outputPath)
        }
    }

    transforme(inputPath,outputPath){

        let transformP
        let self = this        
        if (fs.lstatSync(inputPath).isFile()){      
            transformP  = this.transformTarget(inputPath , outputPath) // outputPath may be null , meaning start server
        }else if (fs.lstatSync(inputPath).isDirectory){
            try{
                fs.lstatSync(outputPath).isDirectory
            }catch(e){
                console.log(yargs.help())
                console.log("when input path is dir , output path must be dir too")
                process.exit(1)    
            }
            
            let filesInTarget = fs.readdirSync(inputPath)
            filesInTarget = _.filter(filesInTarget , (fileName)=>(fileName.length > 2 ) )        
            filesInTarget = _.filter(filesInTarget , (fileName)=>( fileName.substring(fileName.length - 2 ,  fileName.length) ==  WEEX_FILE_EXT ) )

            let filesInTargetPromiseList  = _.map(filesInTarget , function(fileName){
                let ip = path.join( inputPath , fileName)
                fileName = fileName.replace(/\.we/, '')                            
                let op = path.join( outputPath , `${fileName}.js`  )
                return self.transformTarget(ip , op)
            })
            transformP = Promise.all(filesInTargetPromiseList)
        }

        transformP.then( function(jsBundlePathForRender){
            if (self.serverMark == true) {  // typeof jsBundlePathForRender == "string"
                
                //no js bundle output specified, start server for playgroundApp(now) or H5 renderer.
                self.startServer(jsBundlePathForRender)
                self.startWebSocket()
            }else{
                console.log('weex JS bundle saved at ' + path.resolve(outputPath));          
            }
        }).catch(function(e){
            console.error(e)
        })        
    }

    tempDirInit(){
        fse.removeSync(WEEX_TRANSFORM_TMP)

        //turnoff H5 preview
        //fs.mkdirSync(WEEX_TRANSFORM_TMP)
        //fse.copySync(`${__dirname}/../node_modules/weex-html5` , `${WEEX_TRANSFORM_TMP}/${H5_Render_DIR}`) 
        
        fse.mkdirsSync(`${WEEX_TRANSFORM_TMP}/${H5_Render_DIR}`)  
    }

    startServer(fileName){
        let options = {
            root: ".",
            cache: "-1",
            showDir: true,
            autoIndex: true
        }
        let self = this
        
        if (this.transformServerPath){
            options.root = this.transformServerPath
            options.before = [ fsUtils.getTransformerWraper(options.root) ]      
        }
        
        let server = httpServer.createServer(options)
        server.listen(PREVIEW_SERVER_PORT, "0.0.0.0", function () {
            console.log((new Date()) + `http  is listening on port ${PREVIEW_SERVER_PORT}`)

            if (self.transformServerPath){
                let IP =  nwUtils.getPublicIP()                
                console.log(  `we file in local path ${self.transformServerPath} will be transformer to JS bundle\nplease access http://${IP}:${PREVIEW_SERVER_PORT}/`  )
                return 
            }
            

            if (self.displayQR){
	            self.showQR(fileName)
	            return
            }
            
            var previewUrl = `http://${self.host}:${PREVIEW_SERVER_PORT}/${WEEX_TRANSFORM_TMP}/${H5_Render_DIR}/?hot-reload_controller&page=${fileName}&loader=xhr`
            if (self.shouldOpenBrowser){
                opener(previewUrl)
            }else{
                console.log(`weex preview url:  ${previewUrl}`)
            }
        })

        process.on('SIGINT', function () {
            console.log("weex  server stoped")
            fsUtils.deleteFolderRecursive(WEEX_TRANSFORM_TMP)        
            process.exit() 
        }) 

        process.on('SIGTERM', function () {
            console.log("weex server stoped")
            fsUtils.deleteFolderRecursive(WEEX_TRANSFORM_TMP)
            process.exit() 
        }) 
    }

    showQR(fileName){
        let host = this.host
        if (this.host == "127.0.0.1"){  // TODO: update to use nw-utils.js 
	        let ifaces = os.networkInterfaces()
	        let address = _.flatten(_.values(ifaces))
	        address = _.filter( address , (ifObj) =>  ( (ifObj.family == "IPv4") && (ifObj.address != "127.0.0.1") ) )
	        if (address.length > 0 ){
	            host = address[0].address
	        }
        }
        let jsBundleURL = `http://${host}:${PREVIEW_SERVER_PORT}/${WEEX_TRANSFORM_TMP}/${H5_Render_DIR}/${fileName}`
        console.log(`listen host is ${host} , you can change it by -h option`)
        qrcode.generate(jsBundleURL)
        console.log("please access https://github.com/alibaba/weex to download Weex Playground app")
    }

    startWebSocket(){
        let server = http.createServer(function(request, response) {
            response.writeHead(404) 
            response.end() 
        }) 
        server.listen(WEBSOCKET_PORT, function() {
            console.log((new Date()) + `WebSocket  is listening on port ${WEBSOCKET_PORT}`) 
        }) 
        let wsServer = new WebSocketServer({
            httpServer: server,
            autoAcceptConnections: false
        })
        let self = this
        wsServer.on('request',function(request){
            let connection = request.accept('echo-protocol', request.origin) 
            connection.sendUTF("ws server ok")
            self.wsConnection = connection
            self.watchForWSRefresh()
        }) 
    }

    /**
     * websocket refresh cmd
     */
    watchForWSRefresh(){
        let self = this
        watch(this.inputPath, function(filename){
            if (/\.we$/gi.test(fileName)){            
                let transformP  = self.transformTarget(this.inputPath,this.outputPath)
                transformP.then( function(fileName){
                    self.wsConnection.sendUTF("refresh")
                })
            }
        });
    }

    transformTarget(inputPath , outputPath){
        let promiseData = {promise: null,resolver: null,rejecter: null}
        promiseData.promise = new Promise(function (resolve, reject) {
            promiseData.resolver = resolve
            promiseData.rejecter = reject
        })    
        let filename = path.basename(inputPath).replace(/\..+/, '')
        fs.readFile(inputPath ,'utf8', function(err,data){
            if (err){
                promiseData.rejecter(err)
            }else{
                let res = weexTransformer.transform(filename,data, "")
                let logs = res.logs
                try{
                    logs = _.filter(logs ,(l) => (  l.reason.indexOf("Warning:") == 0) || ( l.reason.indexOf("Error:") == 0 ) )
                    if (logs.length > 0){console.info(`weex transformer complain:  ${inputPath} \n`)}            
                    _.each(
                        logs,
                        (l)=>  console.info(   `    line${l.line},column${l.column}:\n        ${l.reason}\n`   ) )
                } catch(e){
                    console.error(e)
                }

                let bundleWritePath
                if (outputPath){
                    bundleWritePath = outputPath
                }else{
                    bundleWritePath = `${WEEX_TRANSFORM_TMP}/${H5_Render_DIR}/${filename}.js`
                }
                fs.writeFileSync(bundleWritePath , res.result)
                if (outputPath){
                    promiseData.resolver(false)            
                }else{
                    promiseData.resolver(`${filename}.js`)            
                }
            }
        })
        return promiseData.promise
    }

}

var yargs = require('yargs')
var argv = yargs
        .usage('Usage: $0 foo/bar/we_file_or_dir_path  [options]')
        .boolean('qr')
        .describe('qr', 'display QR code for native runtime, default action')
        .option('h' , {demand:false})
        .default('h',"127.0.0.1")
        .option('o' , {demand:false})
        .default('o',NO_JSBUNDLE_OUTPUT)
        .describe('o', 'transform weex we file to JS Bundle, output path must specified (single JS bundle file or dir)')
        .option('watch' , {demand:false})
        .describe('watch', 'using with -o , watch input path , auto run transform if change happen')
        .option('s' , {demand:false})
        .default('s', null)
        .describe('s', 'start a http file server, weex .we file will be transforme to JS bundle on the server , specify local root path using the option')
        .help('help')
        .argv  ;


(function argvProcess(){
    
    if (argv.debugger){
        debuggerServer.startListen()
        return
    }

    var inputPath =  argv._[0]
    var transformServerPath = argv.s
    var badWePath =  !!( !inputPath ||   (inputPath.length < 2)  ) //we path can be we file or dir 

    if ( badWePath  &&  !transformServerPath ){
        console.log(yargs.help())
        process.exit(1)
    }

    if (transformServerPath){
        var absPath = path.resolve(transformServerPath)
        try{
            var res = fs.accessSync(transformServerPath)
        }catch(e){
            console.log(yargs.help())            
            console.log(`path ${absPath} not accessible`)
            process.exit(1)
        }
    }

    var host = argv.h  
    var shouldOpenBrowser =    false //argv.n  ? false : true
    var displayQR =    true //argv.qr  ? true : false
    var outputPath = argv.o  // js bundle file path  or  transform output dir path
    if ( typeof outputPath  != "string"){
        console.log(yargs.help())    
        console.log("must specify output path ")
        process.exit(1)    
    }
    var transformWatch =  argv.watch


    new Previewer(inputPath , outputPath , transformWatch, host , shouldOpenBrowser , displayQR ,  transformServerPath)

})()
