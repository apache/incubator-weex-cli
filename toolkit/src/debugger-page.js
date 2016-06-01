const _ = require("underscore")

let LOG_LEVEL_LIST = ["all","verbose","debug","info","warn","error"]

import {setLogLevel } from './libs/debugger';


var LogAutoScrollMark;
function activeLogAutoScroll(){
    LogAutoScrollMark = setInterval(()=> $("#logger").scrollTop( $("#logger").prop('scrollHeight')),100)
}

function disableLogAutoScroll(){
    clearInterval(LogAutoScrollMark)
}


function logFullscreenActive(){
    var hiddenEles = [$("#page-title") , $(".level-controller") , $(".ahead-log")]
    _.each ( hiddenEles , (e)=>{
        e.hide(500)
    })
    setTimeout( ()=>{
        $("#logs").data("origin-width",$("#logs").width())            
        $("#logs").css("width","100%")
        setLoggerHeight()            
    },500)
    
}

function  logFullscreenDisable(){
    $("#logs").css("width",`${$("#logs").data("origin-width")}px`)        
    setTimeout( ()=>{
        var hiddenEles = [$("#page-title") , $(".level-controller") , $(".ahead-log")]    
        _.each ( hiddenEles , (e)=>{
            e.show(500)
        })
        setTimeout( ()=>{
            setLoggerHeight()
        },600)
    },400)
}


    



export function setLoggerHeight(){
    let loggerTop = $("#logger").position()['top']
    let bottomHeight = $(".bottom-action").height()
    let viewportHeight = $(window).height()

    let target = viewportHeight - (loggerTop + bottomHeight + 60)
    $("#logger .panel-body").css("min-height" , `${target}px`)
    $("#logger").css("height" , `${target}px`)    
}





export var  vueInstance
export function initVue(){
    window._vueInstance = vueInstance = new Vue({
        el: '#logs',
        data: {
            logs: [
               // {content:'log content',flag: 'log flag'} //
            ],
            feLogLevel:"info",
            feLogLevelForClass:[],
            feLogLevelClassObj:{error:false , warn: false , info:false , debug:false , verbose: false , all: false},
            deviceLevel:"",            
            deviceLevelClassObj:{error:false , warn: false , info:false , debug:false , verbose: false , all: false},
            isAutoScroll:false,
            isFullscreen:false
        },
        methods:{
            clearLog(){
                this.logs = []
            },
            changeDisplayLevel(e){
                let displayLevel = $(e.target).data("level")
                if (!(displayLevel)){return}
                this.feLogLevel = displayLevel
                this.updateFeLogLevel()
            },
            updateFeLogLevel(){
                let currentLevel = this.feLogLevel
                let i = LOG_LEVEL_LIST.indexOf(currentLevel)
                let targetLevels = LOG_LEVEL_LIST.slice(i)
                targetLevels =  _.map(targetLevels,l => `level-${l}`)
                this.feLogLevelForClass =  targetLevels
                for (let l in  this.feLogLevelClassObj){
                    this.feLogLevelClassObj[`${l}`] = false
                }
                this.feLogLevelClassObj[`${currentLevel}`] = true
            },
            changeDeviceLevel(e){
                let level = $(e.target).data("level")
                if (!(level)){return}
                this.deviceLevel = level
                this.updateDeviceLevel()
                setLogLevel(level)                
            },
            updateDeviceLevel(){
                if (!this.deviceLevel || this.deviceLevel.length < 1){return;}
                for (let l in  this.deviceLevelClassObj){
                    this.deviceLevelClassObj[`${l}`] = false
                }
                this.deviceLevelClassObj[`${this.deviceLevel}`] = true
            },
            autoScrollClick(){
                let self = this
                setTimeout(
                    function(){
                        if (self.isAutoScroll){
                            activeLogAutoScroll()
                        }else{
                            disableLogAutoScroll()
                        }
                    }
                    ,30)
            },
            wheellogger(e){
                disableLogAutoScroll()
                this.isAutoScroll = false
            },
            setFullscreen(){
                if (this.isFullscreen){
                    logFullscreenDisable()
                    this.isFullscreen = false
                }else{
                    logFullscreenActive()
                    this.isFullscreen = true
                }
            }
        }
    })
    vueInstance.updateFeLogLevel()
}
