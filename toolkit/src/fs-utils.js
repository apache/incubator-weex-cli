const fs = require('fs'),
    fse = require('fs-extra'),      
    _   = require("underscore"),
    weexTransformer = require('weex-transformer'),
    path = require('path');


function deleteFolderRecursive(path){
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}


function copyRecursiveSync(src, dest , reFilter) {
  let exists = fs.existsSync(src);
  let stats = exists && fs.statSync(src);
  let isDirectory = exists && stats.isDirectory();
    if (exists && isDirectory) {
        try{
            fs.mkdirSync(dest);
        }catch(e){
            fse.removeSync(dest)
            fs.mkdirSync(dest);            
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            if (reFilter.test(childItemName) ){ 
                copyRecursiveSync(path.join(src, childItemName),
                                  path.join(dest, childItemName));
            }
        });
    } else {
        try{
            fs.linkSync(src, dest);
        }catch(e){
            fse.removeSync(dest)
            fs.linkSync(src, dest);            
        }
    }
}


//wrapper for union

function getTransformerWraper(rootPath){
  
  let  transformerWraper = function(req,res)  {
    let filePath = req.url
    if (filePath.endsWith(".we")){
      //console.log(filePath)
      if (filePath[0] == "/"){
        filePath  = filePath.substring(1, filePath.length )
      }
      filePath = path.join(rootPath, filePath)
      fs.readFile(filePath , 'utf8' , function(err,data){
        if (err){
          console.error(err)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Server Error\n')    
        }else{
          let filename = path.basename(filePath).replace(/\..+/, '')        
          let transRes = weexTransformer.transform(filename,data, "")
          let logs = transRes.logs
          try{
            logs = _.filter(logs ,(l) => (  l.reason.indexOf("Warning:") == 0) || ( l.reason.indexOf("Error:") == 0 ) )
            if (logs.length > 0){console.info(`weex transformer complain:  ${filePath} \n`)}
            _.each(
              logs,
              (l)=>  console.info(   `    line${l.line},column${l.column}:\n        ${l.reason}\n`   ) )
          } catch(e){
            console.error(e)
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' })
          res.end(transRes.result);    
        }
      })
    }else{
      res.emit('next')
    }
  }

  return  transformerWraper
}


module.exports = {
  deleteFolderRecursive: deleteFolderRecursive,
  copyRecursiveSync: copyRecursiveSync,
  getTransformerWraper: getTransformerWraper
}
