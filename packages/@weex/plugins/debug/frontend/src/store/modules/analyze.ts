import { Commit } from 'vuex'
import * as types from '../mutation-types'

export interface ApmData {
  [key: string]: any
}

export interface State {
  captures: any[]
  historys: any[]
  defaultCapture: any
  defaultHistory: any
  reloadToggle: boolean
  compareToggle: boolean
  captureToggle: boolean
  apmData: ApmData,
  performanceMode: any,
  performanceScoreSeed: any,
  performanceScoreTextMap: any
}

const state: State = {
  captures: [
    '5000',
    '8000',
    '10000'
  ],
  historys: [],
  defaultCapture: 5000,
  defaultHistory: '',
  reloadToggle: true,
  compareToggle: false,
  captureToggle: false,
  apmData: {},
  performanceMode: {
    wxRequestSourceTime: 'Weex请求资源耗时',
    wxRenderBundleTime: 'Weex处理Bundle耗时',
    wxJSAsyncDataTime: '前端异步请求时间',
    wxJSDataPrefetchSuccess: '前端prefetch是否成功',
    wxInteractionTime: '可交互时间总耗时',
    wxRequestType: {
      text: '请求类型, 2g/3g/4g/wifi/zcache/weex_cache/other',
      tips: ['纯网络 2g、3g、4g、wifi', 'zcache', 'weex_cache']
    },
    wxBizID: '完整的业务ID',
    wxBundleType: {
      text: 'JS框架语言',
      tips: ['主要为Vue, Rax, 也支持三方定制框架']
    },
    wxInstanceType: {
      text: '实例类型',
      tips: ['page - 普通weex页面', 'embed - weex模块']
    },
    wxContainerInfo: {
      text: '运行容器名称',
      tips: [
        '一个容器可能会对应多个页面'
      ]
    },
    parentPage: {
      text: 'Embed组件父级页面',
      tips: [
        '只有Embed页面内会报，Embed所在page的url'
      ]
    },
    wxBundleSize: {
      text: '页面Bundle大小',
      tips: [
        '拖慢资源请求耗时',
        '减少Bundle大小'
      ]
    },
    wxActualNetworkTime: '网络库打点的网络下载耗时',
    wxInteractionComponentCreateTime: {
      text: '可交互时间内，总共创建component耗时',
      tips: ['调整渲染时序，屏幕外的组件会延后屏幕内的渲染时间']
    },
    wxInteractionComponentCreateCount: {
      text: '可交互时间内，总共创建component个数',
      tips: ['减少资源请求前预先打底的次数']
    },
    wxInteractionAllViewCount: {
      text: '可交互时间内，屏幕(instance)内外，对应渲染 view 个数',
      tips: ['减少打底view的总个数']
    },
    wxInteractionScreenViewCount: {
      text: '可交互时间内，屏幕(instance)内  渲染 view 次数',
      tips: [
        '可交互时间内，屏幕内是否需要这么多view',
        '减少不必要的屏幕内节点'
      ]
    },
    wxFSCallJsTotalTime: '首屏时间调用JS耗时',
    wxFSCallJsTotalNum: '首屏时间调用js次数',
    wxFSCallNativeTotalTime: {
      text: '首屏时间调用Native module耗时',
      tips: [
        '减少native module的调用次数（重复的，不必要的)',
        '使用devtool、analzyer排查纤细信息'
      ]
    },
    wxFSCallNativeTotalNum: '首屏时间调用Native次数',
    wxFSCallEventTotalTime: '首屏时间调用CallEven耗时',
    wxFSCallEventTotalNum: '首屏时间调用CallEven耗时次数',
    wxFSRequestNum: '首屏调用Timer次数',
    wxFSTimerCount: '首屏Tmer调用耗时',
    memdiff: '进入退出内存水位变化',
    wxLargeImgMaxCount: {
      text: '大图个数（最多那次)',
      tips: ['图片大小>1080*720', '减少大图的投放，内存占用大头']
    },
    wxWrongImgSizeCount: {
      text: '图片和view大小不匹配个数',
      tips: ['投放的图片尺寸大于实际view的的大小，建议图片进行裁剪，减少不必要的内存占用', '使用analyzer或者dev-tool有详细的url和尺寸提示']
    },
    wxImgUnRecycleCount: {
      text: '未开启图片自动回收imgview的个数',
      tips: ['imageview没有开启图片自动回收机制，内存非常容易oom']
    },
    wxCellDataUnRecycleCount: {
      text: '内容不回收的cell组件个数',
      tips: ['最好开启cell上数据的回收，不然内存会爆掉']
    },
    wxCellViewUnReUseCount: {
      text: '没有开启复用cell的个数',
      tips: ['没有开启cell的复用机制，大列表内存会爆炸']
    },
    wxScrollerCount: {
      text: '使用scroller个数',
      tips: ['scroller是没有view回收机制的，长列表内存容易oom','使用ListView、recycleView替代']
    },
    wxEmbedCount: {
      text: 'embed 模块个数',
      tips: ['embed不建议太多(3个)']
    },
    wxCellExceedNum: {
      text: '超大cell个数',
      tips: ['width >= screenWidth/2 && height >= screenHeight/2']
    },
    fps: {
      text: '进入退出 平均fps',
      tips: ['apm 提供']
    },
    wxMaxDeepVDomLayer: {
      text: 'Dom结点最大层级',
      tips: ['dom树的最大层级，不建议超过15层，会给渲染造成很大压力，并且在Android设备上容易crash']
    },
    wxMaxComponentCount: {
      text: '组件个数（最多那次)',
      tips: ['持有组件个数峰值，在布局时layout造成很大压力，对fps和可交互时间都有很大影响','和wxMaxDeepVDomLayer一起，是影响渲染速度的两大因素','减少不必要的节点数']
    },
    wxMaxDeepViewLayer: {
      text: 'view最大层级',
      tips: ['同dom结点最大层级，在设备上实际渲染的view最大层级']
    },
    wxTimerInBackCount: '后台执行Timer次数',
    wxImgLoadCount: '所有图片加载数',
    wxImgLoadSuccessCount: '成功加载的图片数',
    wxImgLoadFailCount: 'weex提供',
    wxNetworkRequestCount: 'weex提供',
    wxNetworkRequestSuccessCount: 'weex提供',
    wxNetworkRequestFailCoun: 'weex提供',
    imgLoadCount: 'apm提供',
    imgLoadSuccessCount: 'apm提供',
    imgLoadFailCount: 'apm提供',
    networkRequestCount: 'apm提供',
    networkRequestSuccessCount: 'apm提供',
    networkRequestFailCount: 'apm提供',
    wxRecordStart: '埋点开始记录时间',
    wxStartDownLoadBundle: '开始下载Bundle时间',
    wxEndDownLoadBundle: '下载Bundle结束时间',
    wxRenderTimeOrigin: '开始渲染时间点',
    wxStartLoadBundle: '加载解析业务Bundle时间点',
    wxEndLoadBundle: '加载解析业务Bundle完成时间点',
    wxFsRender: '旧首屏时间点',
    wxNewFsRender: '新首屏时间点',
    wxFirstInteractionView: '屏幕内第一个View出现的时间点',
    wxInteraction: '可交互时间点',
    wxJSAsyncDataStart: '前端异步请求开始时间点',
    wxJSAsyncDataEnd: '前端异步请求结束时间点',
    wxJSLibVersion: 'JSFramework版本',
    wxContainerName: '运行容器名称',
    wxZCacheInfo: 'ZCache信息',
    wxErrorCode: {
      text: 'Weex错误代码',
      tips: [
        '查看文档：<a href="https://yuque.antfin-inc.com/weex/weexrobust/yrp25x" target="_blank">WEEX异常码含义</a>'
      ]
    },
    wxSDKVersion: 'Weex SDK版本',
    wxDestroy: '页面销毁时间点',
    wxBodyRatio: {
      text: 'weex页面的屏占百分比，[0-100]',
      tips: ['用来区分是否是card类型的页面, < 60%为card类型']
    }
  },
  performanceScoreSeed: {
    JSTemplateSize: {
      type: 'number',
      range: 250,
      step: 20,
      stepScore: -1,
      maxScore: 20
    },
    JSDataPrefetch: {
      type: 'boolean',
      range: 'true',
      stepScore: 5,
      maxScore: 5
    },
    sourceRequestTime: {
      type: 'number',
      range: 100,
      step: 50,
      stepScore: -6,
      maxScore: 12
    },
    interactionTime: {
      type: 'number',
      range: 1000,
      step: 50,
      stepScore: -6,
      maxScore: 30
    },
    wxScrollerCount: {
      type: 'number',
      range: 1,
      step: 1,
      stepScore: -1,
      maxScore: 5
    },
    wxCellExceedNum: {
      type: 'number',
      range: 1,
      step: 1,
      stepScore: -1,
      maxScore: 5
    },
    wxMaxDeepVDomLayer: {
      type: 'number',
      range: 15,
      step: 1,
      stepScore: -2,
      maxScore: 10
    },
    wxWrongImgSizeCount: {
      type: 'number',
      range: 0,
      step: 1,
      stepScore: -3,
      maxScore: 15
    },
    wxEmbedCount: {
      type: 'number',
      range: 3,
      step: 1,
      stepScore: -3,
      maxScore: 15
    },
    wxLargeImgMaxCount: {
      type: 'number',
      range: 0,
      step: 1,
      stepScore: -2,
      maxScore: 10
    },
    wxImgUnRecycleCount: {
      type: 'number',
      range: 0,
      step: 1,
      stepScore: -2,
      maxScore: 10
    },
    wxCellUnReUseCount: {
      type: 'number',
      range: 0,
      step: 1,
      stepScore: -2,
      maxScore: 10
    },
    wxCellDataUnRecycleCount: {
      type: 'number',
      range: 0,
      step: 1,
      stepScore: -2,
      maxScore: 10
    },
    wxMaxComponentCount: {
      type: 'number',
      range: 100,
      step: 20,
      stepScore: -1,
      maxScore: 10
    }
  },
  performanceScoreTextMap: {
    JSTemplateSize: {
      name: '渲染JSBundle大小 (wxBundleSize)',
      tips: ['查看文档：<a href="http://mwpo.taobao.net/native-render/bundlesize.html" target="_blank">减少 bundleSize 大小</a>']
    },
    JSDataPrefetch: {
      name: '业务JSBundle是否预加载 (wxJSDataPrefetchSuccess)',
      tips: ['查看文档：<a href="http://h5.alibaba-inc.com/awp/StartPackageApp.html" target="_blank">使用预加载</a>']
    },
    sourceRequestTime: {
      name: '请求资源耗时',
      tips: ['暂无']
    },
    interactionTime: {
      name: '可交互时间',
      tips: ['暂无']
    },
    wxScrollerCount: {
      name: '使用scroller个数 （wxScrollerCount）',
      tips: ['scroller是没有view回收机制的，长列表内存容易oom', '使用ListView、recycleView替代']
    },
    wxCellExceedNum: {
      name: '超大cell个数 （wxCellExceedNum）',
      tips: ['超大cell一般指宽高均大于屏幕宽高1/2的cell，需控制数量']
    },
    wxMaxDeepVDomLayer: {
      name: 'View最大层级 （wxMaxDeepVDomLayer）',
      tips: ['同dom结点最大层级，在设备上实际渲染的view最大层级']
    },
    wxWrongImgSizeCount: {
      name: '图片和view大小不匹配个数 （wxWrongImgSizeCount）',
      tips: ['投放的图片尺寸大于实际view的的大小，建议图片进行裁剪，减少不必要的内存占用', '使用analyzer或者devtool有详细的url和尺寸提示']
    },
    wxEmbedCount: {
      name: 'Embed 模块个数 （wxEmbedCount）',
      tips: ['Embed不建议太多(3个)']
    },
    wxLargeImgMaxCount: {
      name: '大图个数 （wxLargeImgMaxCount）',
      tips: ['大图一般指图片大小>1080*720','减少大图的投放，能有效降低应用内存占用']
    },
    wxImgUnRecycleCount: {
      name: '未开启图片自动回收imgview的个数 （wxImgUnRecycleCount）',
      tips: ['Imageview没有开启图片自动回收机制，内存非常容易oom']
    },
    wxCellUnReUseCount: {
      name: '没有开启复用cell的个数 （wxCellUnReUseCount）',
      tips: ['暂无']
    },
    wxCellDataUnRecycleCount: {
      name: '内容不回收的cell组件个数 （wxCellDataUnRecycleCount）',
      tips: ['暂无']
    },
    wxMaxComponentCount: {
      name: '组件个数（wxMaxComponentCount）',
      tips: [
        '持有组件个数峰值，在布局时layout造成很大压力，对fps和可交互时间都有很大影响',
        '和wxMaxDeepVDomLayer一起，是影响渲染速度的两大因素',
        '减少不必要的节点数'
      ]
    }
  }
}

const getters = {

}

const actions = {
  updateToggle (context: { commit: Commit, state: State }, toggle: {value: boolean, name: string}) {
    context.commit(types.UPDATE_ANALYZE_TOGGLE, toggle)
  },
  updateDefaultCapture (context: { commit: Commit, state: State }, value: any) {
    context.commit(types.UPDATE_ANALYZE_DEFAULT_CAPTURE, value)
  },
  updateDefaultHistory (context: { commit: Commit, state: State }, value: any) {
    context.commit(types.UPDATE_ANALYZE_DEFAULT_HISTORY, value)
  },
  updateCaptures (context: { commit: Commit, state: State }, value: any) {
    context.commit(types.UPDATE_ANALYZE_CAPTURES, value)
  },
  updateHistorys (context: { commit: Commit, state: State }, value: any) {
    context.commit(types.UPDATE_ANALYZE_HISTORYS, value)
  },
  updateApmData (context: { commit: Commit, state: State }, value: any) {
    context.commit(types.UPDATE_ANALYZE_APMDATA, value)
  }
}

const mutations = {
  [types.UPDATE_ANALYZE_TOGGLE] (state: State, toggle: {value: boolean, name: string}) {
    state[toggle.name] = toggle.value
  },
  [types.UPDATE_ANALYZE_DEFAULT_CAPTURE] (state: State, value: any) {
    state.defaultCapture = value
  },
  [types.UPDATE_ANALYZE_DEFAULT_HISTORY] (state: State, value: any) {
    state.defaultHistory = value
  },
  [types.UPDATE_ANALYZE_HISTORYS] (state: State, value: any) {
    state.historys = value
  },
  [types.UPDATE_ANALYZE_CAPTURES] (state: State, value: any) {
    state.captures = value
  },
  [types.UPDATE_ANALYZE_APMDATA] (state: State, data: any) {
    state.apmData = data.value
    let historyLen = state.historys.length
    let replace = false
    for (let instance in data.value) {
      if (data.value[instance].properties.wxBizID) {
        console.log('Add history', data.value[instance].properties.wxBizID)
        for (let i = 0; i < historyLen; i++) {
          if (state.historys[i].key === instance) {
            replace = true
            state.historys[i] = {
              key: instance,
              value: data.value[instance].properties.wxBizID,
              data: Object.assign(data.value[instance], { device: data.device }),
              time: data.time
            }
            break
          }
        }
        if (!replace) {
          state.historys.unshift({
            key: instance,
            value: data.value[instance].properties.wxBizID,
            data: Object.assign(data.value[instance], { device: data.device }),
            time: data.time
          })
        }
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
