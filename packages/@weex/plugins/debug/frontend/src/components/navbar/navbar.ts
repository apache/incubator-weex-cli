import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import bCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
import bNavbar from 'bootstrap-vue/es/components/navbar/navbar'
import bNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle'
import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand'
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav'
import * as types from '../../store/mutation-types'

import './navbar.scss'
import {
  State,
  Action
} from 'vuex-class'

@Component({
  template: require('./navbar.html'),
  components: {
    'b-collapse': bCollapse,
    'b-nav-item': bNavItem,
    'b-navbar': bNavbar,
    'b-navbar-toggle': bNavbarToggle,
    'b-navbar-brand': bNavbarBrand,
    'b-navbar-nav': bNavbarNav
  }
})
export class NavbarComponent extends Vue {
  @State('environmentSetting') environmentSetting
  @State('helpSetting') helpSetting

  get enableEnvironmentSetting () {
    return this.$route.meta.setting
  }

  get title () {
    return this.$route.meta.title
  }

  @Watch('$route.path')
  pathChanged () {
    console.log('Changed current path to: ' + this.$route.path)
  }

  toggleEnvironmentSetting () {
    this.$store.commit(types.UPDATE_ENVIRONMENT_SETTING, !this.environmentSetting)
  }

  toggleHelpSetting () {
    if (!this.helpSetting) {
      this.$store.commit(types.UPDATE_HELP_SETTING, !this.helpSetting)
    }
  }
}
