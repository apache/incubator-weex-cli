const _ = require("underscore")

let LOG_LEVEL_LIST = ["all","verbose","debug","info","warn","error"]

import {setLogLevel } from './libs/debugger';

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
            isAutoScroll:false
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
            }
        }
    })
    vueInstance.updateFeLogLevel()


}

var LogAutoScrollMark;
function activeLogAutoScroll(){
    LogAutoScrollMark = setInterval(()=> $("#logger").scrollTop( $("#logger").prop('scrollHeight')),100)
}

function disableLogAutoScroll(){
    clearInterval(LogAutoScrollMark)
}


export function setLoggerHeight(){
    let loggerTop = $("#logger").position()['top']
    let bottomHeight = $(".bottom-action").height()
    let viewportHeight = $(window).height()

    let target = viewportHeight - (loggerTop + bottomHeight + 80)
    $("#logger .panel-body").css("min-height" , `${target}px`)
}


