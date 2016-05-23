
export var  vueInstance

export function initVue(){
    window._vueInstance = vueInstance = new Vue({
        el: '#logs',
        data: {
            logs: [
               // {content:'log content',flag: 'log flag'} //
            ]
        },
        methods:{
            clearLog:function(){
                this.logs = []
            }
        }
    })
}
