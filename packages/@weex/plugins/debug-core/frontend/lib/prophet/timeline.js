var timeInterval = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10 ,20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

var LEFT_SIDEBAR_WIDTH = 200;
var TIMEBAR_HEIGHT = 30;
var TIME_BLOCK_SELF_HEIGHT = 20;
var TIME_BLOCK_INTERVAL = 1;
var TIME_BLOCK_HEIGHT = TIME_BLOCK_SELF_HEIGHT + TIME_BLOCK_INTERVAL;
var DEFAULT_TIME_WIDTH = 400;
var ENDTIME_EXTRA_INTERVAL = 100;
var TRIANGLE_BLOCK_WIDTH = 20;
var DEFAULT_TIME_BLOCK_COLOR = '#CDCDCD';
var MAX_TIME_WIDTH = 10000;
var MIN_TIME_WIDTH = 1;
var SCROLLBAR_WIDTH = 10;

function Timeline (tracingData) {
  this.tracingData = tracingData || {};

  /**
   * store visible tracingdata index
   */
  this.showingTracingData = [];

  this.showingTracingDataHeight = 0;
  this.totalEndTime = 0;
  this.scrollbar = null;
  this.dragObj = {
    isDraging: false,
    startX: 0,
    startY: 0
  };

  this.threadbar = [];

  this.mainPanelWidth = 0;
  this.leftSidebarWidth = LEFT_SIDEBAR_WIDTH;
  this.timebarHeight = TIMEBAR_HEIGHT;
  this.mainPanelHeight = 0;
  this.threadbarHeight = 0;

  /**
   * left time value in visible zone
   */
  this.leftTime = 0;

  /**
   * top scroll pixel in visible zone
   */
  this.topPixel = 0;

  /**
   * time span of visible zone
   */
  this.timeWidth = DEFAULT_TIME_WIDTH;

  this.canvas = null;
  this.ctx = null;
  this.init();
}

Timeline.prototype = {
  constructor: Timeline,
  init: function () {
    this.detailDiv = document.getElementById('timeline-detail');

    this.initCanvas();
    this.initPanelWH();
    this.initScrollbar();
    this.initEvent();
    
    this.initTracingData();
    this.refreshCanvas();
  },

  initCanvas: function () {
    this.canvas = document.getElementById('timeline');
    this.ctx = this.canvas.getContext('2d');
  },

  initPanelWH: function () {
    var panel = document.getElementById('timeline-panel');
    this.canvasWidth = panel.offsetWidth - SCROLLBAR_WIDTH;
    this.mainPanelWidth = this.canvasWidth - this.leftSidebarWidth;
    this.canvasHeight = panel.offsetHeight;
    this.mainPanelHeight = this.canvasHeight - this.timebarHeight - this.threadbarHeight;

    this.resolveHighDPI(this.canvasWidth, this.canvasHeight);
  },

  resolveHighDPI: function (width, height) {
    var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
                            this.ctx.mozBackingStorePixelRatio ||
                            this.ctx.msBackingStorePixelRatio ||
                            this.ctx.oBackingStorePixelRatio ||
                            this.ctx.backingStorePixelRatio || 1,
        
        ratio = devicePixelRatio / backingStoreRatio;    
    if (devicePixelRatio !== backingStoreRatio) {
      var oldWidth = width;
      var oldHeight = height;
      this.canvas.width = oldWidth * ratio;
      this.canvas.height = oldHeight * ratio;

      this.canvas.style.width = oldWidth + 'px';
      this.canvas.style.height = oldHeight + 'px';

      this.ctx.scale(ratio, ratio);
    }
    else {
      var oldWidth = width;
      var oldHeight = height;
      this.canvas.width = oldWidth * ratio;
      this.canvas.height = oldHeight * ratio;
    }
  },

  initScrollbar: function () {
    this.scrollbar = document.getElementById('timeline-scrollbar');
    this.scrollbarChild = document.createElement('div');
    this.scrollbar.appendChild(this.scrollbarChild);
    this.scrollbar.style.height = this.timebarHeight + this.mainPanelHeight + 'px';
  },

  initEvent: function () {
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('mousewheel', this.handleScroll.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMousedown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMousemove.bind(this));
    document.addEventListener('mouseup', this.handleMouseup.bind(this));

    this.scrollbar.addEventListener('scroll', this.handleScrollbarScroll.bind(this));

    window.addEventListener('resize', this.handleWindowResize.bind(this));
  },

  initTracingData: function () {
    if (this.tracingData) {
      this.leftTime = 0;
      this.topPixel = 0;
      this.timeWidth = DEFAULT_TIME_WIDTH;
      this.showingTracingData = [];
      if (this.tracingData.data) {
        this.tracingData.data.forEach((item, index) => {
          if (item.parentId === -1) {
            this.showingTracingData.push(index);
          }
        });
        this.showingTracingDataHeight = this.showingTracingData.length * TIME_BLOCK_HEIGHT;
        this.scrollbarChild.style.height = this.showingTracingDataHeight + this.timebarHeight + 'px';
      }

      if (this.tracingData.threadbar) {
        this.threadbar = this.tracingData.threadbar;
        this.threadbarHeight = TIME_BLOCK_HEIGHT * this.threadbar.length;
        this.mainPanelHeight = this.canvasHeight - this.timebarHeight - this.threadbarHeight;
        this.scrollbar.style.height = this.timebarHeight + this.mainPanelHeight + 'px';
      }

      if (this.tracingData.info) {
        this.totalEndTime = this.tracingData.info.totalEndTime + ENDTIME_EXTRA_INTERVAL;
        this.timeWidth = this.tracingData.info.renderFinishTime || DEFAULT_TIME_WIDTH;
      }
    }
  },

  setTracingData: function (tracingData) {
    if (tracingData) {
      this.tracingData = tracingData;
      this.initTracingData();
      this.refreshCanvas();
    }
  },

  refreshCanvas: function () {
    this.drawAll();
  },

  drawAll: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.tracingData.data) {
      this.drawMainPanel();
      this.drawTimePointDesc();
      this.drawLeftSidebar();
      this.drawThreadbar();
      this.drawTime();
    }
  },

  drawMainPanel: function () {
    var firstIndexNeedDraw = Math.floor(this.topPixel / TIME_BLOCK_HEIGHT);
    var len = this.showingTracingData.length;
    for (var i = firstIndexNeedDraw; i < len && i * TIME_BLOCK_HEIGHT - this.topPixel < this.mainPanelHeight; i++) {
      var traceIndex = this.showingTracingData[i];
      var traceItem = this.tracingData.data[traceIndex];

      var yPos = i * TIME_BLOCK_HEIGHT - this.topPixel + this.timebarHeight;
      if (traceItem.children) {
        this.drawStrokeRect(traceItem, yPos);
        
        traceItem.children.forEach((traceIndex) => {
          var traceItem = this.tracingData.data[traceIndex];
          this.drawFillRect(traceItem, yPos);
        })
      } else {
        this.drawFillRect(traceItem, yPos);
      }
    }
  },

  drawThreadbar: function () {
    this.ctx.clearRect(0, this.canvasHeight - this.threadbarHeight, this.canvasWidth, this.threadbarHeight);

    this.threadbar.forEach((threadName, index) => {
      var yPos = this.canvasHeight - this.threadbarHeight + index * TIME_BLOCK_HEIGHT;
      this.drawFunctionName(threadName, this.leftSidebarWidth - TRIANGLE_BLOCK_WIDTH, yPos + TIME_BLOCK_SELF_HEIGHT / 2);
      
      this.tracingData.data.forEach((item) => {
        if (item.tName === threadName) {
          this.drawFillRect(item, yPos);
        }
      });
    })
  },

  drawTime: function () {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.timebarHeight);
    this.ctx.fillStyle = '#000000';
    this.ctx.strokeStyle = '#dddddd';
    this.ctx.textAlign = 'end';
    this.ctx.textBaseline = 'middle';

    var timeIntervalIndex = 0;
    while (timeIntervalIndex < timeInterval.length && this.timeWidth / timeInterval[timeIntervalIndex] > 20) {
      timeIntervalIndex++;
    }
    var interval = timeInterval[timeIntervalIndex];
    var leftTime = Math.floor(this.leftTime / interval) * interval;
    for (var i = 0; leftTime + i * interval < this.leftTime + this.timeWidth; i++) {
      var time = leftTime + i * interval;
      var leftPixel = this.timeToPixel(time) + this.leftSidebarWidth;
      if (leftPixel < this.leftSidebarWidth) {
        continue;
      }
      var timeStr = time.toFixed(2).toString().replace(/0*$|\.0*$/, '');

      this.ctx.fillText(timeStr + 'ms', leftPixel, this.timebarHeight / 2);
      this.ctx.beginPath();
      this.ctx.setLineDash([5, 6]);
      this.ctx.moveTo(leftPixel, 0);
      this.ctx.lineTo(leftPixel, this.canvasHeight);
      this.ctx.stroke();
      this.ctx.closePath();
    }

    this.drawTimePoint();
  },

  drawLeftSidebar: function () {
    this.ctx.clearRect(0, 0, this.leftSidebarWidth, this.canvasHeight);
    var firstIndexNeedDraw = Math.floor(this.topPixel / TIME_BLOCK_HEIGHT);
    var len = this.showingTracingData.length;
    for (var i = firstIndexNeedDraw; i < len && i * TIME_BLOCK_HEIGHT - this.topPixel < this.mainPanelHeight; i++) {
      var traceIndex = this.showingTracingData[i];
      var traceItem = this.tracingData.data[traceIndex];

      var yPos = i * TIME_BLOCK_HEIGHT - this.topPixel + this.timebarHeight;
      this.drawFunctionName(traceItem.functionName, this.leftSidebarWidth - TRIANGLE_BLOCK_WIDTH, yPos + TIME_BLOCK_SELF_HEIGHT / 2);
      if (traceItem.children) {
        this.drawTriangle(traceItem.showChildren, this.leftSidebarWidth - TRIANGLE_BLOCK_WIDTH / 2, yPos + TIME_BLOCK_SELF_HEIGHT / 2);
      }
    }
  },

  drawFunctionName: function (functionName, x, y) {
    this.ctx.fillStyle = '#000000';
    this.ctx.textAlign = 'end';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(functionName, x, y)
  },

  drawTriangle: function (isShow, x, y) {
    this.ctx.fillStyle = '#888888';

    if (isShow) {
      this.ctx.beginPath();
      this.ctx.moveTo(x - 6, y - 4);
      this.ctx.lineTo(x + 6, y - 4);
      this.ctx.lineTo(x, y + 6);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(x - 4, y - 6);
      this.ctx.lineTo(x + 6, y);
      this.ctx.lineTo(x - 4, y + 6);
      this.ctx.fill();
    }
  },

  drawStrokeRect: function (traceItem, y) {
    this.ctx.strokeStyle = '#dddddd';
    this.ctx.setLineDash([]);

    var leftPixel = this.timeToPixel(traceItem.startTime);
    var rightPixel = this.timeToPixel(traceItem.endTime);

    if (leftPixel < 0) {
      leftPixel = 0;
    }

    if (rightPixel < leftPixel) {
      return;
    }

    this.ctx.strokeRect(leftPixel + this.leftSidebarWidth, y, rightPixel - leftPixel, TIME_BLOCK_SELF_HEIGHT);
  },

  drawFillRect: function (traceItem, y) {
    var color = this.getTraceItemColor(traceItem);
    this.ctx.fillStyle = color;

    var leftPixel = this.timeToPixel(traceItem.startTime);
    var rightPixel = this.timeToPixel(traceItem.endTime);

    if (leftPixel < 0) {
      leftPixel = 0;
    }

    if (rightPixel < leftPixel) {
      return;
    }

    var drawWidth = rightPixel - leftPixel > 0 ? rightPixel - leftPixel : 1;
    this.ctx.fillRect(leftPixel + this.leftSidebarWidth, y, drawWidth, TIME_BLOCK_SELF_HEIGHT);
  },

  drawTimePoint: function () {
    this.ctx.strokeStyle = '#aecaf2';

    var timePoint = this.tracingData.timePoint;
    if (Array.isArray(timePoint)) {
      timePoint.forEach((item, index) => {
        var leftPixel = this.timeToPixel(item.endTime) + this.leftSidebarWidth;
        if (leftPixel > this.leftSidebarWidth) {
          this.ctx.beginPath();
          this.ctx.setLineDash([5, 3]);
          this.ctx.moveTo(leftPixel, 0);
          this.ctx.lineTo(leftPixel, this.canvasHeight);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      })
    }
  },

  drawTimePointDesc: function () {
    this.ctx.fillStyle = '#4976b7';
    this.ctx.strokeStyle = '#4976b7';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    var timePoint = this.tracingData.timePoint;
    
    if (Array.isArray(timePoint)) {
      timePoint.forEach((timePointItem, index) => {
        var leftPixel = this.timeToPixel(timePointItem.startTime);
        var rightPixel = this.timeToPixel(timePointItem.endTime);
        var lineWidth = rightPixel - leftPixel;

        var descLength = this.ctx.measureText(timePointItem.desc).width;
        var shortDescLength = this.ctx.measureText(timePointItem.shortDesc).width;

        var yPos = this.timebarHeight + TIME_BLOCK_SELF_HEIGHT / 2 - this.topPixel;
        if (index === 0) {
          yPos += TIME_BLOCK_HEIGHT;
        }
        var centerPoint = (rightPixel + leftPixel) / 2 + this.leftSidebarWidth;

        var textLength;

        if (descLength < lineWidth) {
          this.ctx.fillText(timePointItem.desc, centerPoint, yPos);
          textLength = descLength;
        } else if (shortDescLength < lineWidth) {
          this.ctx.fillText(timePointItem.shortDesc, centerPoint, yPos);
          textLength = shortDescLength;
        } else {
          textLength = 0;
        }
        if (lineWidth > 20) {
          this.ctx.lineWidth = 2;
          this.ctx.setLineDash([]);
          this.ctx.beginPath();
          this.ctx.moveTo(centerPoint + textLength / 2, yPos);
          this.ctx.lineTo(rightPixel + this.leftSidebarWidth, yPos);
          this.ctx.stroke();
          this.ctx.closePath();

          this.ctx.beginPath();
          this.ctx.moveTo(rightPixel + this.leftSidebarWidth - 4, yPos - 6);
          this.ctx.lineTo(rightPixel + this.leftSidebarWidth, yPos);
          this.ctx.lineTo(rightPixel + this.leftSidebarWidth - 4, yPos + 6);
          this.ctx.stroke();
          this.ctx.closePath();

          this.ctx.beginPath();
          this.ctx.moveTo(centerPoint - textLength / 2, yPos);
          this.ctx.lineTo(leftPixel + this.leftSidebarWidth, yPos);
          this.ctx.stroke();
          this.ctx.closePath();

          this.ctx.beginPath();
          this.ctx.moveTo(leftPixel + this.leftSidebarWidth + 4, yPos - 6);
          this.ctx.lineTo(leftPixel + this.leftSidebarWidth, yPos);
          this.ctx.lineTo(leftPixel + this.leftSidebarWidth + 4, yPos + 6);
          this.ctx.stroke();
          this.ctx.closePath();
          this.ctx.lineWidth = 1;
        }
      })
    }
  },

  handleClick: function (event) {
    if (event.offsetY < this.timebarHeight || event.offsetY > this.timebarHeight + this.mainPanelHeight) {
      return;
    }

    var showingTracingDataIndex = Math.floor((event.offsetY - this.timebarHeight + this.topPixel) / TIME_BLOCK_HEIGHT);
    
    // click function name in sidebar
    if (event.offsetX < this.leftSidebarWidth) {
      if (showingTracingDataIndex < this.showingTracingData.length) {
        var traceIndex = this.showingTracingData[showingTracingDataIndex];
        var traceItem = this.tracingData.data[traceIndex];
        if (traceItem.children) {
          if (traceItem.showChildren) {
            var len = this.clearShowingChildren(traceItem);
            this.showingTracingData.splice(showingTracingDataIndex + 1, len);
            traceItem.showChildren = false;
          } else {
            this.showingTracingData.splice(showingTracingDataIndex + 1, 0, ...traceItem.children);
            traceItem.showChildren = true;
          }
          this.showingTracingDataHeight =  this.showingTracingData.length * TIME_BLOCK_HEIGHT;
          this.scrollbarChild.style.height = this.showingTracingDataHeight  + this.timebarHeight + 'px';
          this.refreshCanvas();
        }
      }
    }
  },

  /**
   * stretch time width when handling vertical scroll
   * translate time when handling horizontal scroll
   */
  handleScroll: function (event) {
    event.preventDefault();
    this.clearTimeBlockDetail();
    var pointX = event.offsetX > this.leftSidebarWidth ? event.offsetX - this.leftSidebarWidth : event.offsetX;
    var deltaY = event.deltaY;
    var deltaX = event.deltaX;

    // judge horizontal scroll or vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      deltaY = 0;
    } else {
      deltaX = 0;
    }

    var timeWidth = this.timeWidth;

    // adjust rate when stretching time width
    deltaY = deltaY * timeWidth / 700.0 
    timeWidth += deltaY;

    if (timeWidth > MAX_TIME_WIDTH) {
      timeWidth = MAX_TIME_WIDTH;
    }
    if (timeWidth > this.totalEndTime) {
      timeWidth = this.totalEndTime;
    }
    if (timeWidth < MIN_TIME_WIDTH) {
      timeWidth = MIN_TIME_WIDTH;
    }

    // calculate left time
    var leftTime = this.leftTime;
    if (timeWidth > MIN_TIME_WIDTH && timeWidth < MAX_TIME_WIDTH) {
      leftTime -= pointX / this.mainPanelWidth * deltaY;
    }
    leftTime += deltaX * this.timeWidth / this.mainPanelWidth;
    leftTime = this.totalEndTime - timeWidth < leftTime ? this.totalEndTime - timeWidth : leftTime;
    leftTime = leftTime < 0 ? 0 : leftTime;
    this.leftTime = leftTime;
    this.timeWidth = timeWidth;
    this.refreshCanvas();
  },

  handleScrollbarScroll: function (event) {
    this.topPixel = this.scrollbar.scrollTop;
    this.refreshCanvas();
  },

  handleMousedown: function (event) {
    this.dragObj.isDraging = true;
    this.dragObj.startX = event.offsetX;
    this.dragObj.startY = event.offsetY;
    this.clearTimeBlockDetail();
  },

  /**
   * drag the canvas when mousedown
   * otherwise, show detail of the current time block
   */
  handleMousemove: function (event) {
    if (this.dragObj.isDraging) {
      var dx = event.offsetX - this.dragObj.startX;
      var dy = event.offsetY - this.dragObj.startY;
      this.dragObj.startX = event.offsetX;
      this.dragObj.startY = event.offsetY;
      var leftTime = this.leftTime - dx * this.timeWidth / this.mainPanelWidth;
      var topPixel = this.topPixel - dy;
      leftTime = this.totalEndTime - this.timeWidth < leftTime ? this.totalEndTime - this.timeWidth : leftTime;
      topPixel = this.showingTracingDataHeight - this.mainPanelHeight < topPixel ? this.showingTracingDataHeight - this.mainPanelHeight : topPixel;
      this.leftTime = leftTime > 0 ? leftTime : 0;
      this.topPixel = topPixel > 0 ? topPixel : 0;
      this.scrollbar.scrollTop = topPixel;
      this.refreshCanvas();
    } else {
      if (event.offsetY < this.timebarHeight || event.offsetY > this.timebarHeight + this.mainPanelHeight) {
        this.clearTimeBlockDetail();
        return;
      }
      var showingTracingDataIndex = Math.floor((event.offsetY - this.timebarHeight + this.topPixel) / TIME_BLOCK_HEIGHT);
      if (showingTracingDataIndex < this.showingTracingData.length) {
        var traceId = this.showingTracingData[showingTracingDataIndex];
        var traceItem = this.tracingData.data[traceId];
        var pointTime = (event.offsetX - this.leftSidebarWidth) * this.timeWidth / this.mainPanelWidth + this.leftTime;
        if (pointTime >= traceItem.startTime && pointTime <= traceItem.endTime) {
          this.showTimeBlockDetail(traceItem, event.offsetX, event.offsetY);
        } else {
          this.clearTimeBlockDetail();
        }
      }
    }
  },

  handleMouseup: function (event) {
    this.dragObj.isDraging = false;
  },

  handleWindowResize: function (event) {
    this.initPanelWH();
    this.scrollbar.style.height = this.timebarHeight + this.mainPanelHeight + 'px';
    this.refreshCanvas();
  },

  showTimeBlockDetail: function (traceItem, x, y) {
    if (traceItem.info && traceItem.info.length) {
      var htmlText = '';
      traceItem.info.forEach((item) => {
        htmlText += `<p>${item.name}<span>${item.content}</span></p>`;
      });
      this.detailDiv.innerHTML = htmlText;
      this.detailDiv.style.display = 'block';
      this.detailDiv.style.top = y + 2 + 'px';
      if (this.detailDiv.offsetWidth + x > this.canvasWidth) {
        this.detailDiv.style.left = x - 12 - this.detailDiv.offsetWidth + 'px';
      } else {
        this.detailDiv.style.left = x + 12 + 'px';
      }
    }
  },

  clearTimeBlockDetail: function () {
    this.detailDiv.style.display = 'none';
  },

  getTraceItemColor: function (traceItem) {
    if (traceItem.color) {
      return traceItem.color;
    }
    var threadName = traceItem.tName;
    var color = this.tracingData.colors[threadName];
    if (!color) {
      color = DEFAULT_TIME_BLOCK_COLOR;
    }
    traceItem.color = color;
    return color;
  },

  clearShowingChildren: function (traceItem) {
    var len = 0;
    if (traceItem.children && traceItem.showChildren) {
      traceItem.showChildren = false;
      len += traceItem.children.length;
      traceItem.children.forEach((traceIndex) => {
        var item = this.tracingData.data[traceIndex];
        len += this.clearShowingChildren(item);
      })
    }
    return len;
  },

  timeToPixel: function (time) {
    var pixel = Math.round((time - this.leftTime) * this.mainPanelWidth / this.timeWidth);
    return pixel;
  }
}
