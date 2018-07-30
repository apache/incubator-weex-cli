const HostsParser = require("parse-hosts");
const os = require("os");
const findRealHost = function(domain) {
  const hosts = HostsParser.get();
  for (const key in hosts) {
    if (hosts.hasOwnProperty(key)) {
      const domains = hosts[key];
      if (domains.indexOf(domain) !== -1) {
        return key;
      }
    }
  }
  return domain;
};
const isValidLocalHost = function(host) {
  const ipMap = os.networkInterfaces();
  let flag = false;
  for (const name in ipMap) {
    if (ipMap.hasOwnProperty(name)) {
      const ips = ipMap[name];
      ips.forEach(function(ip) {
        if (host === ip.address) {
          flag = true;
          return true;
        }
      });
    }
  }
  return flag;
};

module.exports = {
  findRealHost,
  isValidLocalHost
};
