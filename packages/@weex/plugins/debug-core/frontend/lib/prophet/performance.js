
var reportData = {
  userAgent: '12278902@android(6.1.0);Jsframework/0.16.0;weexSdkVersion/0.16.0.8;inspector/0.12.0;',
  generatedTime: "2018-03-12T06:18:26.558Z",
  url: "http://dotwe.org/raw/dist/5106e2948ca0866e5502be53cfb7a9cd.bundle.wx",
  averageScore: 60,
  performanceScore: 80,
  bestPracticesScore: 35,
  accessibilityScore: 55,
  JSLibInitTime: '1500 ms',
  SDKInitTime: '500 ms',
  SDKInitInvokeTime: '100 ms',
  SDKInitExecuteTime: '200 ms',
  reports: {
    securityReport: {
      displayValue: 'Security',
      description: '',
      score: 60
    },
    performanceReport: {
      displayValue: 'Performance',
      description: `These encapsulate your weex app's current performance and opportunities to improve it.`,
      score: 80,
      extends: {
        'jsbundle-issue': {
          description: `JSbundle Size Shouldn't Be Too Large`,
          helpText: 'We recommend that you control the size of your page bundle to improve overall performance',
          extendInfos: [
            {
              isSize: true,
              rawVlue: '1000',
              unit: 'kb',
              displayValue: `JSbundle size is bigger than 250kb`,
              description: 'The size of jsbundle will affect the time spent by the application on the first screen to download jsbundle, and it will also increase the time spent on jsbundle to some extent.'
            }
          ]
        },
        'first-screen-rending-issue': {
          isTime: true,
          percent: 100,
          rawVlue: '2500',
          unit: 'ms',
          description: `First Screen Rending Speed Can Be Improve`,
          helpText: `The main factors affecting page rendering time affect by create instance, loading components, callNative and callJs times and the HTTP request.`,
          extendInfos: [
            {
              isTime: true,
              percent: 66.3,
              rawVlue: '1,500',
              unit: 'ms',
              displayValue: `Create instance on first screen costs should below 1,000ms.`,
              description: 'Create too much instance will affect the time spent by the application on the first screen.'
            },
            {
              isTime: true,
              percent: 11,
              rawVlue: '400',
              unit: 'ms',
              displayValue: 'Native calling times On First Screen can be reduced.',
              description: 'You can reduce times of calling native brige function, that will increase the consumption of time on the first screen.'
            },
            {
              isTime: true,
              percent: 12,
              rawVlue: '500',
              unit: 'ms',
              displayValue: 'JS calling times On First Screen can be reduced.',
              description: 'You can reduce times of calling a javascript function, that will increase the consumption of time on the first screen.'
            },
            {
              isScore: true,
              rawVlue: '100',
              displayValue: 'Numbers of components load on First Screen can be reduced.',
              description: 'Loading too many components will affect the time spent by the application on the first screen.'
            },
            {
              isScore: true,
              rawVlue: '21',
              displayValue: 'Http/Https request on First Screen should be reduced.',
              description: 'Too many Http/Https request on First Screen  will increase the download time on the first screen.'
            }
          ]
        },
        'runtime-performance-issue': {
          description: `Weex Page Render Performance Can Be Improved.`,
          helpText: 'We recommend that you control the depth of the view to improve the overall rendering performance of the weex page.',
          extendInfos: [
            {
              isScore: true,
              rawVlue: '21',
              displayValue: `The cells exceeding the limited size can be reduced.`,
              description: 'The number of cells exceeding the limited size will affect performance while weex page rending.'
            },
            {
              isScore: true,
              rawVlue: '21',
              displayValue: `There are some DOM layout has too deep view level.`,
              description: 'The number of cells exceeding the limited size will affect performance while weex page rending.'
            },
            {
              isScore: true,
              rawVlue: '21',
              displayValue: `The total number of rendering nodes on the first screen can be reduced.`,
              description: 'Too many rendering nodes on the first screen will affect performance while weex page rending.'
            }
          ]
        },
        'ram-issue': {
          description: 'Memory usage can be improved.',
          helpText: 'We recommend that you control the size of the picture to improve memory usage.',
          extendInfos: [
            {
              displayValue: `This image size can be reduce`,
              description: 'Too large image size will take up extra memory, the perfect size is (width*height*2)',
              type: 'list',
              itemDisplayName: 'View failing elements',
              itemType: 'image',
              items: [
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
                'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png'
              ]
            }
          ]
        }
      }
    },
    bestPraticesReport: {
      displayValue: 'Best Practices',
      description: `We've compiled some recommendations for modernizing your weex app and avoiding performance pitfalls.`,
      score: 33,
      extends: {

      }
    },
    accessibilityReport: {
      displayValue: 'Accessibility',
      description: `These checks highlight opportunities to improve the accessibility of your weex app. Only a subset of accessibility issues can be automatically detected so manual testing is also encouraged.`,
      score: 54,
      extends: {
        
      }
    }
  }
}

/**
 * options
 * - beforeOpen [Function]
 * - afterOpen [Function]
 * - beforeClose [Function]
 * - afterClose [Function]
 * - bodyClass [string]
 * - dialogClass [string]
 * - dialogOpenClass [string]
 * - dialogCloseClass [string]
 * - focus [string]
 * - focusElements [string]
 * - escapeClose [string]
 * - content [string]
 */
function openTestingModal() {
  var modal = new RModal(document.getElementById('modal'), {
      afterClose: function() {
        resetModal();
      },
      dialogOpenClass:'animated fadeIn',
      // dialogCloseClass:'animated fadeOutDown',
  });
  modal.open();
  window.modal = modal;
}

function drawScoreCanvas(drawing_elem, percent, forecolor, bgcolor, width, height) {  
  /* 
      @drawing_elem: 绘制对象 
      @percent：绘制圆环百分比, 范围[0, 100] 
      @forecolor: 绘制圆环的前景色，颜色代码 
      @bgcolor: 绘制圆环的背景色，颜色代码 
  */  
  var context = drawing_elem.getContext("2d");  
  drawing_elem.width = width;
  drawing_elem.height = height;
  var center_x = drawing_elem.width / 2;  
  var center_y = drawing_elem.height / 2;  
  var rad = Math.PI*2/100;   
  var speed = 0;  
    
  // 绘制背景圆圈  
  function backgroundCircle(){  
      context.save();  
      context.beginPath();  
      context.lineWidth = 2; //设置线宽  
      var radius = center_x - context.lineWidth;  
      context.lineCap = "round";  
      context.strokeStyle = bgcolor;  
      context.arc(center_x, center_y, radius, 0, Math.PI*2, false);  
      context.stroke();  
      context.closePath();  
      context.restore();  
  }  

  //绘制运动圆环  
  function foregroundCircle(n){  
      context.save();  
      context.strokeStyle = forecolor;  
      context.lineWidth = 2;  
      context.lineCap = "round";  
      var radius = center_x - context.lineWidth;  
      context.beginPath();  
      context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)  
      context.stroke();  
      context.closePath();  
      context.restore();  
  }  

  //绘制文字  
  function text(n){  
      context.save(); //save和restore可以保证样式属性只运用于该段canvas元素  
      context.fillStyle = forecolor;  
      var font_size = 16;  
      context.font = font_size + "px Helvetica";  
      var text_width = context.measureText(n.toFixed(0)).width;  
      context.fillText(n.toFixed(0), center_x-text_width/2, center_y + font_size/2 - 2);  
      context.restore();  
  }  

  //执行动画  
  (function drawFrame(){  
      window.requestAnimationFrame(drawFrame);  
      context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);  
      backgroundCircle();  
      text(speed);  
      foregroundCircle(speed);  
      if(speed >= percent) return;  
      speed += 5;  
  }());  
}

function drawScore(elem, score, width, height) {
  width = width || 50;
  height = height || 50;
  if (score <= 40) {
    drawScoreCanvas(elem, score, 'rgb(221,53,54)', 'rgb(204,204,204)', width, height);
  }
  else if (score > 40 && score < 70) {
    drawScoreCanvas(elem, score, 'rgb(237,108,32)', 'rgb(204,204,204)', width, height);
  }
  else {
    drawScoreCanvas(elem, score, 'rgb(48,135,52)', 'rgb(204,204,204)', width, height);
  }
}

function resetModal () {
  var $optionalForm = $('.optional-modal');
  var $processForm = $('.process-modal');
  removeClassName($optionalForm, 'hidden');
  addClassName($processForm, 'hidden');
}

function resetPerformance () {
  var $reportContent = $('.tool-report-content');
  var $descriptionContent = $('.tool-description');
  $reportContent.innerHTML = '';
  removeClassName($descriptionContent, 'hidden');
  addClassName($reportContent, 'hidden');
}

function processPerformanceData(data) {
  var performanceTagMap = [
    'WXPTInitalize',
    'WXPTInitalizeSync',
    'WXPTFrameworkExecute',
    // instance
    'WXPTJSDownload',
    'WXPTJSCreateInstance',
    'WXFirstScreenJSFExecuteTime',
    'WXPTFirstScreenRender',
    'WXPTAllRender',
    'WXPTBundleSize',
    'WXPTEnd'
  ]
  var pageInstances = Object.keys(data.instances).filter(function(instance) {
    if (!instance) {
      return false;
    }
    return true;
  })
  var results = [];
  var deviceInfo = data.deviceInfo;
  var userAgent = `${deviceInfo.name}@${deviceInfo.model};weexSdkVersion/${deviceInfo.weexVersion};inspector/${deviceInfo.devtoolVersion}`
  
  pageInstances.forEach(function(page) {
    var source = data.instances[page];
    var datatime = new Date();
    var generatedTime = `${datatime.getFullYear()}-${datatime.getMonth()+1}-${datatime.getDay()} ${datatime.getHours()}:${datatime.getMinutes()}:${datatime.getSeconds()}` 
    var performanceTracingData = {};
    source.forEach(function(item) {
      var groupData = JSON.parse(item.data);
      if (groupData.end && groupData.start) {
        performanceTracingData[performanceTagMap[groupData.tag]] = (groupData.end - groupData.start).toFixed(2);
      }
    })
    // console.log(performanceTracingData)
    // results.push({
    //   userAgent: userAgent,
    //   generatedTime: generatedTime,
    //   url: page,
    //   averageScore: 60,
    //   performanceScore: 80,
    //   bestPracticesScore: 35,
    //   accessibilityScore: 55,
    //   JSLibInitTime: '1500 ms',
    //   SDKInitTime: '500 ms',
    //   SDKInitInvokeTime: '100 ms',
    //   SDKInitExecuteTime: '200 ms',
    //   reports: {
    //     securityReport: {
    //       displayValue: 'Security',
    //       description: '',
    //       score: 60
    //     },
    //     performanceReport: {
    //       displayValue: 'Performance',
    //       description: `These encapsulate your weex app's current performance and opportunities to improve it.`,
    //       score: 80,
    //       extends: {
    //         'jsbundle-issue': {
    //           description: `JSbundle Size Shouldn't Be Too Large`,
    //           helpText: 'We recommend that you control the size of your page bundle to improve overall performance',
    //           extendInfos: [
    //             {
    //               isSize: true,
    //               rawVlue: '1000',
    //               unit: 'kb',
    //               displayValue: `JSbundle size is bigger than 250kb`,
    //               description: 'The size of jsbundle will affect the time spent by the application on the first screen to download jsbundle, and it will also increase the time spent on jsbundle to some extent.'
    //             }
    //           ]
    //         },
    //         'first-screen-rending-issue': {
    //           isTime: true,
    //           percent: 100,
    //           rawVlue: '2500',
    //           unit: 'ms',
    //           description: `First Screen Rending Speed Can Be Improve`,
    //           helpText: `The main factors affecting page rendering time affect by create instance, loading components, callNative and callJs times and the HTTP request.`,
    //           extendInfos: [
    //             {
    //               isTime: true,
    //               percent: 66.3,
    //               rawVlue: '1,500',
    //               unit: 'ms',
    //               displayValue: `Create instance on first screen costs should below 1,000ms.`,
    //               description: 'Create too much instance will affect the time spent by the application on the first screen.'
    //             },
    //             {
    //               isTime: true,
    //               percent: 11,
    //               rawVlue: '400',
    //               unit: 'ms',
    //               displayValue: 'Native calling times On First Screen can be reduced.',
    //               description: 'You can reduce times of calling native brige function, that will increase the consumption of time on the first screen.'
    //             },
    //             {
    //               isTime: true,
    //               percent: 12,
    //               rawVlue: '500',
    //               unit: 'ms',
    //               displayValue: 'JS calling times On First Screen can be reduced.',
    //               description: 'You can reduce times of calling a javascript function, that will increase the consumption of time on the first screen.'
    //             },
    //             {
    //               isScore: true,
    //               rawVlue: '100',
    //               displayValue: 'Numbers of components load on First Screen can be reduced.',
    //               description: 'Loading too many components will affect the time spent by the application on the first screen.'
    //             },
    //             {
    //               isScore: true,
    //               rawVlue: '21',
    //               displayValue: 'Http/Https request on First Screen should be reduced.',
    //               description: 'Too many Http/Https request on First Screen  will increase the download time on the first screen.'
    //             }
    //           ]
    //         },
    //         'runtime-performance-issue': {
    //           description: `Weex Page Render Performance Can Be Improved.`,
    //           helpText: 'We recommend that you control the depth of the view to improve the overall rendering performance of the weex page.',
    //           extendInfos: [
    //             {
    //               isScore: true,
    //               rawVlue: '21',
    //               displayValue: `The cells exceeding the limited size can be reduced.`,
    //               description: 'The number of cells exceeding the limited size will affect performance while weex page rending.'
    //             },
    //             {
    //               isScore: true,
    //               rawVlue: '21',
    //               displayValue: `There are some DOM layout has too deep view level.`,
    //               description: 'The number of cells exceeding the limited size will affect performance while weex page rending.'
    //             },
    //             {
    //               isScore: true,
    //               rawVlue: '21',
    //               displayValue: `The total number of rendering nodes on the first screen can be reduced.`,
    //               description: 'Too many rendering nodes on the first screen will affect performance while weex page rending.'
    //             }
    //           ]
    //         },
    //         'ram-issue': {
    //           description: 'Memory usage can be improved.',
    //           helpText: 'We recommend that you control the size of the picture to improve memory usage.',
    //           extendInfos: [
    //             {
    //               displayValue: `This image size can be reduce`,
    //               description: 'Too large image size will take up extra memory, the perfect size is (width*height*2)',
    //               type: 'list',
    //               itemDisplayName: 'View failing elements',
    //               itemType: 'image',
    //               items: [
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png',
    //                 'https://zos.alipayobjects.com/rmsportal/UQvFKvLLWPPmxTM.png'
    //               ]
    //             }
    //           ]
    //         }
    //       }
    //     },
    //     bestPraticesReport: {
    //       displayValue: 'Best Practices',
    //       description: `We've compiled some recommendations for modernizing your weex app and avoiding performance pitfalls.`,
    //       score: 33,
    //       extends: {

    //       }
    //     },
    //     accessibilityReport: {
    //       displayValue: 'Accessibility',
    //       description: `These checks highlight opportunities to improve the accessibility of your weex app. Only a subset of accessibility issues can be automatically detected so manual testing is also encouraged.`,
    //       score: 54,
    //       extends: {
            
    //       }
    //     }
    //   }
    // })
  })
}

function generatePerformanceReport (data) {
  console.log(data)
  processPerformanceData(data)

  var $reportContent = $('.tool-report-content');
  var $descriptionContent = $('.tool-description');
  
  $reportContent.innerHTML = generatePerformanceReportTemplate(reportData);
  initData();
  addClassName($descriptionContent, 'hidden');
  removeClassName($reportContent, 'hidden');
  modal.close();
}

function initData () {
  initScoreCanvas();
  initTimeBar ();
}

function initTimeBar () {
  document.querySelectorAll("[data-percent]").forEach(function(elem) {
    elem.style.width = `${elem.dataset.percent}%`;
  })
}

function initScoreCanvas () {
  document.querySelectorAll("canvas[data-score]").forEach(function(elem) {
    drawScore(elem, elem.dataset.score, elem.dataset.width, elem.dataset.height);
  })
}

// start performance testing
document.addEventListener('click', function(e) {
  var $optionalForm = $('.optional-modal');
  var $processForm = $('.process-modal');
  var $processDescription = $('.process-description');
  var startPerformanceTestingButton = '.start-testing-button'
  var startPerformanceButton = '.start-btn';
  var stopPerformanceButton = '.stop-btn';
  var clearPerformanceButton = '.clear';
  var target = e.target;
  if (hasClassName(target, startPerformanceTestingButton)) {
    openTestingModal();
  }
  else if (hasClassName(target, startPerformanceButton)) {
    var formData = serialize($optionalForm, { hash: true });
    var startPerformanceMessage = {
      method: 'WxDebug.startPerformanceTracing',
      parmas: {
        layout: formData.layout === 'on' ? true : false,
        image: formData.image === 'on' ? true : false,
        ram: formData.ram === 'on' ? true : false,
        reload: formData.reload === 'on' ? true : false,
      }
    }
    $processDescription.innerText = 'Loading page & waiting for onload';
    addClassName($optionalForm, 'hidden');
    removeClassName($processForm, 'hidden');
    websocket.send(startPerformanceMessage);
    setTimeout(function(){$processDescription.innerText = 'Retrieving trace';}, 1000);
  }
  else if (hasClassName(target, stopPerformanceButton)) {
    var stopPerformanceMessage = {
      method: 'WxDebug.stopPerformanceTracing'
    }
    websocket.send(stopPerformanceMessage);
    $processDescription.innerText = 'Generating performance report';
  }
  else if (hasClassName(target, clearPerformanceButton)) {
    resetPerformance();
  }
})

websocket.on('WxDebug.sendPerformanceData', function (event) {
  var $optionalForm = $('.optional-modal');
  var $processForm = $('.process-modal');
  generatePerformanceReport(event.params);
})
