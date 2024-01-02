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
var signer_with_provider_exports = {};
__export(signer_with_provider_exports, {
  SignerWithProvider: () => SignerWithProvider
});
module.exports = __toCommonJS(signer_with_provider_exports);
var import_bcs = require("@mysten/bcs");
var import_TransactionBlock = require("../builder/TransactionBlock.js");
var import_TransactionBlockData = require("../builder/TransactionBlockData.js");
var import_types = require("../types/index.js");
var import_intent = require("../cryptography/intent.js");
var import_bcs2 = require("../bcs/index.js");
class SignerWithProvider {
  /**
   * @deprecated Use `client` instead.
   */
  get provider() {
    return this.client;
  }
  ///////////////////
  // Sub-classes MAY override these
  /**
   * Request gas tokens from a faucet server and send to the signer
   * address
   * @param httpHeaders optional request headers
   * @deprecated Use `@mysten/sui.js/faucet` instead.
   */
  async requestSuiFromFaucet(httpHeaders) {
    if (!("requestSuiFromFaucet" in this.provider)) {
      throw new Error("To request SUI from faucet, please use @mysten/sui.js/faucet instead");
    }
    return this.provider.requestSuiFromFaucet(await this.getAddress(), httpHeaders);
  }
  constructor(client) {
    this.client = client;
  }
  /**
   * Sign a message using the keypair, with the `PersonalMessage` intent.
   */
  async signMessage(input) {
    const signature = await this.signData(
      (0, import_intent.messageWithIntent)(
        import_intent.IntentScope.PersonalMessage,
        import_bcs2.bcs.ser(["vector", "u8"], input.message).toBytes()
      )
    );
    return {
      messageBytes: (0, import_bcs.toB64)(input.message),
      signature
    };
  }
  async prepareTransactionBlock(transactionBlock) {
    if ((0, import_TransactionBlock.isTransactionBlock)(transactionBlock)) {
      transactionBlock.setSenderIfNotSet(await this.getAddress());
      return await transactionBlock.build({
        client: this.client
      });
    }
    if (transactionBlock instanceof Uint8Array) {
      return transactionBlock;
    }
    throw new Error("Unknown transaction format");
  }
  /**
   * Sign a transaction.
   */
  async signTransactionBlock(input) {
    const transactionBlockBytes = await this.prepareTransactionBlock(input.transactionBlock);
    const intentMessage = (0, import_intent.messageWithIntent)(import_intent.IntentScope.TransactionData, transactionBlockBytes);
    const signature = await this.signData(intentMessage);
    return {
      transactionBlockBytes: (0, import_bcs.toB64)(transactionBlockBytes),
      signature
    };
  }
  /**
   * Sign a transaction block and submit to the Fullnode for execution.
   *
   * @param options specify which fields to return (e.g., transaction, effects, events, etc).
   * By default, only the transaction digest will be returned.
   * @param requestType WaitForEffectsCert or WaitForLocalExecution, see details in `ExecuteTransactionRequestType`.
   * Defaults to `WaitForLocalExecution` if options.show_effects or options.show_events is true
   */
  async signAndExecuteTransactionBlock(input) {
    const { transactionBlockBytes, signature } = await this.signTransactionBlock({
      transactionBlock: input.transactionBlock
    });
    return await this.client.executeTransactionBlock({
      transactionBlock: transactionBlockBytes,
      signature,
      options: input.options,
      requestType: input.requestType
    });
  }
  /**
   * Derive transaction digest from
   * @param tx BCS serialized transaction data or a `Transaction` object
   * @returns transaction digest
   */
  async getTransactionBlockDigest(tx) {
    if ((0, import_TransactionBlock.isTransactionBlock)(tx)) {
      tx.setSenderIfNotSet(await this.getAddress());
      return tx.getDigest({ client: this.client });
    } else if (tx instanceof Uint8Array) {
      return import_TransactionBlockData.TransactionBlockDataBuilder.getDigestFromBytes(tx);
    } else {
      throw new Error("Unknown transaction format.");
    }
  }
  /**
   * Runs the transaction in dev-inpsect mode. Which allows for nearly any
   * transaction (or Move call) with any arguments. Detailed results are
   * provided, including both the transaction effects and any return values.
   */
  async devInspectTransactionBlock(input) {
    const address = await this.getAddress();
    return this.client.devInspectTransactionBlock({
      sender: address,
      ...input
    });
  }
  /**
   * Dry run a transaction and return the result.
   */
  async dryRunTransactionBlock(input) {
    let dryRunTxBytes;
    if ((0, import_TransactionBlock.isTransactionBlock)(input.transactionBlock)) {
      input.transactionBlock.setSenderIfNotSet(await this.getAddress());
      dryRunTxBytes = await input.transactionBlock.build({
        client: this.client
      });
    } else if (typeof input.transactionBlock === "string") {
      dryRunTxBytes = (0, import_bcs.fromB64)(input.transactionBlock);
    } else if (input.transactionBlock instanceof Uint8Array) {
      dryRunTxBytes = input.transactionBlock;
    } else {
      throw new Error("Unknown transaction format");
    }
    return this.client.dryRunTransactionBlock({
      transactionBlock: dryRunTxBytes
    });
  }
  /**
   * Returns the estimated gas cost for the transaction
   * @param tx The transaction to estimate the gas cost. When string it is assumed it's a serialized tx in base64
   * @returns total gas cost estimation
   * @throws whens fails to estimate the gas cost
   */
  async getGasCostEstimation(...args) {
    const txEffects = await this.dryRunTransactionBlock(...args);
    const gasEstimation = (0, import_types.getTotalGasUsedUpperBound)(txEffects.effects);
    if (typeof gasEstimation === "undefined") {
      throw new Error("Failed to estimate the gas cost from transaction");
    }
    return gasEstimation;
  }
}
//# sourceMappingURL=signer-with-provider.js.map
