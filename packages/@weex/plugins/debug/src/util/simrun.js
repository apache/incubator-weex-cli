const simctl = require("node-simctl");
const execSync = require("child_process").execSync;
const path = require("path");
const ora = require("ora");
const download = require("download");
const fs = require("fs");

const ios = function(prefix, deviceType, appUrl, schema, params) {
  const result = {};
  return findDevice(prefix, deviceType, result).then(udid => {
    return openIosSimulator(udid).then(function() {
      try {
        openApp(udid, schema, params);
        return result;
      } catch (e) {
        return loadApp(appUrl).then(path => {
          return simctl.installApp(udid, path).then(() => {
            openApp(udid, schema, params);
            return result;
          });
        });
      }
    });
  });
};

function openApp(udid, schema, params) {
  execSync(
    `xcrun simctl openurl ${udid} ${schema}://${params ? "?" + params : ""}`,
    {
      stdio: "ignore"
    }
  );
}

function openIosSimulator(udid) {
  return new Promise((resolve, reject) => {
    try {
      execSync("xcrun instruments -w " + udid, {
        stdio: "ignore"
      });
    } catch (e) {}
    const timestamp = new Date().getTime();

    function checker() {
      let booted = false;
      simctl.getDevices().then(deviceMap => {
        Object.keys(deviceMap).forEach(sdk => {
          deviceMap[sdk].forEach(device => {
            if (device.udid === udid && device.state === "Booted") {
              booted = true;
            }
          });
        });
        if (booted) {
          resolve();
        } else if (new Date().getTime() - timestamp < 30000) {
          setTimeout(checker, 500);
        } else {
          reject(
            new Error({
              type: "simulator",
              message: "simulator start timeout!"
            })
          );
        }
      });
    }
    checker();
  });
}

function findDevice(prefix, deviceType, result) {
  let find;
  const deviceName = prefix + " " + deviceType;
  return new Promise((resolve, reject) => {
    simctl.getDevices().then(deviceMap => {
      Object.keys(deviceMap).forEach(sdk => {
        deviceMap[sdk].forEach(device => {
          if (device.name === deviceName) {
            find = device;
          }
        });
      });
      if (!find) {
        result.firstCreate = true;
        createDevice(prefix, deviceType).then(udid => resolve(udid));
      } else {
        resolve(find.udid);
      }
    });
  });
}

function createDevice(prefix, deviceType) {
  return simctl.createDevice(
    prefix + " " + deviceType,
    deviceType,
    getRuntime()
  );
}

function getRuntime() {
  const runtimes = JSON.parse(
    execSync("xcrun simctl list runtimes --json")
      .toString()
      .trim()
  );
  return runtimes["runtimes"].filter(r => r.name.indexOf("iOS") >= 0)[0]
    .identifier;
}

function loadApp(appUrl) {
  return new Promise((resolve, reject) => {
    if (/^(https?|ftp)/.test(appUrl)) {
      const schema = appUrl.split("|");
      const url = schema[0];
      const location =
        schema[1] || path.basename(appUrl, path.extname(appUrl)) + ".app";
      const targetPath = path.join(
        process.env["HOME"],
        ".simrun/",
        path.join("weexplayground", location)
      );
      if (fs.existsSync(targetPath)) {
        return resolve(targetPath);
      }
      const spinner = ora(`Download weexplayground ...`).start();
      download(url, path.join(process.env["HOME"], ".simrun/weexplayground/"), {
        extract: /\.(zip|tgz)$/.test(url)
      }).then(
        () => {
          spinner.stop();
          resolve(targetPath);
        },
        e => reject(e)
      );
    } else {
      resolve(appUrl);
    }
  });
}

module.exports = {
  ios
};
