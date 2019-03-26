import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  State,
  Action,
  namespace
} from 'vuex-class'
import QrcodeVue from 'qrcode.vue'
import bEmbed from 'bootstrap-vue/es/components/embed/embed'
import bFormSelect from 'bootstrap-vue/es/components/form-select/form-select'
import bButton from 'bootstrap-vue/es/components/button/button'
import SockJS from 'simple-websocket'
import bModal from 'bootstrap-vue/es/components/modal/modal'
import MonacoEditor from 'vue-monaco-editor'
import * as types from '../../store/mutation-types'
import { Environment } from '../../store/modules/weex'
import { SnotifyToastConfig, SnotifyPosition } from 'vue-snotify'
import './weex.scss'

const Module = namespace('weex')

@Component({
  template: require('./weex.html'),
  components: {
    'b-embed': bEmbed,
    'b-button': bButton,
    'b-modal': bModal,
    'b-form-select': bFormSelect,
    'monacoeditor': MonacoEditor,
    'qrcode': QrcodeVue
  }
})
export class WeexComponent extends Vue {
  @State('webSocketHost') webSocketHost
  @State('helpSetting') helpSetting
  @State('bundleSetting') bundleSetting
  @State('environmentSetting') environmentSetting
  @Module.Action('updateForm') updateForm
  @Module.Action('cleanEnvironment') cleanEnvironment
  @Module.Action('updateEnvironment') updateEnvironment
  @Module.Action('cleanHistorys') cleanHistorys
  @Module.State('remoteDebugStatus') remoteDebug
  @Module.State('networkStatus') network
  @Module.State('elementMode') elementMode
  @Module.State('logLevel') logLevel
  @Module.State('instanceUrl') instanceUrl
  @Module.State('historys') historys
  @Module.State('environment') environment
  bundleurl: string = ''
  bundles: string[] = []
  mockCode: string = ''
  modalShow: boolean = false
  bundlesModalShow: boolean = false
  modalKey: string = ''
  editor: any
  editorSrcPath: string = window.location.origin
  editorOptions: any = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: false,
    glyphMargin: true,
    minimap: {
      enabled: false
    },
    scrollbar: {
      arrowSize: 6
    }
  }
  elementModeOptions = [
    { value: 'native', text: 'Native' },
    { value: 'vdom', text: 'VDom' }
  ]
  logLevelOptions = [
    { value: 'debug', text: 'Debug' },
    { value: 'log', text: 'Log' },
    { value: 'info', text: 'Info' },
    { value: 'warn', text: 'Warn' },
    { value: 'error', text: 'Error' }
  ]
  tourCallBack: any = {
    onNextStep: this.customNextStepCallback,
    onPreviousStep: this.customPreStepCallback,
    onStop: this.customStopCallback
  }
  tourOptions: any
  steps: any
  historyLatestUrl: string = ''
  appVersion: string = ''
  userAgent: string = ''
  socket: any = null
  inspectorUrl: string = ''
  timer: any = null
  isSandbox: boolean = true
  editorShow: boolean = false
  canReload: boolean = true
  loadingTimer: any = null
  @Prop({ type: String })
  private channelId: { value: string }
  // computed
  get remoteDebugStatus () {
    return this.remoteDebug
  }
  get networkStatus () {
    return this.network
  }
  get sourcejs () {
    return this.environment.sourcejs
  }
  set sourcejs (value: string) {
    this.updateWeexEnvironment('sourcejs', value)
  }
  get elementModeSelected () {
    return this.elementMode
  }
  set elementModeSelected (value: boolean) {
    this.updateForm({ type: types.UPDATE_ELEMENT_MODE_STATUS, value: value })
    this.socket.send(JSON.stringify({
      method: 'WxDebug.setElementMode',
      params: {
        data: value
      }
    }))
  }
  get logLevelSelected () {
    return this.logLevel
  }
  set logLevelSelected (value: boolean) {
    this.updateForm({ type: types.UPDATE_LOG_LEVEL_STATUS, value: value })
    this.socket.send(JSON.stringify({
      method: 'WxDebug.setLogLevel',
      params: {
        data: value
      }
    }))
  }

  get workerjs () {
    return this.environment.workerjs
  }
  set workerjs (value: string) {
    this.updateWeexEnvironment('workerjs', value)
  }

  get jsframework () {
    return this.environment.jsframework
  }
  set jsframework (value: string) {
    this.updateWeexEnvironment('jsframework', value)
  }
  get dependencejs () {
    return this.environment.dependencejs
  }
  set dependencejs (value: string) {
    this.updateWeexEnvironment('dependencejs', value)
  }
  get jsservice () {
    return this.environment.jsservice
  }
  set jsservice (value: string) {
    this.updateWeexEnvironment('jsservice', value)
  }

  @Watch('helpSetting')
  help (n, o) {
    if (n) {
      this.$tours['miniappTour'].start()
    } else {
      this.$tours['miniappTour'].stop()
    }
  }

  @Watch('bundleSetting')
  bundle (n, o) {
    this.bundlesModalShow = n
  }

  created () {
    this.tourOptions = {
      labels: {
        buttonSkip: this.$t('tour.skip'),
        buttonPrevious: this.$t('tour.prevText'),
        buttonNext: this.$t('tour.nextText'),
        buttonStop: this.$t('tour.finishText')
      }
    }
    this.steps = [
      {
        target: '[data-v-step="1"]',  // We're using document.querySelector() under the hood
        content: `${this.$t('tour.step_1')}`
      },
      {
        target: '[data-v-step="2"]',
        content: `${this.$t('tour.step_2')}`
      },
      {
        target: '[data-v-step="3"]',
        content: `${this.$t('tour.step_3')}`
      },
      {
        target: '[data-v-step="4"]',
        content: `${this.$t('tour.step_4')}`,
        params: {
          placement: 'bottom'
        }
      },
      {
        target: '[data-v-step="5"]',
        content: `${this.$t('tour.step_5')}`,
        params: {
          placement: 'bottom'
        }
      },
      {
        target: '[data-v-step="6"]',
        content: `${this.$t('tour.step_6')}`,
        params: {
          placement: 'bottom'
        }
      },
      {
        target: '[data-v-step="7"]',
        content: `${this.$t('tour.step_7')}`,
        params: {
          placement: 'bottom'
        }
      },
      {
        target: '[data-v-step="8"]',
        content: `${this.$t('tour.step_8')}`,
        params: {
          placement: 'bottom'
        }
      }
    ]
  }

  mounted () {
    this.initWebSocket()
    this.$store.commit(types.UPDATE_CHANNEL_ID, this.channelId)
    if (!localStorage.getItem('hasBeenTour')) {
      this.$store.commit(types.UPDATE_HELP_SETTING, true)
    }
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      this.$store.commit(types.UPDATE_BUNDLE_SETTING, false)
    })
  }

  destroyed () {
    this.socket.send(JSON.stringify({ method: 'WxDebug.disable' }))
    this.socket.send(JSON.stringify({ method: 'WxDebug.network', params: {
      enable: false
    }}))
  }

  initWebSocket () {
    this.connection()
  }

  connection () {
    this.socket = new SockJS(`ws://${this.webSocketHost}/debugProxy/debugger/${this.channelId}`)
    this.socket.on('connect', (data) => {
      this.socket.send(JSON.stringify({ method: 'Page.stopScreencast' }))
      this.socket.send(JSON.stringify({ method: 'WxDebug.enablePerformanceMonitor', params: { value: true } }))
    })
    this.socket.on('data', (data) => {
      data = JSON.parse(data)
      const method = data.method
      if (method === 'WxDebug.pushDebuggerInfo') {
        clearTimeout(this.timer)
        if (data.params) {
          if (!data.params.device) {
            this.$router.replace({ path: '/' })
            return
          }
          let device = data.params.device
          let name = device.name
          if (name && name.indexOf('com.') === 0) {
            let split = name.split('.')
            name = split.slice(Math.min(split.length - 1, 2)).join('.')
          }
          this.bundles = data.params.bundles
          this.userAgent = name + '@' + device.model
          this.appVersion = 'v ' + device.weexVersion + ' - ' + device.platform + ' (inspector ' + device.devtoolVersion + ')'
          this.updateForm({ type: types.UPDATE_REMOTE_DEBUG_STATUS, value: typeof (device.remoteDebug) === 'undefined' ? sessionStorage.getItem('remoteDebug') === 'true' : device.remoteDebug })
          this.updateForm({ type: types.UPDATE_NETWORK_STATUS, value: typeof (device.network) === 'undefined' ? sessionStorage.getItem('network') === 'true' : device.network })
          this.updateForm({ type: types.UPDATE_LOG_LEVEL_STATUS, value: device.logLevel || 'debug' })
          this.updateForm({ type: types.UPDATE_ELEMENT_MODE_STATUS,value: device.elementMode || 'native' })
          this.initChromeDevtool()
        }

      } else if (method === 'WxDebug.reloadInspector') {
        this.inspectorUrl = ''
        this.$nextTick(() => {
          this.initChromeDevtool()
        })
      } else if (method === 'WxDebug.deviceDisconnect') {
        this.timer = setTimeout(function () {
          this.$router.replace({ path: '/' })
        }, 8000)
      } else if (method === 'WxDebug.bundleRendered') {
        this.$store.commit(types.UPDATE_BUNDLE_SETTING, false)
        this.historyLatestUrl = data.params.bundleUrl
        let env = Object.assign({}, this.environment)
        if (data.params.env) {
          for (let key in data.params.env) {
            if (key === 'jsservice') {
              env[key] = data.params.env[key].join(',')
            } else {
              env[key] = data.params.env[key]
            }
          }
          this.updateEnvironment(env)
        }
        this.isSandbox = data.params.isSandbox
        this.updateForm({ type: types.UPDATE_INSTANCE_URL, value: {
          value: data.params.bundleUrl,
          env: env
        } })
      } else if (method === 'WxDebug.getTemplateFile') {
        let env = Object.assign({}, this.environment)
        let template = data.params.value
        this.mockCode = ''
        this.$snotify.clear()
        this.modalShow = false
        this.$snotify.success(`${this.$t('weexDebugPage.generateFile')}${template}`)
        env[this.modalKey] = template
        this.updateEnvironment(env)
        this.modalKey = ''
      }
    })
    this.socket.on('close', (data) => {
      this.$router.replace({ path: '/' })
    })
    this.socket.on('error', (data) => {
      this.$router.replace({ path: '/' })
    })
  }

  initChromeDevtool () {
    this.inspectorUrl = `../../assets/inspector/inspector.html?ws=${this.webSocketHost}/debugProxy/inspector/${this.channelId}`
  }

  handleRemoteDebug ($event) {
    this.updateForm({ type: types.UPDATE_REMOTE_DEBUG_STATUS, value: $event.value })
    this.socket.send(JSON.stringify({ method: 'WxDebug.' + ($event.value ? 'enable' : 'disable') }))
  }

  handleNetwork ($event) {
    this.updateForm({ type: types.UPDATE_NETWORK_STATUS, value: $event.value })
    this.socket.send(JSON.stringify({
      method: 'WxDebug.network',
      params: {
        enable: $event.value
      }
    }))
  }

  reload () {
    if (this.canReload) {
      this.$snotify.async(`${this.$t('weexDebugPage.reloading')}...`, () => new Promise((resolve, reject) => {
        this.socket.send(JSON.stringify({ method: 'WxDebug.reload' }))
        this.canReload = false
        this.loadingTimer = setTimeout(() => {
          this.canReload = true
          resolve({
            body: this.$t('weexDebugPage.reloadSuccess'),
            config: {
              timeout: 1000,
              closeOnClick: true
            }
          })
        }, 1000)
      }))
    }
  }

  cleanHistory () {
    let comfirmOptions: SnotifyToastConfig = {
      position: SnotifyPosition.centerCenter,
      buttons: [
        { text: 'Yes', action: (toast) => {
          this.cleanHistorys()
          this.historyLatestUrl = ''
          this.$snotify.remove(toast.id)
        } },
        { text: 'No', action: (toast) => this.$snotify.remove(toast.id) }
      ]
    }
    this.$snotify.confirm(this.$t('weexDebugPage.ensureDeleteHistory'), comfirmOptions)
  }

  updateWeexEnvironment (type, value) {
    let env = Object.assign({}, this.environment)
    if (env[type] !== value) {
      env[type] = value
      this.updateEnvironment(env)
    }
  }

  activeWeexEnvironmentSetting () {
    this.$snotify.async(this.$t('weexDebugPage.changeEnvSetting'), () => new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({
        method: 'WxDebug.setContextEnvironment',
        params: {
          channelId: this.channelId,
          ...this.environment
        }
      }))
      this.socket.send(JSON.stringify({ method: 'WxDebug.reload' }))
      setTimeout(() => resolve({
        body: this.$t('weexDebugPage.changeSettingSuccess'),
        config: {
          closeOnClick: true,
          timeout: 1000
        }
      }), 1000)
    }))
  }

  cleanWeexEnvironmentSetting () {
    this.cleanEnvironment()
    this.socket.send(JSON.stringify({
      method: 'WxDebug.setContextEnvironment',
      params: {
        channelId: this.channelId,
        ...this.environment
      }
    }))
    this.socket.send(JSON.stringify({ method: 'WxDebug.reload' }))
  }

  navigator (value: string, environment: Environment) {
    if (!environment) {
      environment = this.environment
    }
    if (!value) {
      this.$snotify.error(this.$t('weexDebugPage.noEmptyUrl'))
      return
    } else {
      environment['sourcejs'] = value
    }
    this.$snotify.async(`${this.$t('weexDebugPage.loadingTip')}...`, () => new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({
        method: 'WxDebug.setContextEnvironment',
        params: {
          channelId: this.channelId,
          ...environment
        }
      }))
      this.socket.send(JSON.stringify({ method: 'WxDebug.reload' }))
      setTimeout(() => resolve({
        body: this.$t('weexDebugPage.loadingSuccess'),
        config: {
          closeOnClick: true,
          timeout: 1000
        }
      }), 1000)
    }))
  }

  restore () {
    this.cleanWeexEnvironmentSetting()
  }

  mockFile (code: string) {
    this.$snotify.async(`${this.$t('weexDebugPage.generatingFile')}...`, () => new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({ method: 'WxDebug.postTemplateFile', params: { value: this.editor.getValue() } }))
      this.editor.setValue('')
    }))
  }

  onMounted (editor) {
    this.editor = editor
  }

  toggleEditor (data: any) {
    let sourceUrl = this.environment[data]
    if (data === 'jsservice') {
      if (Array.isArray(sourceUrl)) {
        sourceUrl = sourceUrl[0]
      }
    }
    if (!/^http(s)?/ig.test(sourceUrl) && sourceUrl) {
      sourceUrl = `${window.location.origin}${sourceUrl}`
    }

    if (sourceUrl) {
      this.$http.get(sourceUrl).then((response: any) => {
        if (this.editor) {
          this.editor.setValue(response.body)
        } else {
          this.mockCode = response.body
        }
      }, response => {
        if (this.editor) {
          this.editor.setValue('')
        } else {
          this.mockCode = ''
        }
      })
    } else {
      this.mockCode = ''
    }

    this.modalKey = data
    this.modalShow = !this.modalShow
    setTimeout(() => {
      this.editorShow = true
    }, 200)
  }

  customNextStepCallback (currentStep) {
    if (currentStep === 4) {
      this.$store.commit(types.UPDATE_ENVIRONMENT_SETTING, true)
    }
  }

  customPreStepCallback (currentStep) {
    // if (currentStep === 5) {
    //   this.$store.commit(types.UPDATE_ENVIRONMENT_SETTING, true)
    // }
  }

  customStopCallback () {
    localStorage.setItem('hasBeenTour', 'true')
    this.$store.commit(types.UPDATE_ENVIRONMENT_SETTING, false)
    this.$store.commit(types.UPDATE_HELP_SETTING, false)
  }
}
