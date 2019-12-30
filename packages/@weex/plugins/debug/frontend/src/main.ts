/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
import { VBTooltip } from 'bootstrap-vue/esm/directives/tooltip/tooltip'
import { VBPopover } from 'bootstrap-vue/esm/directives/popover/popover'
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
Vue.directive('b-popover', VBPopover)
Vue.directive('b-tooltip', VBTooltip)

const options: { toast: SnotifyToastConfig } = {
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
