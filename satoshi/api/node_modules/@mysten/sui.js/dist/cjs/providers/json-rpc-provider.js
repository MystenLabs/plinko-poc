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
var json_rpc_provider_exports = {};
__export(json_rpc_provider_exports, {
  JsonRpcProvider: () => JsonRpcProvider
});
module.exports = __toCommonJS(json_rpc_provider_exports);
var import_client = require("../rpc/client.js");
var import_types = require("../types/index.js");
var import_dynamic_fields = require("../types/dynamic_fields.js");
var import_websocket_client = require("../rpc/websocket-client.js");
var import_superstruct = require("superstruct");
var import_bcs = require("@mysten/bcs");
var import_connection = require("../rpc/connection.js");
var import_builder = require("../builder/index.js");
var import_checkpoints = require("../types/checkpoints.js");
var import_metrics = require("../types/metrics.js");
var import_epochs = require("../types/epochs.js");
var import_faucet = require("../faucet/index.js");
var import_sui_types = require("../utils/sui-types.js");
var import_framework = require("../framework/framework.js");
const DEFAULT_OPTIONS = {
  socketOptions: import_websocket_client.DEFAULT_CLIENT_OPTIONS,
  versionCacheTimeoutInSeconds: 600
};
class JsonRpcProvider {
  /**
   * Establish a connection to a Sui RPC endpoint
   *
   * @param connection The `Connection` object containing configuration for the network.
   * @param options configuration options for the provider
   */
  constructor(connection = import_connection.devnetConnection, options = DEFAULT_OPTIONS) {
    this.options = options;
    this.connection = connection;
    const opts = { ...DEFAULT_OPTIONS, ...options };
    this.options = opts;
    this.client = opts.rpcClient ?? new import_client.JsonRpcClient(this.connection.fullnode);
    this.wsClient = opts.websocketClient ?? new import_websocket_client.WebsocketClient(this.connection.websocket, opts.socketOptions);
  }
  async getRpcApiVersion() {
    if (this.rpcApiVersion && this.cacheExpiry && this.cacheExpiry <= Date.now()) {
      return this.rpcApiVersion;
    }
    try {
      const resp = await this.client.requestWithType("rpc.discover", [], (0, import_superstruct.any)());
      this.rpcApiVersion = resp.info.version;
      this.cacheExpiry = // Date.now() is in milliseconds, but the timeout is in seconds
      Date.now() + (this.options.versionCacheTimeoutInSeconds ?? 0) * 1e3;
      return this.rpcApiVersion;
    } catch (err) {
      console.warn("Error fetching version number of the RPC API", err);
    }
    return void 0;
  }
  /** @deprecated Use `@mysten/sui.js/faucet` instead. */
  async requestSuiFromFaucet(recipient, headers) {
    if (!this.connection.faucet) {
      throw new Error("Faucet URL is not specified");
    }
    return (0, import_faucet.requestSuiFromFaucetV0)({ host: this.connection.faucet, recipient, headers });
  }
  /**
   * Get all Coin<`coin_type`> objects owned by an address.
   */
  async getCoins(input) {
    if (!input.owner || !(0, import_sui_types.isValidSuiAddress)((0, import_sui_types.normalizeSuiAddress)(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getCoins",
      [input.owner, input.coinType, input.cursor, input.limit],
      import_types.PaginatedCoins
    );
  }
  /**
   * Get all Coin objects owned by an address.
   */
  async getAllCoins(input) {
    if (!input.owner || !(0, import_sui_types.isValidSuiAddress)((0, import_sui_types.normalizeSuiAddress)(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getAllCoins",
      [input.owner, input.cursor, input.limit],
      import_types.PaginatedCoins
    );
  }
  /**
   * Get the total coin balance for one coin type, owned by the address owner.
   */
  async getBalance(input) {
    if (!input.owner || !(0, import_sui_types.isValidSuiAddress)((0, import_sui_types.normalizeSuiAddress)(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getBalance",
      [input.owner, input.coinType],
      import_types.CoinBalance
    );
  }
  /**
   * Get the total coin balance for all coin types, owned by the address owner.
   */
  async getAllBalances(input) {
    if (!input.owner || !(0, import_sui_types.isValidSuiAddress)((0, import_sui_types.normalizeSuiAddress)(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getAllBalances",
      [input.owner],
      (0, import_superstruct.array)(import_types.CoinBalance)
    );
  }
  /**
   * Fetch CoinMetadata for a given coin type
   */
  async getCoinMetadata(input) {
    return await this.client.requestWithType(
      "suix_getCoinMetadata",
      [input.coinType],
      import_framework.CoinMetadataStruct
    );
  }
  /**
   *  Fetch total supply for a coin
   */
  async getTotalSupply(input) {
    return await this.client.requestWithType("suix_getTotalSupply", [input.coinType], import_types.CoinSupply);
  }
  /**
   * Invoke any RPC method
   * @param method the method to be invoked
   * @param args the arguments to be passed to the RPC request
   */
  async call(method, params) {
    return await this.client.request(method, params);
  }
  /**
   * Get Move function argument types like read, write and full access
   */
  async getMoveFunctionArgTypes(input) {
    return await this.client.requestWithType(
      "sui_getMoveFunctionArgTypes",
      [input.package, input.module, input.function],
      import_types.SuiMoveFunctionArgTypes
    );
  }
  /**
   * Get a map from module name to
   * structured representations of Move modules
   */
  async getNormalizedMoveModulesByPackage(input) {
    return await this.client.requestWithType(
      "sui_getNormalizedMoveModulesByPackage",
      [input.package],
      import_types.SuiMoveNormalizedModules
    );
  }
  /**
   * Get a structured representation of Move module
   */
  async getNormalizedMoveModule(input) {
    return await this.client.requestWithType(
      "sui_getNormalizedMoveModule",
      [input.package, input.module],
      import_types.SuiMoveNormalizedModule
    );
  }
  /**
   * Get a structured representation of Move function
   */
  async getNormalizedMoveFunction(input) {
    return await this.client.requestWithType(
      "sui_getNormalizedMoveFunction",
      [input.package, input.module, input.function],
      import_types.SuiMoveNormalizedFunction
    );
  }
  /**
   * Get a structured representation of Move struct
   */
  async getNormalizedMoveStruct(input) {
    return await this.client.requestWithType(
      "sui_getNormalizedMoveStruct",
      [input.package, input.module, input.struct],
      import_types.SuiMoveNormalizedStruct
    );
  }
  /**
   * Get all objects owned by an address
   */
  async getOwnedObjects(input) {
    if (!input.owner || !(0, import_sui_types.isValidSuiAddress)((0, import_sui_types.normalizeSuiAddress)(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getOwnedObjects",
      [
        input.owner,
        {
          filter: input.filter,
          options: input.options
        },
        input.cursor,
        input.limit
      ],
      import_types.PaginatedObjectsResponse
    );
  }
  /**
   * Get details about an object
   */
  async getObject(input) {
    if (!input.id || !(0, import_sui_types.isValidSuiObjectId)((0, import_sui_types.normalizeSuiObjectId)(input.id))) {
      throw new Error("Invalid Sui Object id");
    }
    return await this.client.requestWithType(
      "sui_getObject",
      [input.id, input.options],
      import_types.SuiObjectResponse
    );
  }
  async tryGetPastObject(input) {
    return await this.client.requestWithType(
      "sui_tryGetPastObject",
      [input.id, input.version, input.options],
      import_types.ObjectRead
    );
  }
  /**
   * Batch get details about a list of objects. If any of the object ids are duplicates the call will fail
   */
  async multiGetObjects(input) {
    input.ids.forEach((id) => {
      if (!id || !(0, import_sui_types.isValidSuiObjectId)((0, import_sui_types.normalizeSuiObjectId)(id))) {
        throw new Error(`Invalid Sui Object id ${id}`);
      }
    });
    const hasDuplicates = input.ids.length !== new Set(input.ids).size;
    if (hasDuplicates) {
      throw new Error(`Duplicate object ids in batch call ${input.ids}`);
    }
    return await this.client.requestWithType(
      "sui_multiGetObjects",
      [input.ids, input.options],
      (0, import_superstruct.array)(import_types.SuiObjectResponse)
    );
  }
  /**
   * Get transaction blocks for a given query criteria
   */
  async queryTransactionBlocks(input) {
    return await this.client.requestWithType(
      "suix_queryTransactionBlocks",
      [
        {
          filter: input.filter,
          options: input.options
        },
        input.cursor,
        input.limit,
        (input.order || "descending") === "descending"
      ],
      import_types.PaginatedTransactionResponse
    );
  }
  async getTransactionBlock(input) {
    if (!(0, import_sui_types.isValidTransactionDigest)(input.digest)) {
      throw new Error("Invalid Transaction digest");
    }
    return await this.client.requestWithType(
      "sui_getTransactionBlock",
      [input.digest, input.options],
      import_types.SuiTransactionBlockResponse
    );
  }
  async multiGetTransactionBlocks(input) {
    input.digests.forEach((d) => {
      if (!(0, import_sui_types.isValidTransactionDigest)(d)) {
        throw new Error(`Invalid Transaction digest ${d}`);
      }
    });
    const hasDuplicates = input.digests.length !== new Set(input.digests).size;
    if (hasDuplicates) {
      throw new Error(`Duplicate digests in batch call ${input.digests}`);
    }
    return await this.client.requestWithType(
      "sui_multiGetTransactionBlocks",
      [input.digests, input.options],
      (0, import_superstruct.array)(import_types.SuiTransactionBlockResponse)
    );
  }
  async executeTransactionBlock(input) {
    return await this.client.requestWithType(
      "sui_executeTransactionBlock",
      [
        typeof input.transactionBlock === "string" ? input.transactionBlock : (0, import_bcs.toB64)(input.transactionBlock),
        Array.isArray(input.signature) ? input.signature : [input.signature],
        input.options,
        input.requestType
      ],
      import_types.SuiTransactionBlockResponse
    );
  }
  /**
   * Get total number of transactions
   */
  async getTotalTransactionBlocks() {
    const resp = await this.client.requestWithType("sui_getTotalTransactionBlocks", [], (0, import_superstruct.string)());
    return BigInt(resp);
  }
  /**
   * Getting the reference gas price for the network
   */
  async getReferenceGasPrice() {
    const resp = await this.client.requestWithType("suix_getReferenceGasPrice", [], (0, import_superstruct.string)());
    return BigInt(resp);
  }
  /**
   * Return the delegated stakes for an address
   */
  async getStakes(input) {
    if (!input.owner || !(0, import_sui_types.isValidSuiAddress)((0, import_sui_types.normalizeSuiAddress)(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getStakes",
      [input.owner],
      (0, import_superstruct.array)(import_types.DelegatedStake)
    );
  }
  /**
   * Return the delegated stakes queried by id.
   */
  async getStakesByIds(input) {
    input.stakedSuiIds.forEach((id) => {
      if (!id || !(0, import_sui_types.isValidSuiObjectId)((0, import_sui_types.normalizeSuiObjectId)(id))) {
        throw new Error(`Invalid Sui Stake id ${id}`);
      }
    });
    return await this.client.requestWithType(
      "suix_getStakesByIds",
      [input.stakedSuiIds],
      (0, import_superstruct.array)(import_types.DelegatedStake)
    );
  }
  /**
   * Return the latest system state content.
   */
  async getLatestSuiSystemState() {
    return await this.client.requestWithType(
      "suix_getLatestSuiSystemState",
      [],
      import_types.SuiSystemStateSummary
    );
  }
  /**
   * Get events for a given query criteria
   */
  async queryEvents(input) {
    return await this.client.requestWithType(
      "suix_queryEvents",
      [input.query, input.cursor, input.limit, (input.order || "descending") === "descending"],
      import_types.PaginatedEvents
    );
  }
  /**
   * Subscribe to get notifications whenever an event matching the filter occurs
   */
  async subscribeEvent(input) {
    return this.wsClient.request({
      method: "suix_subscribeEvent",
      unsubscribe: "suix_unsubscribeEvent",
      params: [input.filter],
      onMessage: input.onMessage
    });
  }
  async subscribeTransaction(input) {
    return this.wsClient.request({
      method: "suix_subscribeTransaction",
      unsubscribe: "suix_unsubscribeTransaction",
      params: [input.filter],
      onMessage: input.onMessage
    });
  }
  /**
   * Runs the transaction block in dev-inspect mode. Which allows for nearly any
   * transaction (or Move call) with any arguments. Detailed results are
   * provided, including both the transaction effects and any return values.
   */
  async devInspectTransactionBlock(input) {
    let devInspectTxBytes;
    if ((0, import_builder.isTransactionBlock)(input.transactionBlock)) {
      input.transactionBlock.setSenderIfNotSet(input.sender);
      devInspectTxBytes = (0, import_bcs.toB64)(
        await input.transactionBlock.build({
          provider: this,
          onlyTransactionKind: true
        })
      );
    } else if (typeof input.transactionBlock === "string") {
      devInspectTxBytes = input.transactionBlock;
    } else if (input.transactionBlock instanceof Uint8Array) {
      devInspectTxBytes = (0, import_bcs.toB64)(input.transactionBlock);
    } else {
      throw new Error("Unknown transaction block format.");
    }
    return await this.client.requestWithType(
      "sui_devInspectTransactionBlock",
      [input.sender, devInspectTxBytes, input.gasPrice, input.epoch],
      import_types.DevInspectResults
    );
  }
  /**
   * Dry run a transaction block and return the result.
   */
  async dryRunTransactionBlock(input) {
    return await this.client.requestWithType(
      "sui_dryRunTransactionBlock",
      [
        typeof input.transactionBlock === "string" ? input.transactionBlock : (0, import_bcs.toB64)(input.transactionBlock)
      ],
      import_types.DryRunTransactionBlockResponse
    );
  }
  /**
   * Return the list of dynamic field objects owned by an object
   */
  async getDynamicFields(input) {
    if (!input.parentId || !(0, import_sui_types.isValidSuiObjectId)((0, import_sui_types.normalizeSuiObjectId)(input.parentId))) {
      throw new Error("Invalid Sui Object id");
    }
    return await this.client.requestWithType(
      "suix_getDynamicFields",
      [input.parentId, input.cursor, input.limit],
      import_dynamic_fields.DynamicFieldPage
    );
  }
  /**
   * Return the dynamic field object information for a specified object
   */
  async getDynamicFieldObject(input) {
    return await this.client.requestWithType(
      "suix_getDynamicFieldObject",
      [input.parentId, input.name],
      import_types.SuiObjectResponse
    );
  }
  /**
   * Get the sequence number of the latest checkpoint that has been executed
   */
  async getLatestCheckpointSequenceNumber() {
    const resp = await this.client.requestWithType(
      "sui_getLatestCheckpointSequenceNumber",
      [],
      (0, import_superstruct.string)()
    );
    return String(resp);
  }
  /**
   * Returns information about a given checkpoint
   */
  async getCheckpoint(input) {
    return await this.client.requestWithType("sui_getCheckpoint", [input.id], import_types.Checkpoint);
  }
  /**
   * Returns historical checkpoints paginated
   */
  async getCheckpoints(input) {
    const resp = await this.client.requestWithType(
      "sui_getCheckpoints",
      [input.cursor, input?.limit, input.descendingOrder],
      import_checkpoints.CheckpointPage
    );
    return resp;
  }
  /**
   * Return the committee information for the asked epoch
   */
  async getCommitteeInfo(input) {
    return await this.client.requestWithType(
      "suix_getCommitteeInfo",
      [input?.epoch],
      import_types.CommitteeInfo
    );
  }
  async getNetworkMetrics() {
    return await this.client.requestWithType("suix_getNetworkMetrics", [], import_metrics.NetworkMetrics);
  }
  async getAddressMetrics() {
    return await this.client.requestWithType("suix_getLatestAddressMetrics", [], import_metrics.AddressMetrics);
  }
  async getAllEpochAddressMetrics(input) {
    return await this.client.requestWithType(
      "suix_getAllEpochAddressMetrics",
      [input?.descendingOrder],
      import_metrics.AllEpochsAddressMetrics
    );
  }
  /**
   * Return the committee information for the asked epoch
   */
  async getEpochs(input) {
    return await this.client.requestWithType(
      "suix_getEpochs",
      [input?.cursor, input?.limit, input?.descendingOrder],
      import_epochs.EpochPage
    );
  }
  /**
   * Returns list of top move calls by usage
   */
  async getMoveCallMetrics() {
    return await this.client.requestWithType("suix_getMoveCallMetrics", [], import_types.MoveCallMetrics);
  }
  /**
   * Return the committee information for the asked epoch
   */
  async getCurrentEpoch() {
    return await this.client.requestWithType("suix_getCurrentEpoch", [], import_epochs.EpochInfo);
  }
  /**
   * Return the Validators APYs
   */
  async getValidatorsApy() {
    return await this.client.requestWithType("suix_getValidatorsApy", [], import_types.ValidatorsApy);
  }
  // TODO: Migrate this to `sui_getChainIdentifier` once it is widely available.
  async getChainIdentifier() {
    const checkpoint = await this.getCheckpoint({ id: "0" });
    const bytes = (0, import_bcs.fromB58)(checkpoint.digest);
    return (0, import_bcs.toHEX)(bytes.slice(0, 4));
  }
  async resolveNameServiceAddress(input) {
    return await this.client.requestWithType(
      "suix_resolveNameServiceAddress",
      [input.name],
      (0, import_superstruct.nullable)((0, import_superstruct.string)())
    );
  }
  async resolveNameServiceNames(input) {
    return await this.client.requestWithType(
      "suix_resolveNameServiceNames",
      [input.address],
      import_types.ResolvedNameServiceNames
    );
  }
  async getProtocolConfig(input) {
    return await this.client.requestWithType(
      "sui_getProtocolConfig",
      [input?.version],
      import_types.ProtocolConfig
    );
  }
  /**
   * Wait for a transaction block result to be available over the API.
   * This can be used in conjunction with `executeTransactionBlock` to wait for the transaction to
   * be available via the API.
   * This currently polls the `getTransactionBlock` API to check for the transaction.
   */
  async waitForTransactionBlock({
    signal,
    timeout = 60 * 1e3,
    pollInterval = 2 * 1e3,
    ...input
  }) {
    const timeoutSignal = AbortSignal.timeout(timeout);
    const timeoutPromise = new Promise((_, reject) => {
      timeoutSignal.addEventListener("abort", () => reject(timeoutSignal.reason));
    });
    timeoutPromise.catch(() => {
    });
    while (!timeoutSignal.aborted) {
      signal?.throwIfAborted();
      try {
        return await this.getTransactionBlock(input);
      } catch (e) {
        await Promise.race([
          new Promise((resolve) => setTimeout(resolve, pollInterval)),
          timeoutPromise
        ]);
      }
    }
    timeoutSignal.throwIfAborted();
    throw new Error("Unexpected error while waiting for transaction block.");
  }
}
//# sourceMappingURL=json-rpc-provider.js.map
