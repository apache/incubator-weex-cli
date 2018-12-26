import { Component, Vue } from 'vue-property-decorator'
import {
  State,
  Action,
  namespace
} from 'vuex-class'
import SockJS from 'simple-websocket'
import bContainer from 'bootstrap-vue/es/components/layout/container'
import bCol from 'bootstrap-vue/es/components/layout/col'
import bRow from 'bootstrap-vue/es/components/layout/row'
import QrcodeVue from 'qrcode.vue'
import './default.scss'

export interface Tip {
  icon: string
  title: string
  des: string
  url: string
}

@Component({
  template: require('./default.html'),
  components: {
    'b-container': bContainer,
    'b-col': bCol,
    'b-row': bRow,
    'qrcode': QrcodeVue
  }
})

export class DefaultComponent extends Vue {
  log: any
}
