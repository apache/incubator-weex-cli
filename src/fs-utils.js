const fs = require('fs')
  , os = require('os')
  , url = require('url')
  , path = require('path')
  , fse = require('fs-extra')
  , _ = require("underscore");

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      }
      else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function copyRecursiveSync(src, dest, reFilter) {
  let exists = fs.existsSync(src);
  let stats = exists && fs.statSync(src);
  let isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    try {
      fs.mkdirSync(dest);
    }
    catch (e) {
      fse.removeSync(dest)
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function (childItemName) {
      if (reFilter.test(childItemName) && /[^(weex_tmp)]/.test(childItemName)) {
        // TODO: hardcode
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      }
    });
  }
  else {
    try {
      fs.linkSync(src, dest);
    }
    catch (e) {
      fse.removeSync(dest)
      fs.linkSync(src, dest);
    }
  }
}
//wrapper for union
function getTransformerWraper(rootPath, transformerFunc) {
  let transformerWraper = function (req, res) {
    let urlObj = url.parse(req.url)
    let filePath = urlObj.pathname
    if (filePath.endsWith(".we")) {
      if (filePath[0] == "/") {
        filePath = filePath.substring(1, filePath.length)
      }
      let wePath = path.join(rootPath, filePath)
        //console.log(`file ${filePath}`)                                                  
        //console.log(`root  ${rootPath}`)          
        //console.log(`we ${wePath}`)                              
      let filename = path.basename(wePath).replace(/\..+/, '')
      let tmpdir = os.tmpdir()
      let jsPath = path.join(tmpdir, `${filename}.js`)
      let transformP = transformerFunc(wePath, jsPath)
      transformP.then(function () {
        fs.readFile(jsPath, 'utf8', function (err, data) {
          if (err) {
            console.error(err)
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            })
            res.end('Server Error\n')
          }
          else {
            res.writeHead(200, {
              'Content-Type': 'application/javascript'
            })
            res.end(data);
          }
        })
      }).catch(function (e) {
        console.error(e)
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        })
        res.end('Server Error\n')
      })
    }
    else {
      res.emit('next')
    }
  }
  return transformerWraper
}

// replace file contents
function replace(filePath,regarr) {
  return new Promise((resolve,reject) => {
    let content = fs.readFileSync(filePath, {
      encoding: 'utf-8'
    });
    return resolve(content);
  }).then((content) => {
      regarr.forEach((regObj) => {
        content = content.replace(regObj.rule, function () {
          return regObj.scripts;
        });  
      })
      return fs.writeFileSync(filePath,content);
  })
}

module.exports = {
  deleteFolderRecursive: deleteFolderRecursive, 
  copyRecursiveSync: copyRecursiveSync, 
  getTransformerWraper: getTransformerWraper,
  replace: replace,
}