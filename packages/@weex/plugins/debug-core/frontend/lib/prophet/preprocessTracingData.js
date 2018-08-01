
function preprocessTracingData (nativeTracingData) {
  if (!Array.isArray(nativeTracingData)) {
    return {};
  }

  /**
   * sort by ts
   * sort by traceId if having the same ts
   */
  nativeTracingData.sort(function (a, b) {
    if (a.ts === b.ts) {
      return a.traceId - b.traceId;
    } else {
      return a.ts - b.ts;
    }
  });

  var tracingData = {};

  // convert the first ts to 0
  var startTime;
  if (nativeTracingData.length > 0) {
    startTime = nativeTracingData[0].ts;
  }

  var processedTracingData = [];

  for (var i = 0, len = nativeTracingData.length; i < len; i++) {
    var traceItem = nativeTracingData[i];

    // ignore 'createInstance' in iOS
    if (traceItem.fName === 'createInstance') {
      continue;
    }

    // ignore 'downloadBundleJS' or 'renderWithURL' when loading bundleJS from cache
    if ((traceItem.fName === 'downloadBundleJS' || traceItem.fName === 'renderWithURL') && traceItem.duration == 0) {
      continue;
    }

    /**
     * process 'executeBundleJS' in Android and 'renderWithMainBundleString' in iOS
     * startTime is equal to endTime of 'downloadBundleJS'
     * endTime is equal to startTime of 'createBody'
     */
    if (traceItem.fName === 'executeBundleJS' || traceItem.fName === 'renderWithMainBundleString') {
      for (var j = 0; j < len; j++) {
        tmpTraceItem = nativeTracingData[j];
        if ((tmpTraceItem.fName === 'downloadBundleJS' || tmpTraceItem.fName === 'renderWithURL') && tmpTraceItem.ph !== 'E' && tmpTraceItem.duration > 0) {
          traceItem.ts = tmpTraceItem.ts + tmpTraceItem.duration;
        }
        if (tmpTraceItem.fName === 'createBody' && tmpTraceItem.tName === 'JSThread' && tmpTraceItem.ph !== 'E') {
          traceItem.duration = tmpTraceItem.ts - traceItem.ts;
          traceItem.tName = 'JSThread';
        }
      }
    }

    traceItem.startTime = traceItem.ts - startTime;
    traceItem.endTime = traceItem.startTime + traceItem.duration;
    traceItem.showChildren = false;

    var processedIndex;
    
    // ignore 'E' and 'i' in iOS
    if ((traceItem.ph !== 'E' && traceItem.ph !== 'i') || traceItem.fName === 'renderFinish') {
      processedTracingData.push(traceItem);
      processedIndex = processedTracingData.length - 1;
    } else {
      continue;
    }

    for (var j = 0, processedLength = processedTracingData.length; j < processedLength; j++) {
      var parentTraceItem = processedTracingData[j];
      if (traceItem.parentId === parentTraceItem.traceId) {
        if (parentTraceItem.tName === 'JSThread') {

          // construct a new traceItem which contains related traceItems of JSThread, DOMThread and UIThread
          if (!parentTraceItem.children) {
            var tmpObj = {};
            for (var key in parentTraceItem) {
              if (parentTraceItem.hasOwnProperty(key)) {
                tmpObj[key] = parentTraceItem[key];
              }
            }
            tmpObj.fName = 'JSExecute';
            tmpObj.name = '';
            tmpObj.parentId = parentTraceItem.traceId;
            processedTracingData.push(tmpObj);
            parentTraceItem.children = [];
            parentTraceItem.children.push(processedTracingData.length - 1);
            parentTraceItem.JSBridgeStartTime = tmpObj.startTime;
            parentTraceItem.JSBridgeEndTime = tmpObj.endTime;
          }
          parentTraceItem.children.push(processedIndex);
          parentTraceItem.endTime = Math.max(parentTraceItem.endTime, traceItem.endTime);
          if (!parentTraceItem.name && traceItem.name) {
            parentTraceItem.name = traceItem.name;
          }

          // calculate the startTime and endTime of every thread
          if (traceItem.tName === 'DOMThread') {
            if (!parentTraceItem.DOMThreadStartTime) {
              parentTraceItem.DOMThreadStartTime = traceItem.startTime;
              parentTraceItem.DOMThreadEndTime = traceItem.endTime;
            } else {
              parentTraceItem.DOMThreadEndTime = Math.max(parentTraceItem.DOMThreadEndTime, traceItem.endTime);
            }
          }
          if (traceItem.tName === 'UIThread') {
            if (!parentTraceItem.UIThreadStartTime) {
              parentTraceItem.UIThreadStartTime = traceItem.startTime;
              parentTraceItem.UIThreadEndTime = traceItem.endTime;
            } else {
              parentTraceItem.UIThreadEndTime = Math.max(parentTraceItem.UIThreadEndTime, traceItem.endTime);
            }
          }
        } else {

          // relate traceItem with its parent traceItem
          if (!parentTraceItem.children) {
            parentTraceItem.children = [];
          }
          parentTraceItem.children.push(i);
          parentTraceItem.endTime = Math.max(parentTraceItem.endTime, traceItem.endTime);
        }
        break;
      }
    }
  }

  var lastTimePoint = 0;
  tracingData.timePoint = [];
  tracingData.info = {};
  tracingData.info.totalEndTime = 0;

  for (var i = 0, len = processedTracingData.length; i < len; i++) {
    var traceItem = processedTracingData[i];
    tracingData.info.totalEndTime = Math.max(tracingData.info.totalEndTime, traceItem.endTime);
    if (traceItem.fName === 'renderFinish') {
      tracingData.info.renderFinishTime = traceItem.endTime;
    }
    
    // clear the tName of traceItems which contains child traceItems in different threads
    if (traceItem.tName === 'JSThread' && traceItem.children) {
      traceItem.tName = '';
    }

    // functionName offers information in the sidebar
    traceItem.functionName = traceItem.fName;
    if (traceItem.name) {
      traceItem.functionName += ' - ' + traceItem.name;
    }
    if (traceItem.tName === 'DOMThread') {
      traceItem.functionName += ' - ' + 'dom';
    }
    if (traceItem.tName === 'UIThread') {
      traceItem.functionName += ' - ' + 'ui';
    }

    // info offers the detailed information of traceItem
    traceItem.info = [];
    if (traceItem.fName) {
      traceItem.info.push({
        name: 'Method: ',
        content: traceItem.fName
      });
    }
    if (traceItem.tName) {
      traceItem.info.push({
        name: 'Thread: ',
        content: traceItem.tName
      })
    }
    if (traceItem.iid) {
      traceItem.info.push({
        name: 'Instance id: ',
        content: traceItem.iid
      })
    }
    if (traceItem.name) {
      traceItem.info.push({
        name: 'Component / Module: ',
        content: traceItem.name
      })
    }
    if (traceItem.className) {
      traceItem.info.push({
        name: 'Class name: ',
        content: traceItem.className
      })
    }
    traceItem.info.push({
      name: 'Total time: ',
      content: (traceItem.endTime - traceItem.startTime).toFixed(2) + 'ms'
    })

    if (traceItem.JSBridgeStartTime) {
      traceItem.info.push({
        name: 'JSThread time: ',
        content: (traceItem.JSBridgeEndTime - traceItem.JSBridgeStartTime).toFixed(2) + 'ms'
      })
    }

    if (traceItem.DOMThreadStartTime) {
      traceItem.info.push({
        name: 'DOM thread time: ',
        content: (traceItem.DOMThreadEndTime - traceItem.DOMThreadStartTime).toFixed(2) + 'ms'
      })
    }

    if (traceItem.UIThreadStartTime) {
      traceItem.info.push({
        name: 'UI thread time: ',
        content: (traceItem.UIThreadEndTime - traceItem.UIThreadStartTime).toFixed(2) + 'ms'
      })
    }

    // calculate the key point in time
    if (traceItem.fName === 'downloadBundleJS' || traceItem.fName === 'renderWithURL') {
      tracingData.timePoint.push({
        endTime: traceItem.endTime,
        startTime: lastTimePoint,
        totalTime: traceItem.endTime - lastTimePoint,
        shortDesc: (traceItem.endTime - lastTimePoint).toFixed(2) + 'ms',
        desc: 'Network - download bundlejs - ' + (traceItem.endTime - lastTimePoint).toFixed(2) + 'ms',
        name: 'Download bundlejs'
      })
      lastTimePoint = traceItem.endTime;
    }
    if (traceItem.fName === 'executeBundleJS' || traceItem.fName === 'renderWithMainBundleString') {
      tracingData.timePoint.push({
        endTime: traceItem.endTime,
        startTime: lastTimePoint,
        totalTime: traceItem.endTime - lastTimePoint,
        shortDesc: (traceItem.endTime - lastTimePoint).toFixed(2) + 'ms',
        desc: 'JSThread - execute bundlejs - ' + (traceItem.endTime - lastTimePoint).toFixed(2) + 'ms',
        name: 'Execute bundlejs'
      })
      lastTimePoint = traceItem.endTime;
    }
    if (traceItem.fName === 'renderFinish') {
      tracingData.timePoint.push({
        endTime: traceItem.endTime,
        startTime: lastTimePoint,
        totalTime: traceItem.endTime - lastTimePoint,
        shortDesc: (traceItem.endTime - lastTimePoint).toFixed(2) + 'ms',
        desc: 'Native - render time - ' + (traceItem.endTime - lastTimePoint).toFixed(2) + 'ms',
        name: 'Native render'
      })
      lastTimePoint = traceItem.endTime;
    }
  }

  tracingData.threadbar = ["DOMThread", "UIThread"];
  tracingData.colors = {
    JSThread: '#FFE082',
    DOMThread: '#A5D6A7',
    UIThread: '#90CAF9'
  };

  tracingData.data = processedTracingData;

  return tracingData;
}

function preprocessSummaryInfo(summaryInfo) {
  var globalInfo = [];
  var warningInfo = [];

  if (summaryInfo) {
    if (summaryInfo.networkTime) {
      globalInfo.push({
        name: 'networkTime',
        content: summaryInfo.networkTime + ' ms'
      })
      if (summaryInfo.networkTime > 800) {
        warningInfo.push({
          name: 'networkTime',
          content: '> 800 ms'
        })
      }
    }
    if (summaryInfo.screenRenderTime) {
      globalInfo.push({
        name: 'screenRenderTime',
        content: summaryInfo.screenRenderTime + ' ms'
      })
      if (summaryInfo.screenRenderTime > 800) {
        warningInfo.push({
          name: 'screenRenderTime',
          content: '> 800 ms'
        })
      }
    }
    if (summaryInfo.totalTime) {
      globalInfo.push({
        name: 'totalTime',
        content: summaryInfo.totalTime + ' ms'
      })
      if (summaryInfo.totalTime > 3000) {
        warningInfo.push({
          name: 'totalTime',
          content: '> 3000 ms'
        })
      }
    }
    if (summaryInfo.JSTemplateSize) {
      var JSTemplateSize = summaryInfo.JSTemplateSize;
      if (summaryInfo.platform === 'iOS') {
        JSTemplateSize = JSTemplateSize / 1024;
      }
      globalInfo.push({
        name: 'JSTemplateSize',
        content: JSTemplateSize.toFixed(2) + ' KB'
      })
      if (JSTemplateSize > 250) {
        warningInfo.push({
          name: 'JSTemplateSize',
          content: '> 250 KB'
        })
      }
    }
    if (summaryInfo.maxDeepViewLayer) {
      globalInfo.push({
        name: 'maxDeepViewLayer',
        content: summaryInfo.maxDeepViewLayer
      })
      if (summaryInfo.maxDeepViewLayer > 15) {
        warningInfo.push({
          name: 'maxDeepViewLayer',
          content: '> 15'
        })
      }
    }
    if (summaryInfo.componentCount) {
      globalInfo.push({
        name: 'componentCount',
        content: summaryInfo.componentCount
      })
    }
  }

  var newSummaryInfo = {
    globalInfo: globalInfo,
    warningInfo: warningInfo
  }

  return newSummaryInfo;
}