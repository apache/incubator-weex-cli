'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var chalk = require('chalk');
var EventEmitter = require('events').EventEmitter;

var events = new EventEmitter();
var LOGLEVELS = ['verbose', 'log', 'info', 'warn', 'error', 'success'];

// global var
var LOGLEVEL = {
  VERBOSE: 'verbose',
  LOG: 'log',
  WARN: 'warn',
  INFO: 'info',
  ERROR: 'error',
  SUCCESS: 'success'
};

var SEVERITY = {
  verbose: 1000,
  log: 2000,
  warn: 3000,
  info: 3000,
  error: 5000,
  success: 10000
};

var LOGCOLOR = {
  verbose: 'grey',
  log: 'white',
  warn: 'yellow',
  info: 'white',
  error: 'red',
  success: 'green'
};

var DEFAULT_LOGLEVEL = LOGLEVEL.LOG;

var formatError = function formatError(error, isVerbose) {
  var message = '';
  if (error instanceof Error) {
    if (isVerbose) {
      message = error.stack;
    } else {
      message = error;
    }
  } else {
    // Plain text error message
    message = error;
  }
  if (typeof message === 'string' && message.toUpperCase().indexOf('ERROR:') !== 0) {
    // Needed for backward compatibility with external tools
    message = 'Error: ' + message;
  }
  return message;
};

var log = function log(loglevel) {
  return function (message) {
    var isVerbose = DEFAULT_LOGLEVEL === LOGLEVEL.VERBOSE;
    if (!SEVERITY[DEFAULT_LOGLEVEL] || SEVERITY[DEFAULT_LOGLEVEL] > SEVERITY[loglevel]) {
      // return instance to allow to chain calls
      return;
    }
    if (message instanceof Error || isVerbose && loglevel === 'error') {
      message = formatError(message, isVerbose);
    }
    var color = LOGCOLOR[loglevel];
    var time = void 0;
    var prefix = void 0;
    var sep = void 0;
    if (SEVERITY[loglevel] >= SEVERITY[LOGLEVEL.INFO]) {
      time = new Date();
      prefix = chalk.gray(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
      sep = ':';
      console.log(chalk.grey(prefix), sep, chalk[color](message));
    } else {
      console.log(chalk[color](message));
    }
  };
};

var subscribe = function subscribe(event) {
  if (!(event instanceof EventEmitter)) {
    throw new Error('Subscribe method only accepts an EventEmitter instance as argument');
  }
  event.on('verbose', log('verbose')).on('log', log('log')).on('info', log('info')).on('warn', log('warn')).on('error', log('error')).on('success', log('success'));

  return event;
};

var setLevel = function setLevel(logLevel) {
  DEFAULT_LOGLEVEL = logLevel;
};

var logger = {
  setLevel: setLevel,
  subscribe: subscribe,
  verbose: log('verbose'),
  log: log('log'),
  info: log('info'),
  warn: log('warn'),
  error: log('error'),
  success: log('success')
};

module.exports = _extends({}, logger, {
  events: events,
  LOGLEVELS: LOGLEVELS
});