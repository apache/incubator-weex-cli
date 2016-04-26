define('@weex-component/goto', function (require, exports, module) {

;
    module.exports = {
        data: function () {return {
            text: '',
            paddingLeft: 20
        }},
        created: function() {
            this.text = 'Yes It is! Go Weex >>>';
        },
        methods: {
            clicked: function() {
                this.$openURL('http://github.com/alibaba/weex');
            }
        }
    }


;module.exports.style = {}

;module.exports.template = {
  "type": "container",
  "children": [
    {
      "type": "text",
      "events": {
        "click": "clicked"
      },
      "style": {
        "textDecoration": "underline",
        "paddingLeft": function () {return this.paddingLeft}
      },
      "attr": {
        "value": function () {return this.text}
      }
    }
  ]
}

;})

// require module
bootstrap('@weex-component/goto', {"transformerVersion":"0.3.0"})