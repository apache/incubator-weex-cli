import Vue from 'vue'
import store from './store'
import { createRouter } from './router'
// https://artemsky.github.io/vue-snotify/
import Snotify, { SnotifyPosition, SnotifyToastConfig } from 'vue-snotify'
import vBTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip'

// const navbarComponent = () => import('./components/navbar').then(({ NavbarComponent }) => NavbarComponent)
// const navbarComponent = () => import(/* webpackChunkName: 'navbar' */'./components/navbar').then(({ NavbarComponent }) => NavbarComponent)

import './sass/iconfont.scss'
import './sass/main.scss'

Vue.directive('b-tooltip', vBTooltip)

const options: {toast: SnotifyToastConfig} = {
  toast: {
    position: SnotifyPosition.rightBottom,
    bodyMaxLength: 20,
    titleMaxLength: 8,
    timeout: 1000,
    showProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    backdrop: -1
  }
}
Vue.use(Snotify, options)

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app-main',
  store,
  router: createRouter(),
  components: {}
})
