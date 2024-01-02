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
var sui_system_state_exports = {};
__export(sui_system_state_exports, {
  ADD_STAKE_FUN_NAME: () => ADD_STAKE_FUN_NAME,
  ADD_STAKE_LOCKED_COIN_FUN_NAME: () => ADD_STAKE_LOCKED_COIN_FUN_NAME,
  SUI_SYSTEM_MODULE_NAME: () => SUI_SYSTEM_MODULE_NAME,
  SUI_SYSTEM_STATE_OBJECT_ID: () => SUI_SYSTEM_STATE_OBJECT_ID,
  SuiSystemStateUtil: () => SuiSystemStateUtil,
  WITHDRAW_STAKE_FUN_NAME: () => WITHDRAW_STAKE_FUN_NAME
});
module.exports = __toCommonJS(sui_system_state_exports);
var import_sui_types = require("../utils/sui-types.js");
var import_builder = require("../builder/index.js");
var import_types = require("../types/index.js");
var import_framework = require("./framework.js");
const SUI_SYSTEM_STATE_OBJECT_ID = (0, import_sui_types.normalizeSuiObjectId)("0x5");
const SUI_SYSTEM_MODULE_NAME = "sui_system";
const ADD_STAKE_FUN_NAME = "request_add_stake";
const ADD_STAKE_LOCKED_COIN_FUN_NAME = "request_add_stake_with_locked_coin";
const WITHDRAW_STAKE_FUN_NAME = "request_withdraw_stake";
class SuiSystemStateUtil {
  /**
   * Create a new transaction for staking coins ready to be signed and executed with `signer-and-provider`.
   *
   * @param coins the coins to be staked
   * @param amount the amount to stake
   * @param gasBudget omittable only for DevInspect mode
   */
  static async newRequestAddStakeTxn(client, coins, amount, validatorAddress) {
    const tx = new import_builder.TransactionBlock();
    const coin = tx.splitCoins(tx.gas, [tx.pure(amount)]);
    tx.moveCall({
      target: `${import_framework.SUI_SYSTEM_ADDRESS}::${SUI_SYSTEM_MODULE_NAME}::${ADD_STAKE_FUN_NAME}`,
      arguments: [tx.object(SUI_SYSTEM_STATE_OBJECT_ID), coin, tx.pure(validatorAddress)]
    });
    const coinObjects = await client.multiGetObjects({
      ids: coins,
      options: {
        showOwner: true
      }
    });
    tx.setGasPayment(coinObjects.map((obj) => (0, import_types.getObjectReference)(obj)));
    return tx;
  }
  /**
   * Create a new transaction for withdrawing coins ready to be signed and
   * executed with `signer-and-provider`.
   *
   * @param stake the stake object created in the requestAddStake txn
   * @param stakedCoinId the coins to withdraw
   * @param gasBudget omittable only for DevInspect mode
   */
  static async newRequestWithdrawlStakeTxn(stake, stakedCoinId) {
    const tx = new import_builder.TransactionBlock();
    tx.moveCall({
      target: `${import_framework.SUI_SYSTEM_ADDRESS}::${SUI_SYSTEM_MODULE_NAME}::${WITHDRAW_STAKE_FUN_NAME}`,
      arguments: [tx.object(SUI_SYSTEM_STATE_OBJECT_ID), tx.object(stake), tx.object(stakedCoinId)]
    });
    return tx;
  }
}
//# sourceMappingURL=sui-system-state.js.map
