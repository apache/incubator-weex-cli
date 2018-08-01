var timeline = new Timeline();
var summaryPieChart;
var timeSummaryData = [];
var $analysePanel = $('.data-analyse-panel');
var $dataAnalyseNav = $('.data-analyse-tabnav');

function refreshProphetPage(nativeTracingData) {
  localNativeTracingData = copyNativeTracingData(nativeTracingData);
  var tracingData = preprocessTracingData(nativeTracingData);
  clearTimelineTip();
  timeline.setTracingData(tracingData);
  refreshSummaryPanel(tracingData);
}

function refreshProphetPageFromLocal(localData) {
  var tracingData = localData.tracingData || [];
  var summaryInfo = localData.summaryInfo || {};
  refreshProphetPage(tracingData);
  setSummaryInfo(summaryInfo);
}

function setSummaryInfo(summaryInfo) {
  localSummaryInfo = summaryInfo;
  var newSummaryInfo = preprocessSummaryInfo(summaryInfo);
  refreshSummaryInfo(newSummaryInfo);
}

function refreshSummaryPanel(tracingData) {
  refreshSummaryPieChart(tracingData);
}

function refreshSummaryPieChart(tracingData) {
  timeSummaryData = [];
  tracingData.timePoint.forEach((item) => {
    timeSummaryData.push({
      name: item.name,
      value: item.totalTime
    })
  });
  summaryPieChart.changeData(timeSummaryData);
  var geom = summaryPieChart.getGeoms()[0]; // 获取所有的图形
  var items = geom.getData(); // 获取图形对应的数据
  geom.setSelected(items[2]); // 设置选中
}

function refreshSummaryInfo(summaryInfo) {
  var globalInfo = summaryInfo.globalInfo;
  var warningInfo = summaryInfo.warningInfo;
  var summaryGlobalInfo = $('#summary-global-info');
  var htmlText = '';
  htmlText += '<div class="info-name">';
  globalInfo.forEach((item) => {
    htmlText += '<p>' + item.name + ': </p>';
  });
  htmlText += '</div>';
  htmlText += '<div class="info-content">';
  globalInfo.forEach((item) => {
    htmlText += '<p>' + item.content + '</p>';
  });
  htmlText += '</div>';
  summaryGlobalInfo.innerHTML = htmlText;
  var summaryWarningInfo = $('#summary-warning-info');
  htmlText = '';
  htmlText += '<div class="info-name">';
  warningInfo.forEach((item) => {
    htmlText += '<p>' + item.name + ': </p>';
  });
  htmlText += '</div>';
  htmlText += '<div class="info-content">';
  warningInfo.forEach((item) => {
    htmlText += '<p>' + item.content + '</p>';
  });
  htmlText += '</div>';
  summaryWarningInfo.innerHTML = htmlText;
}

function saveJsonDataToLocal() {
  var localJson = {
    tracingData: localNativeTracingData,
    summaryInfo: localSummaryInfo
  };
  var blob = new Blob([JSON.stringify(localJson, null, 2)], {
    type: 'application/json'
  });
  var link = document.createElement('a');
  link.download = "Prophet" + Date.now() + ".json";
  link.href = URL.createObjectURL(blob);
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  link.dispatchEvent(event);
}

function handleClickLoadDataBtn() {
  fileInput.click();
}

function loadJsonDatafromLocal() {
  var file = fileInput.files[0];
  var fileType = /application\/json/;
  if (file && file.type.match(fileType)) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var localData = JSON.parse(ev.target.result);
        refreshProphetPageFromLocal(localData);
      }
      catch (e) {}
    }
    reader.readAsText(file);
  }
}

function copyNativeTracingData(nativeTracingData) {
  var to = [];
  nativeTracingData.forEach((item) => {
    var tmpObj = {};
    for (var key in item) {
      if (item.hasOwnProperty(key)) {
        tmpObj[key] = item[key];
      }
    }
    to.push(tmpObj);
  })
  return to;
}

function switchDataAnalyseContent(event) {
  var target = event.target;
  var dataAnalyseContent = $('.data-analyse-content');
  for (var i = 0, len = $dataAnalyseNav.children.length; i < len; i++) {
    var dataAnalyseContentChild = dataAnalyseContent.children[i];
    var dataAnalyseNavChild = $dataAnalyseNav.children[i];
    if (target === $dataAnalyseNav.children[i]) {
      dataAnalyseNavChild.classList.add('data-analyse-tab-item-active');
      if (target.innerText === 'Summary') {
        dataAnalyseContentChild.style.display = 'flex';
      }
      else {
        dataAnalyseContentChild.style.display = 'block';
      }
    }
    else {
      dataAnalyseNavChild.classList.remove('data-analyse-tab-item-active');
      dataAnalyseContentChild.style.display = 'none';
    }
  }
}

function clearTimelineTip() {
  var tip = $('#timeline-tip');
  tip.style.display = "none";
}

function initSummaryBlock() {
  var $saveDataBtn = $('#save-data-btn');
  var $loadDataBtn = $('#load-data-btn');
  var $fileInput = $('#fileInput');

  var localNativeTracingData = [];
  var localSummaryInfo = {};

  $saveDataBtn.addEventListener('click', saveJsonDataToLocal);
  $loadDataBtn.addEventListener('click', handleClickLoadDataBtn);
  $fileInput.addEventListener('change', loadJsonDatafromLocal);
  for (var i = 0, len = $dataAnalyseNav.children.length; i < len; i++) {
    $dataAnalyseNav.children[i].addEventListener('click', switchDataAnalyseContent);
  }
  // init resizeable panel
  var resizable = new Resizable($analysePanel, {
    handles: 'n',
    draggable: false,
    css3: true,
    resize: function() {
      $analysePanel.style.width = '100%';
    }
  });
  // init summary pie
  var Stat = G2.Stat;
  summaryPieChart = new G2.Chart({
    id: 'summary-pie-chart',
    width: 400,
    height: 190
  });
  summaryPieChart.source([]);
  summaryPieChart.coord('theta', {
    radius: 0.6 // 设置饼图的大小
  });
  summaryPieChart.legend('name', {
    position: 'bottom',
    itemWrap: true,
    formatter: function (val) {
      for (var i = 0, len = timeSummaryData.length; i < len; i++) {
        var obj = timeSummaryData[i];
        if (obj.name === val) {
          return val + ' - ' + obj.value.toFixed(2) + 'ms';
        }
      }
    }
  });
  summaryPieChart.tooltip({
    title: null
  });
  summaryPieChart.intervalStack().position(Stat.summary.percent('value')).color('name')
  summaryPieChart.render();
}

websocket.on('WxDebug.sendTracingData', function (event) {
  refreshProphetPage(event.params.data);
})

websocket.on('WxDebug.sendSummaryInfo', function (event) {
  setSummaryInfo(event.params.summaryInfo);
})

initSummaryBlock ();
