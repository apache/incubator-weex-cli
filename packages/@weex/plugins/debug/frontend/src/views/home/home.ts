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
import bPopover from 'bootstrap-vue/es/components/popover/popover'
import filters from './filters'
import './home.scss'

const Module = namespace('home')

export interface Tip {
  icon: string
  title: string
  des: string
  url: string
}

@Component({
  template: require('./home.html'),
  components: {
    'b-container': bContainer,
    'b-col': bCol,
    'b-row': bRow,
    'b-popover': bPopover,
    'qrcode': QrcodeVue
  },
  filters
})

export class HomeComponent extends Vue {
  @Module.State('connectUrl') connectUrl
  @Module.State('version') version
  @Module.State('bundles') bundles
  @Module.Action('updateVersion') updateVersion
  @Module.Action('updateQRCode') updateQRCode
  @Module.Action('cleanQRCode') cleanQRCode
  @Module.Action('updateBundles') updateBundles
  @State('webSocketHost') webSocketHost

  defaultWeexTips: any = [
    {
      icon: 'icon-feiji',
      title: '快速使用',
      des: '快速了解如何在你的开发中使用 weex 调试工具',
      url: 'http://weex.apache.org/tools/toolkit.html#debug'
    },
    {
      icon: 'icon-jiaochengicon',
      title: '使用教程',
      des: '详细介绍各个功能的使用说明',
      url: 'http://weex.apache.org/tools/toolkit.html#debug'
    },
    {
      icon: 'icon-box',
      title: '集成 Weex Devtool 到你的应用',
      des: '了解如何在你的应用中集成 Weex Devtool SDK',
      url: 'http://weex.apache.org/cn/guide/integrate-devtool-to-ios.html'
    },
    {
      icon: 'icon-taolun',
      title: '帮助和意见反馈',
      des: '提交Github issue 和帮助提高 Weex Devtool',
      url: 'https://github.com/weexteam/weex-toolkit/issues/new?labels=debug'
    }
  ]
  tips: Tip[]
  activeType: string = localStorage.getItem('activeMode') || 'debug'
  activeBundle: string = localStorage.getItem('activeBundle') || ''
  socket: any = null
  defaultBundles: any = [{
    updateTime: '2018年12月25日 15:12',
    output: 'http://dotwe.org/vue/f1a7f28cc5d470a9c296a04a1a79aa4a',
    size: '120',
    time: '120000',
    entry: '/Users/kw/github/toolkit/def-test/src/pages/index'
  }]

  mounted () {
    this.initWebSocket()
    if (!this.socket) {
      this.initWebSocket()
    }
  }

  created () {
    this.tips = this.defaultWeexTips
  }

  initWebSocket () {
    this.connection()
  }

  connection () {
    this.socket = new SockJS(`ws://${this.webSocketHost}/page/entry`)
    this.socket.on('connect', (data) => {
      this.socket.send(JSON.stringify({ method: 'WxDebug.applyChannelId' }))
      this.socket.send(JSON.stringify({ method: 'WxDebug.queryServerVersion' }))
    })
    this.socket.on('data', (data) => {
      data = JSON.parse(data)
      if (data.method === 'WxDebug.pushChannelId') {
        this.updateQRCode(data.params)
        this.updateBundles(data.params.bundles || [])
        this.$snotify.clear()
      } else if (data.method === 'WxDebug.pushServerVersion') {
        this.updateVersion(data.params.version)
      } else if (data.method === 'WxDebug.startDebugger') {
        this.$router.push({ path: `/client/weex/${data.params}?type=weex` })
        this.disconnect()
      }
    })
    this.socket.on('close', (data) => {
      this.disconnect()
    })
    this.socket.on('error', (data) => {
      this.disconnect()
    })
  }

  navigator (url: string) {
    if (url) {
      window.open(url)
    } else {
      this.$snotify.info('文档还在完善中...')
    }
  }

  toggleType (type) {
    this.activeType = type
    localStorage.setItem(`activeMode`, type)
  }

  disconnect () {
    this.socket && this.socket.close()
    this.cleanQRCode()
    this.$snotify.clear()
  }

  openQRCode (bundle: any) {
    this.activeBundle = bundle.entry
    localStorage.setItem('activeBundle', bundle.entry)
  }

  open (value: string) {
    this.$snotify.async('打开页面 ...', () => new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({ method: 'WxDebug.openFile', params: value }))
      setTimeout(() => resolve({
        body: '打开成功',
        config: {
          closeOnClick: true,
          timeout: 1000
        }
      }), 1000)
    }))
  }

  async copy (value: string, filterName: string) {
    if (filterName) {
      value = filters[filterName](value)
    }
    const res = this.$copyText(value)
    this.$snotify.success('复制成功')
  }
}
