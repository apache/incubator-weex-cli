export const cn = {
  title: 'Weex 真机调试工具',
  navbar: {
    help: '帮助',
    environmentSetting: '环境设置',
    bundlesToggle: '页面'
  },
  home: {
    languageTitle: 'Languages',
    welcomMessage: '欢迎使用 Weex 调试工具',
    tabs: {
      debugName: '调试',
      pageName: '页面'
    },
    tips: {
      quickStartTitle: '快速使用',
      quickStartDesc: '快速了解如何在你的开发中使用 weex 调试工具',
      quickStartUrl: 'http://weex.apache.org/zh/tools/toolkit.html#debug',
      guideTitle: '使用教程',
      guideDesc: '详细介绍各个功能的使用说明',
      guideUrl: 'https://weex.apache.org/zh/guide/debug/debug.html',
      integerTitle: '集成 Weex Devtool 到你的应用',
      integerDesc: '了解如何在你的应用中集成 Weex Devtool SDK',
      integerUrl: 'https://weex.apache.org/zh/guide/debug/integrate-devtool-to-android.html',
      helpTitle: '帮助和意见反馈',
      helpDesc: '提交Github issue 和帮助提高 Weex Devtool',
      helpUrl: 'https://github.com/weexteam/weex-toolkit/issues/new?labels=@weex-cli/debug',
      noJsBundle: '暂无可预览页面，你可以通过下面的命令进行页面编译'
    },
    toastTips: {
      copySuccess: '复制成功',
      openPage: '打开页面'
    },
    version: '当前版本'
  },
  defaultPage: {
    title: '性能面板',
    pageDescription: '页面正在施工中...'
  },
  weexDebugPage: {
    title: 'Weex 调试',
    appInfo: '应用信息',
    sdkVersion: 'SDK版本',
    jsDebug: 'JS调试',
    network: '网络审查',
    logLevel: '日志等级',
    elementMode: '切换视图',
    clearHistory: '清空历史',
    workerJsDesc: 'WorkerJS为调试中间文件，文件开头为[Runtime]-的文件',
    jsServiceDesc: 'JSService是weex在运行中使用<a href="http://weex.apache.org/cn/references/js-service.html" target="_blank">JSService接口</a>注入的JS文件，多个文件用逗号隔开',
    dependenceJsDesc: 'DependenceJS是weex在创建实例前在JS环境中注入的JS文件',
    jsFrameworkDesc: 'JSFramework是为weex运行提供初始环境的JS',
    environmentSettingOkDesc: '更改设置',
    environmentSettingCancelDesc: '重置',
    reloadDesc: '刷新',
    restoreDesc: '恢复',
    mockTips: 'mock 文件',
    generatorFile: '生成文件',
    environmentSetting: '环境设置',
    generatingFile: '生成文件中',
    generateFile: '生成文件',
    reloadSuccess: '刷新成功',
    reloading: '刷新页面中',
    ensureDeleteHistory: '确定删除历史记录？',
    changeEnvSetting: '更改环境配置',
    changeSettingSuccess: '更改成功',
    noEmptyUrl: '页面URL不能为空',
    loadingTip: '加载中',
    loadingSuccess: '加载成功'

  },
  sideBar: {
    weex: {
      title: 'WEEX 调试'
    },
    analyze: {
      title: '性能面板'
    }
  },
  tour: {
    step_1: '点击这里可以控制<strong>JS Debug</strong>开关，开启后即可开始JS调试!',
    step_2: '点击这里可以选择Log日志等级',
    step_3: '进入调试页面后点击这里可以刷新Weex页面',
    step_4: '在这里可以输入你本地想访问的JSBundle文件，回车键跳转',
    step_5: '点击这里可以针对Weex运行环境进行配置',
    step_6: '点击这里可以对文件进行Mock替换',
    step_7: '点击这里可以让环境配置生效',
    step_8: '点击这里重置环境',
    nextText: '下一个',
    prevText: '上一个',
    finishText: '完成',
    skip: '跳过'
  }
}
