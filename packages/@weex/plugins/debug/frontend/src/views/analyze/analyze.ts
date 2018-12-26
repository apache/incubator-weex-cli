import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  State,
  Action,
  namespace
} from 'vuex-class'
import bCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
import bEmbed from 'bootstrap-vue/es/components/embed/embed'
import bTable from 'bootstrap-vue/es/components/table/table'
import bProgress from 'bootstrap-vue/es/components/progress/progress'
import bButton from 'bootstrap-vue/es/components/button/button'
import bModal from 'bootstrap-vue/es/components/modal/modal'
import SockJS from 'simple-websocket'
import * as types from '../../store/mutation-types'
import { Parser } from '../../util/parser'
import { SelectComponent } from '../../components/select'
import VeWaterfallBar from 'v-charts/lib/waterfall.common'
import bFormRadioGroup from 'bootstrap-vue/es/components/form-radio/form-radio-group'
import bPopover from 'bootstrap-vue/es/components/popover/popover'
import './analyze.scss'

const Module = namespace('analyze')

@Component({
  template: require('./analyze.html'),
  components: {
    'b-embed': bEmbed,
    'b-button': bButton,
    'wx-select': SelectComponent,
    'b-checkbox': bCheckbox,
    'b-progress': bProgress,
    'b-table': bTable,
    'b-modal': bModal,
    'b-popover': bPopover,
    'b-form-radio-group': bFormRadioGroup,
    've-waterfall': VeWaterfallBar
  }
})
export class AnalyzeComponent extends Vue {
  @State('webSocketHost') webSocketHost
  @Module.State('historys') historys
  @Module.State('captures') captures
  @Module.State('defaultHistory') defaultHistory
  @Module.State('defaultCapture') defaultCapture
  @Module.State('reloadToggle') reload
  @Module.State('compareToggle') compare
  @Module.State('captureToggle') capture
  @Module.State('apmData') apmData
  @Module.State('performanceMode') performanceMode
  @Module.State('performanceScoreSeed') performanceScoreSeed
  @Module.State('performanceScoreTextMap') performanceScoreTextMap
  @Module.Action('updateToggle') updateToggle
  @Module.Action('updateDefaultCapture') updateDefaultCapture
  @Module.Action('updateDefaultHistory') updateDefaultHistory
  @Module.Action('updateCaptures') updateCaptures
  @Module.Action('updateHistorys') updateHistorys
  @Module.Action('updateApmData') updateApmData
  start: boolean = false
  process: any = {
    queues: [],
    values: []
  }
  captureTimer: any = null
  socket: any = null
  completeCounter: {
    [key: string]: {
      count: number
      value: number
    }
  } = {}
  chartData: any = {
    columns: ['类型', '耗时'],
    rows: []
  }
  deviceInfo: {
    devtoolVersion?: string
    model?: string
    name?: string
    platform?: string
    weexVersion?: string
  } = {}
  chartSettings: any = {
    // totalNum: 24,
    totalName: '可交互时间',
    remainName: '其他耗时'
  }
  relativePositionWithFsAndAsync: number = 0
  reportType: string = 'all'
  reportOptions: any = [
    { text: '完整报告', value: 'all' },
    { text: '基本数据报告', value: 'basic' },
    { text: '页面评价报告', value: 'number' },
    { text: '渲染耗时报告', value: 'render' }
  ]
  startRecordTime: number
  endRecordTime: number
  activeId: any = ''
  reportData: any = ''
  progressValue: number = 0
  progressMaxValue: number = 0
  performanceTableData: any = {
    fields: [ {
      key: 'name',
      label: '指标项'
    }, {
      key: 'value',
      label: '指标值'
    }, {
      key: 'description',
      label: '说明'
    } ],
    items: [
    ]
  }
  modalShow: boolean = false
  detailMessage: any = ''
  treeViewerOptions: any = {
    maxDepth: 4,
    rootObjectKey: 'root'
  }
  pageScoreTableData: any = {
    data: [],
    score: 0
  }
  downloadName: string = ''
  downloadHref: string = ''
  defaultRenderType: any = {
    text: '所有',
    value: 'all'
  }
  renderTypes: any = [{
    text: '所有',
    value: 'all'
  }]
  @Watch('historys')
  historyChange () {
    let downloadContent
    let len = this.historys.length
    for (let i = 0; i < len;i++) {
      if (this.historys[i].key === this.activeId) {
        downloadContent = this.historys[i]
        break
      }
    }
    let downloadTime = new Date()
    this.downloadName = `${downloadTime.getTime()}-${this.reportData.properties.wxBizID}.json`
    this.downloadHref = URL.createObjectURL(new Blob([JSON.stringify(downloadContent,null,2)]))
  }

  mockAfterConfig (options) {
    let xAxis = options.xAxis
    let yAxis = options.yAxis
    options.xAxis = yAxis
    options.yAxis = xAxis

    options.series[1].label.normal.position = 'right'
    options.series[1].label.normal.formatter = (item) => {
      return `${item.data}ms`
    }
    options.color = ['#f37327','#f37327', '#61a0a8']
    if (this.relativePositionWithFsAndAsync) {
      options.series[0].data[2] = options.series[0].data[3] + this.relativePositionWithFsAndAsync
      options.series[0].data[1] = options.series[0].data[1] + this.relativePositionWithFsAndAsync - options.series[1].data[3]
      options.series[1].data[1] = options.series[1].data[1] - this.relativePositionWithFsAndAsync + options.series[1].data[3]
    }
    return options
  }
  protected parser: Parser

  @Prop({ type: String })
  private channelId: { value: string }

  get reloadToggle () {
    return this.reload
  }
  set reloadToggle (value) {
    this.updateToggle({ value: value, name: 'reloadToggle' })
  }
  get captureToggle () {
    return this.capture
  }
  set captureToggle (value) {
    this.updateToggle({ value: value, name: 'captureToggle' })
  }
  get compareToggle () {
    return this.compare
  }
  set compareToggle (value) {
    this.updateToggle({ value: value, name: 'compareToggle' })
  }

  mounted () {
    if (!this.parser) {
      this.parser = new Parser()
    }
    this.initWebSocket()
    this.$store.commit(types.UPDATE_CHANNEL_ID, this.channelId)
  }

  initData () {
    let jsAsyncTime
    let fsViewTime = this.reportData.stage.wxFirstInteractionView - this.reportData.stage.wxEndLoadBundle
    let bundleCompileTime = this.reportData.stage.wxEndLoadBundle - this.reportData.stage.wxRenderTimeOrigin
    let sourceRequestTime = this.reportData.stage.wxEndDownLoadBundle - this.reportData.stage.wxStartDownLoadBundle
    let interactionTime = this.reportData.stage.wxInteraction - this.reportData.stage.wxStartDownLoadBundle
    let otherTime
    let remainTime
    this.chartData.rows = []
    this.performanceTableData.items = []
    if (this.reportData.stage.wxJSAsyncDataEnd) {
      jsAsyncTime = this.reportData.stage.wxJSAsyncDataEnd - this.reportData.stage.wxJSAsyncDataStart
      this.relativePositionWithFsAndAsync = this.reportData.stage.wxJSAsyncDataStart - this.reportData.stage.wxEndLoadBundle
      otherTime = interactionTime - jsAsyncTime - fsViewTime - bundleCompileTime - sourceRequestTime + (fsViewTime - this.relativePositionWithFsAndAsync)
    } else {
      otherTime = interactionTime - fsViewTime - bundleCompileTime - sourceRequestTime
      this.relativePositionWithFsAndAsync = 0
    }
    if (jsAsyncTime) {
      remainTime = this.reportData.stage.wxInteraction - this.reportData.stage.wxStartDownLoadBundle - this.reportData.stage.wxJSAsyncDataEnd + this.reportData.stage.wxJSAsyncDataStart - this.reportData.stage.wxFirstInteractionView + this.reportData.stage.wxEndLoadBundle - this.reportData.stage.wxEndLoadBundle + this.reportData.stage.wxRenderTimeOrigin - this.reportData.stage.wxEndDownLoadBundle + this.reportData.stage.wxStartDownLoadBundle
      if (remainTime > 0) {
        this.chartData.rows.push({
          '耗时': remainTime,
          '类型': '其他耗时'
        })
      }

      this.chartData.rows.push({
        '耗时': jsAsyncTime,
        '类型': '业务异步请求时间'
      })
    } else {
      remainTime = this.reportData.stage.wxInteraction - this.reportData.stage.wxStartDownLoadBundle - this.reportData.stage.wxFirstInteractionView + this.reportData.stage.wxEndLoadBundle - this.reportData.stage.wxEndLoadBundle + this.reportData.stage.wxRenderTimeOrigin - this.reportData.stage.wxEndDownLoadBundle + this.reportData.stage.wxStartDownLoadBundle
      if (remainTime > 0) {
        this.chartData.rows.push({
          '耗时': remainTime,
          '类型': '其他耗时'
        })
      }
    }
    this.chartData.rows.push({
      '耗时': fsViewTime ,
      '类型': '首屏视图编译时间'
    })
    this.chartData.rows.push({
      '耗时': bundleCompileTime,
      '类型': 'JSBundle处理耗时'
    })
    this.chartData.rows.push({
      '耗时': sourceRequestTime,
      '类型': '请求资源'
    })
    this.chartSettings.totalNum = interactionTime
    let units = {
      wxBodyRatio: '%',
      wxBundleSize: 'kb'
    }
    for (let propertie in this.reportData.properties) {
      if (propertie === 'wxBizID' || propertie === 'wxBundleUrl') {
        continue
      }
      this.performanceTableData.items.push({
        name: propertie,
        value: this.reportData.properties[propertie] + (units[propertie] || ''),
        description: '-'
      })
    }
    for (let stat in this.reportData.stats) {
      this.performanceTableData.items.push({
        name: stat,
        value: this.reportData.stats[stat] + (units[stat] || ''),
        description: '-'
      })
    }
    for (let item in this.reportData.stage) {
      this.performanceTableData.items.push({
        name: item,
        value: this.reportData.stage[item]
      })
    }
    if (this.reportData.wxinteraction) {
      this.renderTypes = [{
        text: '所有',
        value: 'all'
      }]
      this.defaultRenderType = {
        text: '所有',
        value: 'all'
      }
      let len = this.reportData.wxinteraction.length
      let types = []
      for (let index = 0; index < len; index ++) {
        if (index === 0) {
          this.reportData.wxinteraction[index].diff = 0
        } else {
          this.reportData.wxinteraction[index].diff = this.reportData.wxinteraction[index].renderOriginDiffTime - this.reportData.wxinteraction[index - 1].renderOriginDiffTime
        }
        if (types.indexOf(this.reportData.wxinteraction[index].type) < 0) {
          types.push(this.reportData.wxinteraction[index].type)
        }
      }
      this.renderTypes = this.renderTypes.concat(types.map((type) => {
        return {
          text: type,
          value: type
        }
      }))
    }

    // Output score
    let performanceScoreData = [
      {
        label: '加载性能',
        values: {
          JSTemplateSize: this.reportData.stats.wxBundleSize,
          JSDataPrefetch: this.reportData.properties.wxJSDataPrefetchSuccess,
          sourceRequestTime: sourceRequestTime
        }
      },
      {
        label: '渲染性能',
        values: {
          interactionTime: interactionTime,
          wxScrollerCount: this.reportData.stats.wxScrollerCount,
          wxCellExceedNum: this.reportData.stats.wxCellExceedNum,
          wxMaxDeepVDomLayer: this.reportData.stats.wxMaxDeepVDomLayer,
          wxEmbedCount: this.reportData.stats.wxEmbedCount
        }
      },
      {
        label: '内存占用',
        values: {
          wxWrongImgSizeCount: this.reportData.stats.wxWrongImgSizeCount,
          wxLargeImgMaxCount: this.reportData.stats.wxLargeImgMaxCount,
          wxImgUnRecycleCount: this.reportData.stats.wxImgUnRecycleCount,
          wxCellUnReUseCount: this.reportData.stats.wxCellUnReUseCount,
          wxCellDataUnRecycleCount: this.reportData.stats.wxCellDataUnRecycleCount,
          wxMaxComponentCount: this.reportData.stats.wxMaxComponentCount
        }
      }
    ]

    this.pageScoreTableData = this.generateScoreData(performanceScoreData, this.performanceScoreTextMap, this.performanceScoreSeed)
  }

  initWebSocket () {
    this.connection()
  }

  connection () {
    this.socket = new SockJS(`ws://${this.webSocketHost}/debugProxy/debugger/${this.channelId}`)
    this.socket.on('connect', (data) => {
      this.socket.send(JSON.stringify({ method: 'Page.stopScreencast' }))
    })
    this.socket.on('data', (data) => {
      data = JSON.parse(data)
      const method = data.method
      let dataCopy: any = {}
      if (method === 'WxDebug.sendPerformanceData') {
        this.$snotify.clear()
        this.endRecordTime = (new Date()).getTime()
        for (let key in data.params) {
          if (this.process.queues.indexOf(key) === -1) {
            this.process.values.push({ id: key, value: 0 })
            this.process.queues.push(key)
            this.completeCounter[key] = {
              count: 1,
              value: data.params[key].length
            }
          } else if (this.completeCounter[key]) {
            if (this.completeCounter[key].value === data.params[key].length) {
              this.completeCounter[key].count ++
            } else {
              this.completeCounter[key].count = 1
              this.completeCounter[key].value = data.params[key].length
            }
          }
          if (this.completeCounter[key] && this.completeCounter[key].count >= 3) {
            for (let item in this.process.values) {
              if (this.process.values[item].id === key) {
                delete this.process.values[item]
              }
            }
            this.process.queues.splice(this.process.queues.indexOf(key), 1)
            delete this.completeCounter[key]
          }
        }
        for (let item in data.params) {
          let instanceID = item
          dataCopy[instanceID] = []
          for (let index = 0; index < data.params[item].length; index ++) {
            if (!dataCopy[instanceID][data.params[item][index].type]) {
              dataCopy[instanceID][data.params[item][index].type] = []
            }
            dataCopy[instanceID][data.params[item][index].type].push(data.params[item][index]['data'])
          }
          for (let type in dataCopy[instanceID]) {
            dataCopy[instanceID][type] = this.parser.unique(dataCopy[instanceID][type])
          }
        }
        dataCopy = this.parser.mergeApmData(dataCopy)
        let keys = Object.keys(dataCopy)
        if (keys.length === 1 && !dataCopy[keys[0]].properties.wxBizID) {
          this.$snotify.warning('无法获取到页面ID，请退出页面重新捕获')
          return
        }
        keys = keys.filter((key) => {
          if (!dataCopy[key].properties.wxBizID) {
            delete dataCopy[key]
            return false
          }
          return true
        })
        this.activeId = keys[keys.length - 1]
        this.reportData = dataCopy[this.activeId]
        if (this.activeId && this.reportData) {
          this.initData()
          this.$snotify.success('初始化图表数据成功')
        } else {
          this.$snotify.warning('没有捕获到有效数据')
        }
        this.updateApmData({ value: dataCopy, time: this.endRecordTime - this.startRecordTime, device: this.deviceInfo })
      } else if (method === 'WxDebug.pushDebuggerInfo') {
        this.deviceInfo = data.params.device
      }
    })

    this.socket.on('close', (data) => {
      this.$snotify.info('断开链接...')
      this.$router.replace({ path: '/' })
    })

    this.socket.on('error', (data) => {
      this.$snotify.error(data)
      this.$router.replace({ path: '/' })
    })
  }

  handleCaptureTimesChange (value) {
    this.updateDefaultCapture(value)
  }

  handleHistoryChange (value) {
    this.updateDefaultHistory(value)
  }

  handleFilterTypeChange (value) {
    this.defaultRenderType = value
  }

  activeHistory (history) {
    this.reportData = history.data
    this.activeId = history.key
    this.initData()
  }

  handleSetting () {
    this.reportData = ''
    this.activeId = ''
  }

  startAnalyze () {
    if (!this.start) {
      this.start = true
      this.activeId = ''
      this.reportData = ''
      this.$snotify.async('捕获数据中...', () => new Promise((resolve, reject) => {}))
      if (this.reload) {
        this.socket.send(JSON.stringify({ method: 'WxDebug.reload' }))
      }
      if (this.capture) {
        this.progressMaxValue = + this.defaultCapture
        this.captureTimer = setInterval(() => {
          this.progressValue += 1000
          if (this.progressValue === this.progressMaxValue) {
            this.socket.send(JSON.stringify({ method: 'WxDebug.refreshPerformanceData', params: { value: true } }))
            this.socket.send(JSON.stringify({ method: 'WxDebug.enablePerformanceMonitor', params: { value: false } }))
            this.start = false
            this.progressValue = 0
            clearInterval(this.captureTimer)
          }
        }, 1000)
      }
      this.startRecordTime = (new Date()).getTime()
      this.socket.send(JSON.stringify({ method: 'WxDebug.enablePerformanceMonitor', params: { value: true } }))
    } else {
      if (this.captureTimer) {
        clearInterval(this.captureTimer)
      }
      this.socket.send(JSON.stringify({ method: 'WxDebug.refreshPerformanceData', params: { value: true } }))
      this.socket.send(JSON.stringify({ method: 'WxDebug.enablePerformanceMonitor', params: { value: false } }))
      this.start = false
    }
    // this.$snotify.info('正在开发中...')

  }

  clearHistory (activeId) {
    let historys = [].concat(this.historys)
    if (activeId) {
      historys = historys.filter((hisotry) => {
        return hisotry.key !== activeId
      })
      this.updateHistorys(historys)
      if (historys.length > 0) {
        this.activeId = historys[0].key
      } else {
        this.activeId = ''
      }
    } else {
      this.updateHistorys([])
      this.activeId = ''
      this.reportData = ''
    }
  }

  showDetail (type, value) {
    if (type) {
      this.treeViewerOptions.rootObjectKey = type
    }
    this.detailMessage = value
    this.modalShow = true
  }

  generateScoreData (raw, map, scoreMap) {
    let len = raw.length
    let data = []
    let scoreSum = 100
    for (let index = 0; index < len; index++) {
      let label = raw[index].label
      let values = []
      for (let item in raw[index].values) {
        let range
        let score
        if (scoreMap[item].type === 'number') {
          range = `0 ~ ${scoreMap[item].range}`
          if (raw[index].values[item] > scoreMap[item].range) {
            score = Math.ceil((raw[index].values[item] - scoreMap[item].range) / scoreMap[item].step) * scoreMap[item].stepScore
            if (score > 0 && score > scoreMap[item].maxScore) {
              score = scoreMap[item].maxScore
            } else if (score < 0 && score < -scoreMap[item].maxScore) {
              score = - scoreMap[item].maxScore
            }
          } else {
            score = 0
          }
        } else {
          range = scoreMap[item].range
          if (raw[index].values[item]) {
            score = scoreMap[item].stepScore
          } else {
            score = 0
          }
        }
        scoreSum += score
        values.push({
          name: map[item] && map[item].name || '',
          value: raw[index].values[item],
          score: score,
          range: range,
          key: item,
          tip: map[item] && map[item].tips || ''
        })
      }
      data.push({
        label: label,
        values: values
      })
    }
    if (scoreSum > 100) {
      scoreSum = 100
    }
    return {
      data: data,
      score: scoreSum
    }
  }

  copyText (message) {
    this.$copyText(message).then(() => {})
  }

  tirggerFile (event) {
    const files = event.target.files
    if (files && files.length > 0 && files[0].size > 0) {
      let file = files[0]
      let reader = new FileReader()
      let fileReader: any = FileReader
      reader.onloadend = (evt: any) => {
        if (evt.target.readyState === fileReader.DONE) {
          let result = JSON.parse(evt.target.result)
          let historys = [].concat(this.historys)
          let historyLen = historys.length
          let replace = false
          for (let i = 0; i < historyLen; i++) {
            if (historys[i].key === result.key) {
              replace = true
              historys[i] = result
              break
            }
          }
          if (!replace) {
            historys.unshift(result)
          }
          this.reportData = result.data
          this.activeId = result.key
          this.updateHistorys(historys)
          this.initData()
        }
      }
      reader.readAsText(file, 'utf-8')
    }
  }
}
