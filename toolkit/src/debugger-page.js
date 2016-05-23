const _ = require("underscore")

let LOG_LEVEL_LIST = ["all","verbose","debug","info","warn","error"]

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
            feLogLevelClassObj:{error:false , warn: false , info:false , debug:false , verbose: false , all: false}            
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
            }
        }
    })
    
    vueInstance.updateFeLogLevel()
}
