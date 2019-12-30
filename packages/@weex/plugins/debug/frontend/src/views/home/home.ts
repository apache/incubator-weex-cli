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
import { Component, Vue } from 'vue-property-decorator'
import {
  State,
  Action,
  namespace
} from 'vuex-class'
import SockJS from 'simple-websocket'
import { BContainer } from 'bootstrap-vue/esm/components/layout/container'
import { BCol } from 'bootstrap-vue/esm/components/layout/col'
import { BRow } from 'bootstrap-vue/esm/components/layout/row'
import QrcodeVue from 'qrcode.vue'
import { BPopover } from 'bootstrap-vue/esm/components/popover/popover'
import filters from './filters'
import './home.scss'

const Module = namespace('home')

export interface Tip {
  icon: string
  title: any
  des: any
  url: any
}

@Component({
  template: require('./home.html'),
  components: {
    'b-container': BContainer,
    'b-col': BCol,
    'b-row': BRow,
    'b-popover': BPopover,
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
  tips: Tip[]
  activeType: string = localStorage.getItem('activeMode') || 'debug'
  activeBundle: string = localStorage.getItem('activeBundle') || ''
  socket: any = null

  mounted () {
    this.initWebSocket()
    if (!this.socket) {
      this.initWebSocket()
    }
  }

  created () {
    this.initTips()
  }

  initTips () {
    this.tips = [
      {
        icon: 'icon-feiji',
        title: this.$t('home.tips.quickStartTitle'),
        des: this.$t('home.tips.quickStartDesc'),
        url: this.$t('home.tips.quickStartUrl')
      },
      {
        icon: 'icon-jiaochengicon',
        title: this.$t('home.tips.guideTitle'),
        des: this.$t('home.tips.guideDesc'),
        url: this.$t('home.tips.guideUrl')
      },
      {
        icon: 'icon-box',
        title: this.$t('home.tips.integerTitle'),
        des: this.$t('home.tips.integerDesc'),
        url: this.$t('home.tips.integerUrl')
      },
      {
        icon: 'icon-taolun',
        title: this.$t('home.tips.helpTitle'),
        des: this.$t('home.tips.helpDesc'),
        url: this.$t('home.tips.helpUrl')
      }
    ]
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
      }
    })
    this.socket.on('close', (data) => {
      this.disconnect()
    })
    this.socket.on('error', (data) => {
      this.disconnect()
    })
  }

  toggleType (type) {
    this.activeType = type
    localStorage.setItem(`activeMode`, type)
  }

  disconnect () {
    this.socket && this.socket.connected && this.socket.close()
    this.cleanQRCode()
    this.$snotify.clear()
  }

  openQRCode (bundle: any) {
    this.activeBundle = bundle.entry
    localStorage.setItem('activeBundle', bundle.entry)
  }

  open (value: string) {
    this.$snotify.async(`${this.$t('home.toastTips.openPage')} ...`, () => new Promise((resolve, reject) => {
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

  navigator (url: string) {
    window.open(url, '_blank')
  }

  handleLanguageSetting (locale: string) {
    this.$i18n.locale = locale
    this.initTips()
    localStorage.setItem('language', locale)
  }

  async copy (value: string, filterName: string) {
    if (filterName) {
      value = filters[filterName](value)
    }
    const res = this.$copyText(value)
    this.$snotify.success(`${this.$t('home.toastTips.copySuccess')}`)
  }
}
