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
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { BCollapse } from 'bootstrap-vue/esm/components/collapse/collapse'
import { BNavItem } from 'bootstrap-vue/esm/components/nav/nav-item'
import { BNavbar } from 'bootstrap-vue/esm/components/navbar/navbar'
import { BNavbarToggle } from 'bootstrap-vue/esm/components/navbar/navbar-toggle'
import { BNavbarBrand } from 'bootstrap-vue/esm/components/navbar/navbar-brand'
import { BNavbarNav } from 'bootstrap-vue/esm/components/navbar/navbar-nav'
import * as types from '../../store/mutation-types'

import './navbar.scss'
import {
  State,
  Action
} from 'vuex-class'

@Component({
  template: require('./navbar.html'),
  components: {
    'b-collapse': BCollapse,
    'b-nav-item': BNavItem,
    'b-navbar': BNavbar,
    'b-navbar-toggle': BNavbarToggle,
    'b-navbar-brand': BNavbarBrand,
    'b-navbar-nav': BNavbarNav
  }
})
export class NavbarComponent extends Vue {
  @State('environmentSetting') environmentSetting
  @State('helpSetting') helpSetting
  @State('bundleSetting') bundleSetting

  get enableEnvironmentSetting () {
    return this.$route.meta.setting
  }

  get title () {
    return this.$t(`${this.$route.meta.title}.title`)
  }

  @Watch('$route.path')
  pathChanged () {
    console.log('Changed current path to: ' + this.$route.path)
  }

  toggleEnvironmentSetting () {
    this.$store.commit(types.UPDATE_ENVIRONMENT_SETTING, !this.environmentSetting)
  }

  toggleHelpSetting () {
    this.$store.commit(types.UPDATE_HELP_SETTING, !this.helpSetting)
  }

  toggleBundlesModal () {
    this.$store.commit(types.UPDATE_BUNDLE_SETTING, !this.bundleSetting)
  }
}
