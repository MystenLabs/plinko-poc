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
var client_exports = {};
__export(client_exports, {
  JsonRpcClient: () => JsonRpcClient
});
module.exports = __toCommonJS(client_exports);
var import_client_js = require("@open-rpc/client-js");
var import_superstruct = require("superstruct");
var import_version = require("../version.js");
var import_errors = require("./errors.js");
class JsonRpcClient {
  constructor(url, httpHeaders) {
    const transport = new import_client_js.HTTPTransport(url, {
      headers: {
        "Content-Type": "application/json",
        "Client-Sdk-Type": "typescript",
        "Client-Sdk-Version": import_version.PACKAGE_VERSION,
        "Client-Target-Api-Version": import_version.TARGETED_RPC_VERSION,
        ...httpHeaders
      }
    });
    this.rpcClient = new import_client_js.Client(new import_client_js.RequestManager([transport]));
  }
  async requestWithType(method, args, struct) {
    const req = { method, args };
    const response = await this.request(method, args);
    if (false) {
      const [err] = validate(response, struct);
      if (err) {
        throw new RPCValidationError({
          req,
          result: response,
          cause: err
        });
      }
    }
    return response;
  }
  async request(method, params) {
    return await this.rpcClient.request({ method, params });
  }
}
//# sourceMappingURL=client.js.map
