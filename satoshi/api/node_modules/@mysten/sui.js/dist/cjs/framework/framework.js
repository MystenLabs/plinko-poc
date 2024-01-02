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
var framework_exports = {};
__export(framework_exports, {
  COIN_TYPE_ARG_REGEX: () => COIN_TYPE_ARG_REGEX,
  Coin: () => Coin,
  CoinMetadataStruct: () => CoinMetadataStruct,
  Delegation: () => Delegation,
  ID_STRUCT_NAME: () => ID_STRUCT_NAME,
  MOVE_STDLIB_ADDRESS: () => MOVE_STDLIB_ADDRESS,
  OBJECT_MODULE_NAME: () => OBJECT_MODULE_NAME,
  PAY_JOIN_COIN_FUNC_NAME: () => PAY_JOIN_COIN_FUNC_NAME,
  PAY_MODULE_NAME: () => PAY_MODULE_NAME,
  PAY_SPLIT_COIN_VEC_FUNC_NAME: () => PAY_SPLIT_COIN_VEC_FUNC_NAME,
  SUI_CLOCK_OBJECT_ID: () => SUI_CLOCK_OBJECT_ID,
  SUI_FRAMEWORK_ADDRESS: () => SUI_FRAMEWORK_ADDRESS,
  SUI_SYSTEM_ADDRESS: () => SUI_SYSTEM_ADDRESS,
  SUI_TYPE_ARG: () => SUI_TYPE_ARG,
  UID_STRUCT_NAME: () => UID_STRUCT_NAME,
  VALIDATORS_EVENTS_QUERY: () => VALIDATORS_EVENTS_QUERY,
  isObjectDataFull: () => isObjectDataFull
});
module.exports = __toCommonJS(framework_exports);
var import_objects = require("../types/objects.js");
var import_option = require("../types/option.js");
var import_superstruct = require("superstruct");
var import_sui_types = require("../utils/sui-types.js");
const SUI_SYSTEM_ADDRESS = "0x3";
const SUI_FRAMEWORK_ADDRESS = "0x2";
const MOVE_STDLIB_ADDRESS = "0x1";
const OBJECT_MODULE_NAME = "object";
const UID_STRUCT_NAME = "UID";
const ID_STRUCT_NAME = "ID";
const SUI_TYPE_ARG = `${SUI_FRAMEWORK_ADDRESS}::sui::SUI`;
const VALIDATORS_EVENTS_QUERY = "0x3::validator_set::ValidatorEpochInfoEventV2";
const SUI_CLOCK_OBJECT_ID = (0, import_sui_types.normalizeSuiObjectId)("0x6");
const PAY_MODULE_NAME = "pay";
const PAY_SPLIT_COIN_VEC_FUNC_NAME = "split_vec";
const PAY_JOIN_COIN_FUNC_NAME = "join";
const COIN_TYPE_ARG_REGEX = /^0x2::coin::Coin<(.+)>$/;
function isObjectDataFull(resp) {
  return !!resp.data || !!resp.type;
}
const CoinMetadataStruct = (0, import_superstruct.object)({
  decimals: (0, import_superstruct.number)(),
  name: (0, import_superstruct.string)(),
  symbol: (0, import_superstruct.string)(),
  description: (0, import_superstruct.string)(),
  iconUrl: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  id: (0, import_superstruct.nullable)((0, import_superstruct.string)())
});
class Coin {
  static isCoin(data) {
    return Coin.getType(data)?.match(COIN_TYPE_ARG_REGEX) != null;
  }
  static getCoinType(type) {
    const [, res] = type.match(COIN_TYPE_ARG_REGEX) ?? [];
    return res || null;
  }
  static getCoinTypeArg(obj) {
    const type = Coin.getType(obj);
    return type ? Coin.getCoinType(type) : null;
  }
  static isSUI(obj) {
    const arg = Coin.getCoinTypeArg(obj);
    return arg ? Coin.getCoinSymbol(arg) === "SUI" : false;
  }
  static getCoinSymbol(coinTypeArg) {
    return coinTypeArg.substring(coinTypeArg.lastIndexOf(":") + 1);
  }
  static getCoinStructTag(coinTypeArg) {
    return {
      address: (0, import_sui_types.normalizeSuiObjectId)(coinTypeArg.split("::")[0]),
      module: coinTypeArg.split("::")[1],
      name: coinTypeArg.split("::")[2],
      typeParams: []
    };
  }
  static getID(obj) {
    if ("fields" in obj) {
      return obj.fields.id.id;
    }
    return (0, import_objects.getObjectId)(obj);
  }
  static totalBalance(coins) {
    return coins.reduce(
      (partialSum, c) => partialSum + Coin.getBalanceFromCoinStruct(c),
      BigInt(0)
    );
  }
  /**
   * Sort coin by balance in an ascending order
   */
  static sortByBalance(coins) {
    return [...coins].sort(
      (a, b) => Coin.getBalanceFromCoinStruct(a) < Coin.getBalanceFromCoinStruct(b) ? -1 : Coin.getBalanceFromCoinStruct(a) > Coin.getBalanceFromCoinStruct(b) ? 1 : 0
    );
  }
  static getBalanceFromCoinStruct(coin) {
    return BigInt(coin.balance);
  }
  static getBalance(data) {
    if (!Coin.isCoin(data)) {
      return void 0;
    }
    const balance = (0, import_objects.getObjectFields)(data)?.balance;
    return BigInt(balance);
  }
  static getType(data) {
    if (isObjectDataFull(data)) {
      return (0, import_objects.getObjectType)(data);
    }
    return data.type;
  }
}
const _Delegation = class _Delegation {
  static isDelegationSuiObject(obj) {
    return "type" in obj && obj.type === _Delegation.SUI_OBJECT_TYPE;
  }
  constructor(obj) {
    this.suiObject = obj;
  }
  nextRewardUnclaimedEpoch() {
    return this.suiObject.data.fields.next_reward_unclaimed_epoch;
  }
  activeDelegation() {
    return BigInt((0, import_option.getOption)(this.suiObject.data.fields.active_delegation) || 0);
  }
  delegateAmount() {
    return this.suiObject.data.fields.delegate_amount;
  }
  endingEpoch() {
    return (0, import_option.getOption)(this.suiObject.data.fields.ending_epoch);
  }
  validatorAddress() {
    return this.suiObject.data.fields.validator_address;
  }
  isActive() {
    return this.activeDelegation() > 0 && !this.endingEpoch();
  }
  hasUnclaimedRewards(epoch) {
    return this.nextRewardUnclaimedEpoch() <= epoch && (this.isActive() || (this.endingEpoch() || 0) > epoch);
  }
};
_Delegation.SUI_OBJECT_TYPE = "0x2::delegation::Delegation";
let Delegation = _Delegation;
//# sourceMappingURL=framework.js.map
