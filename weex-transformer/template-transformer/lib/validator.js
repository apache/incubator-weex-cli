var exp = require('./exp')
var styler = require('weex-styler')
var util = styler.util

var COMMON_EVENTS = ['click', 'appear', 'disappear']
var REQUIRED = {}
var NATIVE_TAG_GROUP = {
  common: {
    container: {
      events: COMMON_EVENTS
    },
    text: {
      events: COMMON_EVENTS,
      // attr: {
      //   value: function (v) {
      //     return {
      //       value: v,
      //       reason: 'NOTE: `value` could be written as text content in <text>'
      //     }
      //   }
      // },
      textContent: true
    },
    image: {
      alias: ['img'],
      noChild: true,
      events: COMMON_EVENTS,
      attr: {
        src: REQUIRED
      }
    },
    slider: {
      events: COMMON_EVENTS.concat('change')
    }
  },
  promo: {
    tabheader: {
      noChild: true,
      events: COMMON_EVENTS.concat('change')
    },
    marquee: {
      events: COMMON_EVENTS
    },
    countdown: {
      noChild: true,
      events: COMMON_EVENTS
    },
    cell: {
      defaultAttr: {
        append: 'tree'
      }
    },
    lastVisited: {
      events: COMMON_EVENTS
    }
  }
}

var TAG_NAME_ALIAS_MAP = {}
var TAG_DEFAULT_ATTR_MAP = {}
var NO_CHILD_TAG_NAME_LIST = []
var TEXT_CONTENT_TAG_NAME_LIST = []

;(function initRules() {
  Object.keys(NATIVE_TAG_GROUP).forEach(function (groupName) {
    var group = NATIVE_TAG_GROUP[groupName]
    Object.keys(group).forEach(function (tagName) {
      var tagInfo = group[tagName]
      if (tagInfo.noChild) {
        NO_CHILD_TAG_NAME_LIST.push(tagName)
      }
      if (tagInfo.textContent) {
        TEXT_CONTENT_TAG_NAME_LIST.push(tagName)
      }
      if (tagInfo.alias && tagInfo.alias.length) {
        tagInfo.alias.forEach(function (n) {
          TAG_NAME_ALIAS_MAP[n] = tagName
        })
      }
      if (tagInfo.defaultAttr) {
        TAG_DEFAULT_ATTR_MAP[tagName] = tagInfo.defaultAttr
      }
    })
  })
  // console.log('TAG_NAME_ALIAS_MAP', TAG_NAME_ALIAS_MAP)
  // console.log('NO_CHILD_TAG_NAME_LIST', NO_CHILD_TAG_NAME_LIST)
  // console.log('TEXT_CONTENT_TAG_NAME_LIST', TEXT_CONTENT_TAG_NAME_LIST)
})()




/**
 * tag name checking
 * - autofix alias
 * - append deps
 * - check parent requirements
 * - check children requirements
 * and the result, deps, log will be updated
 *
 * @param  {Node} node
 * @param  {object} output{result, deps[], log[]}
 */
function checkTagName(node, output) {
  var result = output.result
  var deps = output.deps
  var log = output.log

  var tagName = node.tagName
  var childNodes = node.childNodes || []
  var location = node.__location || {}

  // alias
  if (TAG_NAME_ALIAS_MAP[tagName]) {
    if (tagName !== 'img') { // FIXME: `parse5` autofixes image to img silently
      log.push({
        line: location.line || 1,
        column: location.col || 1,
        reason: 'NOTE: tag name `' + tagName + '` is autofixed to `' + TAG_NAME_ALIAS_MAP[tagName] + '`'
      })
    }
    tagName = TAG_NAME_ALIAS_MAP[tagName]
  }
  result.type = tagName

  // deps
  if (deps.indexOf(tagName) < 0) {
    deps.push(tagName)
  }

  // parent (no any rules yet)

  // child (noChild, textContent)
  if (NO_CHILD_TAG_NAME_LIST.indexOf(tagName) >= 0) {
    if (childNodes.length > 0) {
      log.push({
        line: location.line || 1,
        column: location.col || 1,
        reason: 'ERROR: tag name `' + tagName + '` should not have children'
      })
    }
  }
  if (TEXT_CONTENT_TAG_NAME_LIST.indexOf(tagName) >= 0) {
    if (childNodes.length > 1 || (childNodes[0] && childNodes[0].nodeName !== '#text')) {
      log.push({
        line: location.line || 1,
        column: location.col || 1,
        reason: 'ERROR: tag name `' + tagName + '` should just have one text node only'
      })
    }
  }

  // default attr
  if (TAG_DEFAULT_ATTR_MAP[tagName]) {
    Object.keys(TAG_DEFAULT_ATTR_MAP[tagName]).forEach(function (attr) {
      if (attr !== 'append') {
        result.attr = result.attr || {}
        result.attr[attr] = TAG_DEFAULT_ATTR_MAP[tagName][attr]
      } else {
        result[attr] = TAG_DEFAULT_ATTR_MAP[tagName][attr]
      }
    })
  }
}

/**
 * @param  {string} id
 * @param  {object} output{result, deps[], log[]}
 */
function checkId(id, output) {
  if (id) {
    output.result.id = exp(id)
  }
}

/**
 * 'a b c' -> ['a', 'b', 'c']
 * 'a {{b}} c' -> function () {return ['a', this.b, 'c']}
 *
 * @param  {string} className
 * @param  {object} output{result, deps[], log[]}
 */
function checkClass(className, output) {
  var hasBinding
  var tempClassList
  var classList = []
  var tempCode

  className = className.trim()
  if (className) {
    tempClassList = className.split(' ')

    // handle space in bindings
    var expStart = -1
    var expEnd = -1
    tempClassList.forEach(function (subName, index) {
      if (subName.indexOf('{{') > -1 && subName.indexOf('}}') === -1) {
        expStart = index
      } else if (expStart !== -1 && subName.indexOf('}}') > -1) {
        expEnd = index
        classList.push(tempClassList.slice(expStart, expEnd + 1).join(''))
        expStart = -1
        expEnd = -1
      } else if ((expStart === -1 && expEnd === -1) || (subName.indexOf('{{') > -1 && subName.indexOf('}}') > -1)) {
        classList.push(subName)
      }
    })

    classList = classList.map(function (subName) {
      if (exp.isExpr(subName)) {
        hasBinding = true
        return exp(subName, false)
      }
      return '\'' + subName + '\''
    })

    // need to be improved and catch more errors
    if (hasBinding) {
      tempCode = '(function () {return [' + classList.join(', ') + ']})'
      output.result.classList = eval(tempCode)
    }
    else {
      output.result.classList = classList.map(function (subName) {
        return subName.substr(1, subName.length - 2)
      })
    }
  }
}

/**
 * @param  {string} cssText
 * @param  {object} output{result, deps[], log[]}
 * @param  {object} locationInfo{line, column}
 */
function checkStyle(cssText, output, locationInfo) {
  var style = {}
  var log = output.log
  if (cssText) {
    cssText.split(';').forEach(function (declarationText) {
      var k, v, vResult
      var pair = declarationText.trim().split(':')
      if (pair.length === 2) {
        k = pair[0].trim()
        k = util.hyphenedToCamelCase(k)
        v = pair[1].trim()
        v = exp(v)
        if (typeof v !== 'function') {
          vResult = styler.validateItem(k, v)
          v = vResult.value
          if (vResult.log) {
            // FIXME: in order to guarantee order of keys of a log item
            var ret = {}
            ret.line = locationInfo.line
            ret.column = locationInfo.column
            ret.reason = vResult.log.reason
            log.push(ret)
            // vResult.log.line = locationInfo.line
            // vResult.log.column = locationInfo.column
            // log.push(vResult.log)
          }
        }
        if (typeof v === 'number' || typeof v === 'string' || typeof v === 'function') {
          style[k] = v
        }
      }
    })
    output.result.style = style
  }
}

/**
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 * @param  {boolean} not
 */
function checkIf(value, output, not) {
  if (!exp.isExpr(value)) {
    // output.log
    value = '{{' + value + '}}'
  }
  if (value) {
    if (not) {
      value = '{{!(' + value.substr(2, value.length - 4) + ')}}'
    }
    output.result.shown = exp(value)
  }
}

/**
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 */
function checkElse(value, output) {
  checkIf(value, output, true)
}

/**
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 */
function checkRepeat(value, output) {
  if (!exp.isExpr(value)) {
    // output.log
    value = '{{' + value + '}}'
  }
  if (value) {
    output.result.repeat = exp(value)
  }
}

/**
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 */
function checkAppend(value, output) {
  if (value) {
    output.result.append = exp(value)
  }
}

/**
 * @param  {string} name
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 */
function checkEvent(name, value, output) {
  var eventName = name.substr(2)
  if (eventName && value) {
    if (exp.isExpr(value)) {
      // output.log
      value = value.substr(2, value.length - 4)
    }
    output.result.events = output.result.events || {}
    output.result.events[eventName] = value
  }
}

/**
 * @param  {string} name
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 * @param  {String} tagName
 * @param  {object} locationInfo{line, column}
 */
function checkAttr(name, value, output, tagName, locationInfo) {
  if (name && (typeof value === 'number' || typeof value === 'string')) {
    output.result.attr = output.result.attr || {}
    output.result.attr[util.hyphenedToCamelCase(name)] = exp(value)
    if (name === 'value' && tagName === 'text') {
      output.log.push({
        line: locationInfo.line,
        column: locationInfo.column,
        reason: 'NOTE: `value` could be written as text content in <text>'
      })
    }
  }
}

module.exports = {
  COMMON_EVENTS: COMMON_EVENTS,
  NATIVE_TAG_GROUP: NATIVE_TAG_GROUP,
  TAG_NAME_ALIAS_MAP: TAG_NAME_ALIAS_MAP,
  NO_CHILD_TAG_NAME_LIST: NO_CHILD_TAG_NAME_LIST,
  TEXT_CONTENT_TAG_NAME_LIST: TEXT_CONTENT_TAG_NAME_LIST,

  checkTagName: checkTagName,
  checkId: checkId,
  checkClass: checkClass,
  checkStyle: checkStyle,
  checkIf: checkIf,
  checkElse: checkElse,
  checkRepeat: checkRepeat,
  checkAppend: checkAppend,
  checkEvent: checkEvent,
  checkAttr: checkAttr
}
