import { getObjectFields, getObjectId, getObjectType } from "../types/objects.js";
import { getOption } from "../types/option.js";
import { nullable, number, object, string } from "superstruct";
import { normalizeSuiObjectId } from "../utils/sui-types.js";
const SUI_SYSTEM_ADDRESS = "0x3";
const SUI_FRAMEWORK_ADDRESS = "0x2";
const MOVE_STDLIB_ADDRESS = "0x1";
const OBJECT_MODULE_NAME = "object";
const UID_STRUCT_NAME = "UID";
const ID_STRUCT_NAME = "ID";
const SUI_TYPE_ARG = `${SUI_FRAMEWORK_ADDRESS}::sui::SUI`;
const VALIDATORS_EVENTS_QUERY = "0x3::validator_set::ValidatorEpochInfoEventV2";
const SUI_CLOCK_OBJECT_ID = normalizeSuiObjectId("0x6");
const PAY_MODULE_NAME = "pay";
const PAY_SPLIT_COIN_VEC_FUNC_NAME = "split_vec";
const PAY_JOIN_COIN_FUNC_NAME = "join";
const COIN_TYPE_ARG_REGEX = /^0x2::coin::Coin<(.+)>$/;
function isObjectDataFull(resp) {
  return !!resp.data || !!resp.type;
}
const CoinMetadataStruct = object({
  decimals: number(),
  name: string(),
  symbol: string(),
  description: string(),
  iconUrl: nullable(string()),
  id: nullable(string())
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
      address: normalizeSuiObjectId(coinTypeArg.split("::")[0]),
      module: coinTypeArg.split("::")[1],
      name: coinTypeArg.split("::")[2],
      typeParams: []
    };
  }
  static getID(obj) {
    if ("fields" in obj) {
      return obj.fields.id.id;
    }
    return getObjectId(obj);
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
    const balance = getObjectFields(data)?.balance;
    return BigInt(balance);
  }
  static getType(data) {
    if (isObjectDataFull(data)) {
      return getObjectType(data);
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
    return BigInt(getOption(this.suiObject.data.fields.active_delegation) || 0);
  }
  delegateAmount() {
    return this.suiObject.data.fields.delegate_amount;
  }
  endingEpoch() {
    return getOption(this.suiObject.data.fields.ending_epoch);
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
export {
  COIN_TYPE_ARG_REGEX,
  Coin,
  CoinMetadataStruct,
  Delegation,
  ID_STRUCT_NAME,
  MOVE_STDLIB_ADDRESS,
  OBJECT_MODULE_NAME,
  PAY_JOIN_COIN_FUNC_NAME,
  PAY_MODULE_NAME,
  PAY_SPLIT_COIN_VEC_FUNC_NAME,
  SUI_CLOCK_OBJECT_ID,
  SUI_FRAMEWORK_ADDRESS,
  SUI_SYSTEM_ADDRESS,
  SUI_TYPE_ARG,
  UID_STRUCT_NAME,
  VALIDATORS_EVENTS_QUERY,
  isObjectDataFull
};
//# sourceMappingURL=framework.js.map
