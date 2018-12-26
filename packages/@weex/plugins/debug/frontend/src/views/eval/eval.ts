import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  State,
  Action,
  namespace
} from 'vuex-class'
import bEmbed from 'bootstrap-vue/es/components/embed/embed'
import bFormSelect from 'bootstrap-vue/es/components/form-select/form-select'
import bButton from 'bootstrap-vue/es/components/button/button'
import SockJS from 'simple-websocket'
import * as types from '../../store/mutation-types'
import { Environment } from '../../store/modules/weex'
import { SnotifyToastConfig, SnotifyPosition } from 'vue-snotify'
import './eval.scss'
import { resolve } from 'dns'

const Module = namespace('eval')

@Component({
  template: require('./eval.html'),
  components: {
    'b-embed': bEmbed,
    'b-button': bButton,
    'b-form-select': bFormSelect
  }
})
export class EvalComponent extends Vue {

}
