define('@weex-component/z', function (require, exports, module) {

;

;module.exports.style = {}

;module.exports.template = {
  "type": "div"
}

;})

// require module
bootstrap('@weex-component/z', {"downgrade":{"ios":{"appVersion":">=13.0.0"},"android":{"appVersion":"<=0.0.0"}},"transformerVersion":"0.3.0"}, {"a":1,"b":2})