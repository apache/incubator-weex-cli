const _   = require("underscore"),
      npmlog = require('npmlog');



function showLoaderErr(errJSONArray){
    console.log("Found Error in your weex file:\n")
    _.each(errJSONArray,function(eStr){
        if (eStr.indexOf("?entry=true") != -1){
            let [source,info]  = eStr.split("?entry=true")
            npmlog.error(`${source.trim()} : ${info.trim()}`)
        }else{
            npmlog.error(eStr)
        }
    })
    console.log("\n")
}

function showLoaderWarn(warnJSONObjArray){

    let showWarningTitle = false
    _.each(warnJSONObjArray,function(wStr){
        try{
            let [source,info] = wStr.split("\n")
            source =  source.split("!")
            source = source[source.length -1]
            if (info.indexOf("NOTE:") == -1  &&  showWarningTitle == false){
                console.log("Found Warning in your weex file:\n")
                showWarningTitle = true
            }
            if (info.indexOf("NOTE:") == -1){
                npmlog.warn(`${source.trim()} : ${info.trim()}`)
            }
        }catch(e){
            npmlog.warn(wStr)
        }
    })
    console.log("\n")        
}


function displayWebpackStats(webPackStatsObj){
    if (displayWebpackStats.runAgain == true){
        console.log("current we file hot reloaded")
    }else{
        displayWebpackStats.runAgain = true 
    }

    if  ( (!webPackStatsObj) ||  (!webPackStatsObj.toJson)){
        return 
    }
    
    var jsonStats = webPackStatsObj.toJson()
    
    if (webPackStatsObj.hasErrors && webPackStatsObj.hasErrors() &&  jsonStats.errors.length > 0 ){
        showLoaderErr(jsonStats.errors)
    }
    
    if(webPackStatsObj.hasWarnings  && webPackStatsObj.hasWarnings() &&  jsonStats.warnings.length > 0){
        showLoaderWarn(jsonStats.warnings)
    }
}



module.exports = {
    displayWebpackStats:displayWebpackStats
}
