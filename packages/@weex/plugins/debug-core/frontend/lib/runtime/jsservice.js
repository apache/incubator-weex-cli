;(function(service, options){ ;// 1.3.9 - 2017.11.22 - 15:13:21
  service.register(options.serviceName, {
    /**
      * JS Service lifecycle. JS Service `create` will before then each instance lifecycle `create`. The return param `instance` is Weex protected param. This object will return to instance global. Other params will in the `services` at instance.
      *
      * @param  {String} id  instance id
      * @param  {Object} env device environment
      * @return {Object}
      */
    create: function(id, env, config) {
      return {
        instance: {
          InstanceService: function(weex) {
            var modal = weex.requireModule('modal')
            return {
              toast: function(title) {
                modal.toast({ message: title })
              }
            }
          }
        },
        NormalService: function(weex) {
          var modal = weex.requireModule('modal')
          return {
            toast: function(title) {
              modal.toast({ message: title })
            }
          }
        }
      }
    },
  
    /**
      * JS Service lifecycle. JS Service `refresh` will before then each instance lifecycle `refresh`. If you want to reset variable or something on instance refresh.
      *
      * @param  {String} id  instance id
      * @param  {Object} env device environment
      */
    refresh: function(id, env, config){
  
    },
  
    /**
      * JS Service lifecycle. JS Service `destroy` will before then each instance lifecycle `destroy`. You can deleted variable here. If you doesn't detete variable define in JS Service. The variable will always in the js runtime. It's would be memory leak risk.
      *
      * @param  {String} id  instance id
      * @param  {Object} env device environment
      * @return {Object}
      */
    destroy: function(id, env) {
  
    }
  })

; })({ register: global.registerService, unregister: global.unregisterService }, { serviceName: "qap_module_service" });