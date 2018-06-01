(<WXCliGlobal>global)._ = require("lodash");
(<WXCliGlobal>global).$injector = require("./xot").injector;

$injector.require("logger", "./logger");
$injector.requireCommand("proxy|*get", "./test");
