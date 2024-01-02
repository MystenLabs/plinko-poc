"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var connection_exports = {};
__export(connection_exports, {
  Connection: () => Connection,
  devnetConnection: () => devnetConnection,
  localnetConnection: () => localnetConnection,
  mainnetConnection: () => mainnetConnection,
  testnetConnection: () => testnetConnection
});
module.exports = __toCommonJS(connection_exports);
var _options;
class Connection {
  constructor(options) {
    __privateAdd(this, _options, void 0);
    __privateSet(this, _options, options);
  }
  get fullnode() {
    return __privateGet(this, _options).fullnode;
  }
  // TODO: Decide if we should default the websocket URL like this:
  get websocket() {
    return __privateGet(this, _options).websocket || __privateGet(this, _options).fullnode;
  }
  /** @deprecated Use the new faucet APIs from `@mysten/sui.js/faucet` instead. */
  get faucet() {
    return __privateGet(this, _options).faucet;
  }
}
_options = new WeakMap();
const localnetConnection = new Connection({
  fullnode: "http://127.0.0.1:9000",
  faucet: "http://127.0.0.1:9123/gas"
});
const devnetConnection = new Connection({
  fullnode: "https://fullnode.devnet.sui.io:443/",
  faucet: "https://faucet.devnet.sui.io/gas"
});
const testnetConnection = new Connection({
  fullnode: "https://fullnode.testnet.sui.io:443/",
  faucet: "https://faucet.testnet.sui.io/gas"
});
const mainnetConnection = new Connection({
  fullnode: "https://fullnode.mainnet.sui.io:443/"
});
//# sourceMappingURL=connection.js.map
