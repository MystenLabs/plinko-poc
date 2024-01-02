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
var http_transport_exports = {};
__export(http_transport_exports, {
  SuiHTTPTransport: () => SuiHTTPTransport
});
module.exports = __toCommonJS(http_transport_exports);
var import_client_js = require("@open-rpc/client-js");
var import_version = require("../version.js");
var import_websocket_client = require("../rpc/websocket-client.js");
class SuiHTTPTransport {
  constructor({
    url,
    websocket: { url: websocketUrl, ...websocketOptions } = {},
    rpc
  }) {
    const transport = new import_client_js.HTTPTransport(rpc?.url ?? url, {
      headers: {
        "Content-Type": "application/json",
        "Client-Sdk-Type": "typescript",
        "Client-Sdk-Version": import_version.PACKAGE_VERSION,
        "Client-Target-Api-Version": import_version.TARGETED_RPC_VERSION,
        ...rpc?.headers
      }
    });
    this.rpcClient = new import_client_js.Client(new import_client_js.RequestManager([transport]));
    this.websocketClient = new import_websocket_client.WebsocketClient(websocketUrl ?? url, websocketOptions);
  }
  async request(input) {
    return await this.rpcClient.request(input);
  }
  async subscribe(input) {
    const unsubscribe = await this.websocketClient.request(input);
    return async () => !!await unsubscribe();
  }
}
//# sourceMappingURL=http-transport.js.map
