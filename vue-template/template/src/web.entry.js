import Vue from 'vue'
import weex from 'weex-vue-render'
weex.init(Vue)

import App from './App.vue'
App.el = '#root'
new Vue(App)
