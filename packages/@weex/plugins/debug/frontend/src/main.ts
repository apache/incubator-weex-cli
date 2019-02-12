import Vue from 'vue'
import store from './store'
import { createRouter } from './router'
// https://www.npmjs.com/package/vue-js-toggle-button
import ToggleButton from 'vue-js-toggle-button'
import VueTour from 'vue-tour'
// https://artemsky.github.io/vue-snotify/
import Snotify, { SnotifyPosition, SnotifyToastConfig } from 'vue-snotify'
import VueResource from 'vue-resource'
import TreeView from 'vue-json-tree-view'
import VueClipboard from 'vue-clipboard2'
import vBTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip'
import vBPopover from 'bootstrap-vue/es/directives/popover/popover'
import i18n from './lang'

// const navbarComponent = () => import('./components/navbar').then(({ NavbarComponent }) => NavbarComponent)
// const navbarComponent = () => import(/* webpackChunkName: 'navbar' */'./components/navbar').then(({ NavbarComponent }) => NavbarComponent)

import './sass/iconfont.scss'
import './sass/main.scss'

Vue.use(ToggleButton)
Vue.use(VueTour)
Vue.use(VueResource)
Vue.use(TreeView)
// let vue-clipboard2 set container to current element by doing this
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.directive('b-popover', vBPopover)
Vue.directive('b-tooltip', vBTooltip)

const options: {toast: SnotifyToastConfig} = {
  toast: {
    position: SnotifyPosition.centerTop,
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
  i18n,
  store,
  router: createRouter(),
  components: {}
})
