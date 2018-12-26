import Vue from 'vue'
import VueRouter from 'vue-router'
import { Route } from 'vue-router'
interface Snotify {
  simple: any
  success: any
  info: any
  warning: any
  error: any
  async: any
  confirm: any
  prompt: any
  html: any
  setDefaults: any
  get: any
  remove: any
  clear: any
  create: any
}

declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}
// 扩充
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter,
    $route: Route,
    $snotify: Snotify,
    $tours: any,
    $copyText: any
  }
}