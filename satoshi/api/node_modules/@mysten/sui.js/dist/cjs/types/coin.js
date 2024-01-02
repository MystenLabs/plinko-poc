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
var coin_exports = {};
__export(coin_exports, {
  CoinBalance: () => CoinBalance,
  CoinStruct: () => CoinStruct,
  CoinSupply: () => CoinSupply,
  PaginatedCoins: () => PaginatedCoins
});
module.exports = __toCommonJS(coin_exports);
var import_superstruct = require("superstruct");
const CoinStruct = (0, import_superstruct.object)({
  coinType: (0, import_superstruct.string)(),
  // TODO(chris): rename this to objectId
  coinObjectId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.string)(),
  digest: (0, import_superstruct.string)(),
  balance: (0, import_superstruct.string)(),
  previousTransaction: (0, import_superstruct.string)()
});
const PaginatedCoins = (0, import_superstruct.object)({
  data: (0, import_superstruct.array)(CoinStruct),
  nextCursor: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  hasNextPage: (0, import_superstruct.boolean)()
});
const CoinBalance = (0, import_superstruct.object)({
  coinType: (0, import_superstruct.string)(),
  coinObjectCount: (0, import_superstruct.number)(),
  totalBalance: (0, import_superstruct.string)(),
  lockedBalance: (0, import_superstruct.object)({
    epochId: (0, import_superstruct.optional)((0, import_superstruct.number)()),
    number: (0, import_superstruct.optional)((0, import_superstruct.number)())
  })
});
const CoinSupply = (0, import_superstruct.object)({
  value: (0, import_superstruct.string)()
});
//# sourceMappingURL=coin.js.map
