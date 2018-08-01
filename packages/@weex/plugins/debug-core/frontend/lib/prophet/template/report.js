var performanceReportTemplate = `
<div class="toolbar">
  <div class="load iconfont icon-custom-add"></div>
  <div class="download iconfont icon-download"></div>
  <span class="slash">|</span>
  <div class="data-selector">
  {{=it.url}} {{=it.generatedTime}}
  <span class="iconfont icon-sanjiaoxing-down"></span>
  </div>
  <div class="clear iconfont icon-ai55"></div>
</div>
<div class="report-content">
  <div class="score-row">
      {{ for(var report in it.reports) { }}
      <div class="score">
          <canvas id="average" data-score="{{=it.reports[report].score}}"></canvas>
          <div class="description">{{=it.reports[report].displayValue}}</div>
      </div>
      {{ } }}
  </div>
  <div class="score-items">
      <div class="score-header">
          <div class="title">Basic</div>
          <div class="small">Basic information of your weex page.</div>
          <details class="basic-details">
          <summary>
          Runtime Environment -- Results for: <a style="display:inline;" target="blank" href="{{=it.url}}">{{=it.url}}</a>
          </summary>
          <ul>
            <li>UserAgent: <span>{{=it.userAgent}}</span></li>
            <li>JSframework Initial Time: <span>{{=it.JSLibInitTime}}</span></li>
            <li>Weex SDK Initial Time: <span>{{=it.SDKInitTime}}</span></li>
            <li>Weex SDK Invoke Time Of Initialization: <span>{{=it.SDKInitInvokeTime}}</span></li>
            <li>Weex SDK Execute Time Of Initialization: <span>{{=it.SDKInitExecuteTime}}</span></li>
          </ul>
          </details> 
      </div>
      {{ for(var report in it.reports) { }}
      {{? it.reports[report].extends}}
      <div class="score-header">
          <div class="title">{{=it.reports[report].displayValue}}</div>
          <div class="small">{{=it.reports[report].description}}</div>
          <canvas id="performance" data-score="{{=it.reports[report].score}}" data-width="46" data-height="46"></canvas>
      </div>
      {{? it.reports[report].extends }}
      <ul>
        {{ for(var extent in it.reports[report].extends) { }}
          <li class="title">
              <h1>{{=it.reports[report].extends[extent].description}}</h1>
              <p class="issue-description">{{=it.reports[report].extends[extent].helpText}}</p>
              {{?it.reports[report].extends[extent].isTime}}
                <div class="item-timebar">
                  <span>{{=it.reports[report].extends[extent].rawVlue.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ' ' + it.reports[report].extends[extent].unit}}</span>
                  <div class="bar" data-percent="{{=it.reports[report].extends[extent].percent}}"></div>
                </div>
              {{?}}
          </li>
          {{ for(var info in it.reports[report].extends[extent].extendInfos) { }}
          <li>
              {{?!it.reports[report].extends[extent].extendInfos[info].rawVlue}}
              <span class="iconfont icon-error"></span>
              {{?}}
              {{?it.reports[report].extends[extent].extendInfos[info].rawVlue}}
              {{?it.reports[report].extends[extent].extendInfos[info].isScore}}
                <span class="item-score">{{=it.reports[report].extends[extent].extendInfos[info].rawVlue}}</span>
              {{?}}           
              {{?it.reports[report].extends[extent].extendInfos[info].isTime}}
                <div class="item-timebar">
                  <span>{{=it.reports[report].extends[extent].extendInfos[info].rawVlue.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ' ' + it.reports[report].extends[extent].extendInfos[info].unit}}</span>
                  <div class="bar" data-percent="{{=it.reports[report].extends[extent].extendInfos[info].percent}}"></div>
                </div>
              {{?}}
              {{?it.reports[report].extends[extent].extendInfos[info].isSize}}
                <div class="item-timebar">
                  <span>{{=it.reports[report].extends[extent].extendInfos[info].rawVlue.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ' ' + it.reports[report].extends[extent].extendInfos[info].unit}}</span>
                </div>
              {{?}}
              
              {{?}}
              {{=it.reports[report].extends[extent].extendInfos[info].displayValue}}
              <details class="expandable-details">
                <summary>
                {{=it.reports[report].extends[extent].extendInfos[info].displayValue}}
                </summary>
                <div class="issue-description">
                  {{=it.reports[report].extends[extent].extendInfos[info].description}}
                </div>

                {{?it.reports[report].extends[extent].extendInfos[info].type === 'list'}}
                <details class="extends-details">
                  <summary>
                    {{=it.reports[report].extends[extent].extendInfos[info].itemDisplayName}}
                  </summary>
                  <div class="issue-description">
                    {{~it.reports[report].extends[extent].extendInfos[info].items :value:index}}
                    <a target="blank" class="items" herf="{{=value}}">
                      {{?it.reports[report].extends[extent].extendInfos[info].itemType === 'image'}}
                      <img class="preview" src="{{=value}}"/>
                      {{?}}
                      {{=value}}
                    </a>
                    {{~}}
                  </div>
                </details> 
                {{?}}

              </details>
          </li>
          {{ } }}
        {{ } }}
      </ul>
      {{?}}
      {{?}}
      {{ } }}
  </div>
</div>
`
var generatePerformanceReportTemplate = doT.template(performanceReportTemplate)
