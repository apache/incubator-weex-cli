const uuid = require("uuid");
const CHANNEL_MODE = require("./enum").CHANNEL_MODE;
const tools = require("../tools");
class Channel {
  constructor(mode, enableMulticast) {
    this.hubMap = {};
    this.mode = mode;
    this.id = uuid();
    this.cache = [];
    this.enableMulticast = enableMulticast;
  }

  getTerminal(hubId) {
    return this.hubMap[hubId];
  }

  findAll() {
    return Object.keys(this.hubMap).map(hid => ({
      hubId: hid,
      terminalId: this.hubMap[hid]
    }));
  }

  findOthers(hubId, terminalId, toHubId) {
    if (hubId === toHubId) {
      throw new Error("hubId must be different from toHubId");
    } else if (!this.has(hubId, terminalId) && !toHubId) {
      throw new Error(
        "terminal [" +
          hubId +
          "." +
          (terminalId || "*") +
          "] is not in this chanel !"
      );
    } else {
      const keys = Object.keys(this.hubMap);
      if (keys.length > 2 && !this.enableMulticast && !toHubId) {
        // channel中有超过三个hub的时候则默认不支持多播
        return [];
      }
      return keys
        .filter(
          hid => hid !== hubId && (!toHubId || tools.matchHubId(toHubId, hid))
        )
        .map(hid => ({ hubId: hid, terminalId: this.hubMap[hid] }));
    }
  }

  pushCache(message) {
    this.cache.push(message);
  }

  has(hubId, terminalId) {
    return (
      this.hubMap[hubId] && (!terminalId || this.hubMap[hubId] === terminalId)
    );
  }

  getCache(hubId) {
    const hit = [];
    const notHit = [];
    this.cache.forEach(c => {
      if (c._to.length > 0) {
        if (
          c._from.hubId !== hubId &&
          (!c._to[0].hubId || tools.matchHubId(c._to[0].hubId, hubId))
        ) {
          hit.push(c);
        } else {
          notHit.push(c);
        }
      }
    });
    if (hit.length > 0) {
      this.cache = notHit;
    }
    return hit;
  }

  join(hubId, terminalId, forced) {
    if (this.hubMap[hubId]) {
      if (forced) {
        this.hubMap[hubId] = terminalId;
      } else {
        throw new Error(
          "Join failed! There already exist one terminal in the same hub"
        );
      }
    } else {
      const hubIds = Object.keys(this.hubMap);
      if (this.mode === CHANNEL_MODE.P2P && hubIds.length >= 2) {
        throw new Error("A channel can just link two hub in p2p mode");
      }
      this.hubMap[hubId] = terminalId;
    }
  }

  leave(hubId, terminalId) {
    if (this.has(hubId, terminalId)) {
      this.cache = this.cache.filter(
        c => c.hubId !== hubId || (terminalId && c.terminalId !== terminalId)
      );
      delete this.hubMap[hubId];
    }
  }
}

module.exports = Channel;
