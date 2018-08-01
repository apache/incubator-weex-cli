var $ = function (selector) {
  return document.querySelector(selector)
}

function hasClassName(selector, classname) {
  var $selector = selector;
  classname = classname.replace('.', '');
  if (typeof selector === 'string') {
    $selector = $(selector);
  }
  return $selector.className.indexOf(classname) > -1;
}

function replaceClassName(selector, from, to) {
  var $selector = selector;
  if (typeof selector === 'string') {
    $selector = $(selector);
  }
  $selector.className = $selector.className.replace(from, to)
}

function removeClassName(selector, classname) {
  var $selector = selector;
  classname = classname.replace('.', '');
  if (typeof selector === 'string') {
    $selector = $(selector);
  }
  if ($selector.className.indexOf(classname) > -1) {
    $selector.className = $selector.className.replace(classname, '').trim();
  }
}

function addClassName(selector, classname) {
  var $selector = selector;
  classname = classname.replace('.', '');
  if (typeof selector === 'string') {
    $selector = $(selector);
  }
  if ($selector.className.indexOf(classname) === -1) {
    $selector.className += ` ${classname}`;
  }
}

function toggleClassName(selector, classname) {
  var $selector = selector;
  classname = classname.replace('.', '');
  if (typeof selector === 'string') {
    $selector = $(selector);
  }
  if ($selector.className.indexOf(classname) === -1) {
    $selector.className += ` ${classname}`;
  }
  else {
    selector.className = $selector.className.replace(classname, '');
  }
}

function generatei18nTips(tip) {
  return gl_localeText[navigator.language.split('-')[0] || 'en'][tip];
}

function WebsocketClient(url) {
  this.connect(url);
}
