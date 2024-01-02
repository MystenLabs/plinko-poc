import { JsonRpcClient } from "../rpc/client.js";
import {
  PaginatedTransactionResponse,
  SuiMoveFunctionArgTypes,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedModule,
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
  SuiTransactionBlockResponse,
  PaginatedEvents,
  DevInspectResults,
  PaginatedCoins,
  SuiObjectResponse,
  DelegatedStake,
  CoinBalance,
  CoinSupply,
  Checkpoint,
  CommitteeInfo,
  DryRunTransactionBlockResponse,
  SuiSystemStateSummary,
  PaginatedObjectsResponse,
  ValidatorsApy,
  MoveCallMetrics,
  ObjectRead,
  ResolvedNameServiceNames,
  ProtocolConfig
} from "../types/index.js";
import { DynamicFieldPage } from "../types/dynamic_fields.js";
import { DEFAULT_CLIENT_OPTIONS, WebsocketClient } from "../rpc/websocket-client.js";
import { any, array, string, nullable } from "superstruct";
import { fromB58, toB64, toHEX } from "@mysten/bcs";
import { devnetConnection } from "../rpc/connection.js";
import { isTransactionBlock } from "../builder/index.js";
import { CheckpointPage } from "../types/checkpoints.js";
import { NetworkMetrics, AddressMetrics, AllEpochsAddressMetrics } from "../types/metrics.js";
import { EpochInfo, EpochPage } from "../types/epochs.js";
import { requestSuiFromFaucetV0 } from "../faucet/index.js";
import {
  isValidSuiAddress,
  isValidSuiObjectId,
  isValidTransactionDigest,
  normalizeSuiAddress,
  normalizeSuiObjectId
} from "../utils/sui-types.js";
import { CoinMetadataStruct } from "../framework/framework.js";
const DEFAULT_OPTIONS = {
  socketOptions: DEFAULT_CLIENT_OPTIONS,
  versionCacheTimeoutInSeconds: 600
};
class JsonRpcProvider {
  /**
   * Establish a connection to a Sui RPC endpoint
   *
   * @param connection The `Connection` object containing configuration for the network.
   * @param options configuration options for the provider
   */
  constructor(connection = devnetConnection, options = DEFAULT_OPTIONS) {
    this.options = options;
    this.connection = connection;
    const opts = { ...DEFAULT_OPTIONS, ...options };
    this.options = opts;
    this.client = opts.rpcClient ?? new JsonRpcClient(this.connection.fullnode);
    this.wsClient = opts.websocketClient ?? new WebsocketClient(this.connection.websocket, opts.socketOptions);
  }
  async getRpcApiVersion() {
    if (this.rpcApiVersion && this.cacheExpiry && this.cacheExpiry <= Date.now()) {
      return this.rpcApiVersion;
    }
    try {
      const resp = await this.client.requestWithType("rpc.discover", [], any());
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
    return requestSuiFromFaucetV0({ host: this.connection.faucet, recipient, headers });
  }
  /**
   * Get all Coin<`coin_type`> objects owned by an address.
   */
  async getCoins(input) {
    if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getCoins",
      [input.owner, input.coinType, input.cursor, input.limit],
      PaginatedCoins
    );
  }
  /**
   * Get all Coin objects owned by an address.
   */
  async getAllCoins(input) {
    if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getAllCoins",
      [input.owner, input.cursor, input.limit],
      PaginatedCoins
    );
  }
  /**
   * Get the total coin balance for one coin type, owned by the address owner.
   */
  async getBalance(input) {
    if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getBalance",
      [input.owner, input.coinType],
      CoinBalance
    );
  }
  /**
   * Get the total coin balance for all coin types, owned by the address owner.
   */
  async getAllBalances(input) {
    if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getAllBalances",
      [input.owner],
      array(CoinBalance)
    );
  }
  /**
   * Fetch CoinMetadata for a given coin type
   */
  async getCoinMetadata(input) {
    return await this.client.requestWithType(
      "suix_getCoinMetadata",
      [input.coinType],
      CoinMetadataStruct
    );
  }
  /**
   *  Fetch total supply for a coin
   */
  async getTotalSupply(input) {
    return await this.client.requestWithType("suix_getTotalSupply", [input.coinType], CoinSupply);
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
      SuiMoveFunctionArgTypes
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
      SuiMoveNormalizedModules
    );
  }
  /**
   * Get a structured representation of Move module
   */
  async getNormalizedMoveModule(input) {
    return await this.client.requestWithType(
      "sui_getNormalizedMoveModule",
      [input.package, input.module],
      SuiMoveNormalizedModule
    );
  }
  /**
   * Get a structured representation of Move function
   */
  async getNormalizedMoveFunction(input) {
    return await this.client.requestWithType(
      "sui_getNormalizedMoveFunction",
      [input.package, input.module, input.function],
      SuiMoveNormalizedFunction
    );
  }
  /**
   * Get a structured representation of Move struct
   */
  async getNormalizedMoveStruct(input) {
    return await this.client.requestWithType(
      "sui_getNormalizedMoveStruct",
      [input.package, input.module, input.struct],
      SuiMoveNormalizedStruct
    );
  }
  /**
   * Get all objects owned by an address
   */
  async getOwnedObjects(input) {
    if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) {
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
      PaginatedObjectsResponse
    );
  }
  /**
   * Get details about an object
   */
  async getObject(input) {
    if (!input.id || !isValidSuiObjectId(normalizeSuiObjectId(input.id))) {
      throw new Error("Invalid Sui Object id");
    }
    return await this.client.requestWithType(
      "sui_getObject",
      [input.id, input.options],
      SuiObjectResponse
    );
  }
  async tryGetPastObject(input) {
    return await this.client.requestWithType(
      "sui_tryGetPastObject",
      [input.id, input.version, input.options],
      ObjectRead
    );
  }
  /**
   * Batch get details about a list of objects. If any of the object ids are duplicates the call will fail
   */
  async multiGetObjects(input) {
    input.ids.forEach((id) => {
      if (!id || !isValidSuiObjectId(normalizeSuiObjectId(id))) {
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
      array(SuiObjectResponse)
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
      PaginatedTransactionResponse
    );
  }
  async getTransactionBlock(input) {
    if (!isValidTransactionDigest(input.digest)) {
      throw new Error("Invalid Transaction digest");
    }
    return await this.client.requestWithType(
      "sui_getTransactionBlock",
      [input.digest, input.options],
      SuiTransactionBlockResponse
    );
  }
  async multiGetTransactionBlocks(input) {
    input.digests.forEach((d) => {
      if (!isValidTransactionDigest(d)) {
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
      array(SuiTransactionBlockResponse)
    );
  }
  async executeTransactionBlock(input) {
    return await this.client.requestWithType(
      "sui_executeTransactionBlock",
      [
        typeof input.transactionBlock === "string" ? input.transactionBlock : toB64(input.transactionBlock),
        Array.isArray(input.signature) ? input.signature : [input.signature],
        input.options,
        input.requestType
      ],
      SuiTransactionBlockResponse
    );
  }
  /**
   * Get total number of transactions
   */
  async getTotalTransactionBlocks() {
    const resp = await this.client.requestWithType("sui_getTotalTransactionBlocks", [], string());
    return BigInt(resp);
  }
  /**
   * Getting the reference gas price for the network
   */
  async getReferenceGasPrice() {
    const resp = await this.client.requestWithType("suix_getReferenceGasPrice", [], string());
    return BigInt(resp);
  }
  /**
   * Return the delegated stakes for an address
   */
  async getStakes(input) {
    if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) {
      throw new Error("Invalid Sui address");
    }
    return await this.client.requestWithType(
      "suix_getStakes",
      [input.owner],
      array(DelegatedStake)
    );
  }
  /**
   * Return the delegated stakes queried by id.
   */
  async getStakesByIds(input) {
    input.stakedSuiIds.forEach((id) => {
      if (!id || !isValidSuiObjectId(normalizeSuiObjectId(id))) {
        throw new Error(`Invalid Sui Stake id ${id}`);
      }
    });
    return await this.client.requestWithType(
      "suix_getStakesByIds",
      [input.stakedSuiIds],
      array(DelegatedStake)
    );
  }
  /**
   * Return the latest system state content.
   */
  async getLatestSuiSystemState() {
    return await this.client.requestWithType(
      "suix_getLatestSuiSystemState",
      [],
      SuiSystemStateSummary
    );
  }
  /**
   * Get events for a given query criteria
   */
  async queryEvents(input) {
    return await this.client.requestWithType(
      "suix_queryEvents",
      [input.query, input.cursor, input.limit, (input.order || "descending") === "descending"],
      PaginatedEvents
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
    if (isTransactionBlock(input.transactionBlock)) {
      input.transactionBlock.setSenderIfNotSet(input.sender);
      devInspectTxBytes = toB64(
        await input.transactionBlock.build({
          provider: this,
          onlyTransactionKind: true
        })
      );
    } else if (typeof input.transactionBlock === "string") {
      devInspectTxBytes = input.transactionBlock;
    } else if (input.transactionBlock instanceof Uint8Array) {
      devInspectTxBytes = toB64(input.transactionBlock);
    } else {
      throw new Error("Unknown transaction block format.");
    }
    return await this.client.requestWithType(
      "sui_devInspectTransactionBlock",
      [input.sender, devInspectTxBytes, input.gasPrice, input.epoch],
      DevInspectResults
    );
  }
  /**
   * Dry run a transaction block and return the result.
   */
  async dryRunTransactionBlock(input) {
    return await this.client.requestWithType(
      "sui_dryRunTransactionBlock",
      [
        typeof input.transactionBlock === "string" ? input.transactionBlock : toB64(input.transactionBlock)
      ],
      DryRunTransactionBlockResponse
    );
  }
  /**
   * Return the list of dynamic field objects owned by an object
   */
  async getDynamicFields(input) {
    if (!input.parentId || !isValidSuiObjectId(normalizeSuiObjectId(input.parentId))) {
      throw new Error("Invalid Sui Object id");
    }
    return await this.client.requestWithType(
      "suix_getDynamicFields",
      [input.parentId, input.cursor, input.limit],
      DynamicFieldPage
    );
  }
  /**
   * Return the dynamic field object information for a specified object
   */
  async getDynamicFieldObject(input) {
    return await this.client.requestWithType(
      "suix_getDynamicFieldObject",
      [input.parentId, input.name],
      SuiObjectResponse
    );
  }
  /**
   * Get the sequence number of the latest checkpoint that has been executed
   */
  async getLatestCheckpointSequenceNumber() {
    const resp = await this.client.requestWithType(
      "sui_getLatestCheckpointSequenceNumber",
      [],
      string()
    );
    return String(resp);
  }
  /**
   * Returns information about a given checkpoint
   */
  async getCheckpoint(input) {
    return await this.client.requestWithType("sui_getCheckpoint", [input.id], Checkpoint);
  }
  /**
   * Returns historical checkpoints paginated
   */
  async getCheckpoints(input) {
    const resp = await this.client.requestWithType(
      "sui_getCheckpoints",
      [input.cursor, input?.limit, input.descendingOrder],
      CheckpointPage
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
      CommitteeInfo
    );
  }
  async getNetworkMetrics() {
    return await this.client.requestWithType("suix_getNetworkMetrics", [], NetworkMetrics);
  }
  async getAddressMetrics() {
    return await this.client.requestWithType("suix_getLatestAddressMetrics", [], AddressMetrics);
  }
  async getAllEpochAddressMetrics(input) {
    return await this.client.requestWithType(
      "suix_getAllEpochAddressMetrics",
      [input?.descendingOrder],
      AllEpochsAddressMetrics
    );
  }
  /**
   * Return the committee information for the asked epoch
   */
  async getEpochs(input) {
    return await this.client.requestWithType(
      "suix_getEpochs",
      [input?.cursor, input?.limit, input?.descendingOrder],
      EpochPage
    );
  }
  /**
   * Returns list of top move calls by usage
   */
  async getMoveCallMetrics() {
    return await this.client.requestWithType("suix_getMoveCallMetrics", [], MoveCallMetrics);
  }
  /**
   * Return the committee information for the asked epoch
   */
  async getCurrentEpoch() {
    return await this.client.requestWithType("suix_getCurrentEpoch", [], EpochInfo);
  }
  /**
   * Return the Validators APYs
   */
  async getValidatorsApy() {
    return await this.client.requestWithType("suix_getValidatorsApy", [], ValidatorsApy);
  }
  // TODO: Migrate this to `sui_getChainIdentifier` once it is widely available.
  async getChainIdentifier() {
    const checkpoint = await this.getCheckpoint({ id: "0" });
    const bytes = fromB58(checkpoint.digest);
    return toHEX(bytes.slice(0, 4));
  }
  async resolveNameServiceAddress(input) {
    return await this.client.requestWithType(
      "suix_resolveNameServiceAddress",
      [input.name],
      nullable(string())
    );
  }
  async resolveNameServiceNames(input) {
    return await this.client.requestWithType(
      "suix_resolveNameServiceNames",
      [input.address],
      ResolvedNameServiceNames
    );
  }
  async getProtocolConfig(input) {
    return await this.client.requestWithType(
      "sui_getProtocolConfig",
      [input?.version],
      ProtocolConfig
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
export {
  JsonRpcProvider
};
//# sourceMappingURL=json-rpc-provider.js.map
