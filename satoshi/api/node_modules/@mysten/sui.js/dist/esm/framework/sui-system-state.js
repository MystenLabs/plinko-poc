import { normalizeSuiObjectId } from "../utils/sui-types.js";
import { TransactionBlock } from "../builder/index.js";
import { getObjectReference } from "../types/index.js";
import { SUI_SYSTEM_ADDRESS } from "./framework.js";
const SUI_SYSTEM_STATE_OBJECT_ID = normalizeSuiObjectId("0x5");
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
    const tx = new TransactionBlock();
    const coin = tx.splitCoins(tx.gas, [tx.pure(amount)]);
    tx.moveCall({
      target: `${SUI_SYSTEM_ADDRESS}::${SUI_SYSTEM_MODULE_NAME}::${ADD_STAKE_FUN_NAME}`,
      arguments: [tx.object(SUI_SYSTEM_STATE_OBJECT_ID), coin, tx.pure(validatorAddress)]
    });
    const coinObjects = await client.multiGetObjects({
      ids: coins,
      options: {
        showOwner: true
      }
    });
    tx.setGasPayment(coinObjects.map((obj) => getObjectReference(obj)));
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
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${SUI_SYSTEM_ADDRESS}::${SUI_SYSTEM_MODULE_NAME}::${WITHDRAW_STAKE_FUN_NAME}`,
      arguments: [tx.object(SUI_SYSTEM_STATE_OBJECT_ID), tx.object(stake), tx.object(stakedCoinId)]
    });
    return tx;
  }
}
export {
  ADD_STAKE_FUN_NAME,
  ADD_STAKE_LOCKED_COIN_FUN_NAME,
  SUI_SYSTEM_MODULE_NAME,
  SUI_SYSTEM_STATE_OBJECT_ID,
  SuiSystemStateUtil,
  WITHDRAW_STAKE_FUN_NAME
};
//# sourceMappingURL=sui-system-state.js.map
