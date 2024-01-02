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
var transactions_exports = {};
__export(transactions_exports, {
  AuthorityName: () => AuthorityName,
  AuthorityQuorumSignInfo: () => AuthorityQuorumSignInfo,
  AuthoritySignature: () => AuthoritySignature,
  BalanceChange: () => BalanceChange,
  DevInspectResults: () => DevInspectResults,
  DryRunTransactionBlockResponse: () => DryRunTransactionBlockResponse,
  EpochId: () => EpochId,
  ExecutionStatus: () => ExecutionStatus,
  ExecutionStatusType: () => ExecutionStatusType,
  GasCostSummary: () => GasCostSummary,
  GenericAuthoritySignature: () => GenericAuthoritySignature,
  Genesis: () => Genesis,
  MoveCallSuiTransaction: () => MoveCallSuiTransaction,
  OwnedObjectRef: () => OwnedObjectRef,
  PaginatedTransactionResponse: () => PaginatedTransactionResponse,
  ProgrammableTransaction: () => ProgrammableTransaction,
  SuiArgument: () => SuiArgument,
  SuiCallArg: () => SuiCallArg,
  SuiChangeEpoch: () => SuiChangeEpoch,
  SuiConsensusCommitPrologue: () => SuiConsensusCommitPrologue,
  SuiObjectChange: () => SuiObjectChange,
  SuiObjectChangeCreated: () => SuiObjectChangeCreated,
  SuiObjectChangeDeleted: () => SuiObjectChangeDeleted,
  SuiObjectChangeMutated: () => SuiObjectChangeMutated,
  SuiObjectChangePublished: () => SuiObjectChangePublished,
  SuiObjectChangeTransferred: () => SuiObjectChangeTransferred,
  SuiObjectChangeWrapped: () => SuiObjectChangeWrapped,
  SuiTransaction: () => SuiTransaction,
  SuiTransactionBlock: () => SuiTransactionBlock,
  SuiTransactionBlockData: () => SuiTransactionBlockData,
  SuiTransactionBlockKind: () => SuiTransactionBlockKind,
  SuiTransactionBlockResponse: () => SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions: () => SuiTransactionBlockResponseOptions,
  TransactionEffects: () => TransactionEffects,
  TransactionEffectsModifiedAtVersions: () => TransactionEffectsModifiedAtVersions,
  TransactionEvents: () => TransactionEvents,
  getChangeEpochTransaction: () => getChangeEpochTransaction,
  getConsensusCommitPrologueTransaction: () => getConsensusCommitPrologueTransaction,
  getCreatedObjects: () => getCreatedObjects,
  getEvents: () => getEvents,
  getExecutionStatus: () => getExecutionStatus,
  getExecutionStatusError: () => getExecutionStatusError,
  getExecutionStatusGasSummary: () => getExecutionStatusGasSummary,
  getExecutionStatusType: () => getExecutionStatusType,
  getGasData: () => getGasData,
  getNewlyCreatedCoinRefsAfterSplit: () => getNewlyCreatedCoinRefsAfterSplit,
  getObjectChanges: () => getObjectChanges,
  getProgrammableTransaction: () => getProgrammableTransaction,
  getPublishedObjectChanges: () => getPublishedObjectChanges,
  getTimestampFromTransactionResponse: () => getTimestampFromTransactionResponse,
  getTotalGasUsed: () => getTotalGasUsed,
  getTotalGasUsedUpperBound: () => getTotalGasUsedUpperBound,
  getTransaction: () => getTransaction,
  getTransactionDigest: () => getTransactionDigest,
  getTransactionEffects: () => getTransactionEffects,
  getTransactionGasBudget: () => getTransactionGasBudget,
  getTransactionGasObject: () => getTransactionGasObject,
  getTransactionGasPrice: () => getTransactionGasPrice,
  getTransactionKind: () => getTransactionKind,
  getTransactionKindName: () => getTransactionKindName,
  getTransactionSender: () => getTransactionSender,
  getTransactionSignature: () => getTransactionSignature
});
module.exports = __toCommonJS(transactions_exports);
var import_superstruct = require("superstruct");
var import_common = require("./common.js");
var import_events = require("./events.js");
var import_objects = require("./objects.js");
const EpochId = (0, import_superstruct.string)();
const SuiChangeEpoch = (0, import_superstruct.object)({
  epoch: (0, import_superstruct.string)(),
  storage_charge: (0, import_superstruct.string)(),
  computation_charge: (0, import_superstruct.string)(),
  storage_rebate: (0, import_superstruct.string)(),
  epoch_start_timestamp_ms: (0, import_superstruct.optional)((0, import_superstruct.string)())
});
const SuiConsensusCommitPrologue = (0, import_superstruct.object)({
  epoch: (0, import_superstruct.string)(),
  round: (0, import_superstruct.string)(),
  commit_timestamp_ms: (0, import_superstruct.string)()
});
const Genesis = (0, import_superstruct.object)({
  objects: (0, import_superstruct.array)((0, import_superstruct.string)())
});
const SuiArgument = (0, import_superstruct.union)([
  (0, import_superstruct.literal)("GasCoin"),
  (0, import_superstruct.object)({ Input: (0, import_superstruct.number)() }),
  (0, import_superstruct.object)({ Result: (0, import_superstruct.number)() }),
  (0, import_superstruct.object)({ NestedResult: (0, import_superstruct.tuple)([(0, import_superstruct.number)(), (0, import_superstruct.number)()]) })
]);
const MoveCallSuiTransaction = (0, import_superstruct.object)({
  arguments: (0, import_superstruct.optional)((0, import_superstruct.array)(SuiArgument)),
  type_arguments: (0, import_superstruct.optional)((0, import_superstruct.array)((0, import_superstruct.string)())),
  package: (0, import_superstruct.string)(),
  module: (0, import_superstruct.string)(),
  function: (0, import_superstruct.string)()
});
const SuiTransaction = (0, import_superstruct.union)([
  (0, import_superstruct.object)({ MoveCall: MoveCallSuiTransaction }),
  (0, import_superstruct.object)({ TransferObjects: (0, import_superstruct.tuple)([(0, import_superstruct.array)(SuiArgument), SuiArgument]) }),
  (0, import_superstruct.object)({ SplitCoins: (0, import_superstruct.tuple)([SuiArgument, (0, import_superstruct.array)(SuiArgument)]) }),
  (0, import_superstruct.object)({ MergeCoins: (0, import_superstruct.tuple)([SuiArgument, (0, import_superstruct.array)(SuiArgument)]) }),
  (0, import_superstruct.object)({
    Publish: (0, import_superstruct.union)([
      // TODO: Remove this after 0.34 is released:
      (0, import_superstruct.tuple)([import_objects.SuiMovePackage, (0, import_superstruct.array)((0, import_superstruct.string)())]),
      (0, import_superstruct.array)((0, import_superstruct.string)())
    ])
  }),
  (0, import_superstruct.object)({
    Upgrade: (0, import_superstruct.union)([
      // TODO: Remove this after 0.34 is released:
      (0, import_superstruct.tuple)([import_objects.SuiMovePackage, (0, import_superstruct.array)((0, import_superstruct.string)()), (0, import_superstruct.string)(), SuiArgument]),
      (0, import_superstruct.tuple)([(0, import_superstruct.array)((0, import_superstruct.string)()), (0, import_superstruct.string)(), SuiArgument])
    ])
  }),
  (0, import_superstruct.object)({ MakeMoveVec: (0, import_superstruct.tuple)([(0, import_superstruct.nullable)((0, import_superstruct.string)()), (0, import_superstruct.array)(SuiArgument)]) })
]);
const SuiCallArg = (0, import_superstruct.union)([
  (0, import_superstruct.object)({
    type: (0, import_superstruct.literal)("pure"),
    valueType: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
    value: import_common.SuiJsonValue
  }),
  (0, import_superstruct.object)({
    type: (0, import_superstruct.literal)("object"),
    objectType: (0, import_superstruct.literal)("immOrOwnedObject"),
    objectId: (0, import_superstruct.string)(),
    version: (0, import_superstruct.string)(),
    digest: (0, import_superstruct.string)()
  }),
  (0, import_superstruct.object)({
    type: (0, import_superstruct.literal)("object"),
    objectType: (0, import_superstruct.literal)("sharedObject"),
    objectId: (0, import_superstruct.string)(),
    initialSharedVersion: (0, import_superstruct.string)(),
    mutable: (0, import_superstruct.boolean)()
  })
]);
const ProgrammableTransaction = (0, import_superstruct.object)({
  transactions: (0, import_superstruct.array)(SuiTransaction),
  inputs: (0, import_superstruct.array)(SuiCallArg)
});
const SuiTransactionBlockKind = (0, import_superstruct.union)([
  (0, import_superstruct.assign)(SuiChangeEpoch, (0, import_superstruct.object)({ kind: (0, import_superstruct.literal)("ChangeEpoch") })),
  (0, import_superstruct.assign)(
    SuiConsensusCommitPrologue,
    (0, import_superstruct.object)({
      kind: (0, import_superstruct.literal)("ConsensusCommitPrologue")
    })
  ),
  (0, import_superstruct.assign)(Genesis, (0, import_superstruct.object)({ kind: (0, import_superstruct.literal)("Genesis") })),
  (0, import_superstruct.assign)(ProgrammableTransaction, (0, import_superstruct.object)({ kind: (0, import_superstruct.literal)("ProgrammableTransaction") }))
]);
const SuiTransactionBlockData = (0, import_superstruct.object)({
  // Eventually this will become union(literal('v1'), literal('v2'), ...)
  messageVersion: (0, import_superstruct.literal)("v1"),
  transaction: SuiTransactionBlockKind,
  sender: (0, import_superstruct.string)(),
  gasData: import_objects.SuiGasData
});
const AuthoritySignature = (0, import_superstruct.string)();
const GenericAuthoritySignature = (0, import_superstruct.union)([(0, import_superstruct.string)(), (0, import_superstruct.array)((0, import_superstruct.string)())]);
const AuthorityQuorumSignInfo = (0, import_superstruct.object)({
  epoch: (0, import_superstruct.string)(),
  signature: GenericAuthoritySignature,
  signers_map: (0, import_superstruct.array)((0, import_superstruct.number)())
});
const GasCostSummary = (0, import_superstruct.object)({
  computationCost: (0, import_superstruct.string)(),
  storageCost: (0, import_superstruct.string)(),
  storageRebate: (0, import_superstruct.string)(),
  nonRefundableStorageFee: (0, import_superstruct.string)()
});
const ExecutionStatusType = (0, import_superstruct.union)([(0, import_superstruct.literal)("success"), (0, import_superstruct.literal)("failure")]);
const ExecutionStatus = (0, import_superstruct.object)({
  status: ExecutionStatusType,
  error: (0, import_superstruct.optional)((0, import_superstruct.string)())
});
const OwnedObjectRef = (0, import_superstruct.object)({
  owner: import_common.ObjectOwner,
  reference: import_objects.SuiObjectRef
});
const TransactionEffectsModifiedAtVersions = (0, import_superstruct.object)({
  objectId: (0, import_superstruct.string)(),
  sequenceNumber: (0, import_superstruct.string)()
});
const TransactionEffects = (0, import_superstruct.object)({
  // Eventually this will become union(literal('v1'), literal('v2'), ...)
  messageVersion: (0, import_superstruct.literal)("v1"),
  /** The status of the execution */
  status: ExecutionStatus,
  /** The epoch when this transaction was executed */
  executedEpoch: (0, import_superstruct.string)(),
  /** The version that every modified (mutated or deleted) object had before it was modified by this transaction. **/
  modifiedAtVersions: (0, import_superstruct.optional)((0, import_superstruct.array)(TransactionEffectsModifiedAtVersions)),
  gasUsed: GasCostSummary,
  /** The object references of the shared objects used in this transaction. Empty if no shared objects were used. */
  sharedObjects: (0, import_superstruct.optional)((0, import_superstruct.array)(import_objects.SuiObjectRef)),
  /** The transaction digest */
  transactionDigest: (0, import_superstruct.string)(),
  /** ObjectRef and owner of new objects created */
  created: (0, import_superstruct.optional)((0, import_superstruct.array)(OwnedObjectRef)),
  /** ObjectRef and owner of mutated objects, including gas object */
  mutated: (0, import_superstruct.optional)((0, import_superstruct.array)(OwnedObjectRef)),
  /**
   * ObjectRef and owner of objects that are unwrapped in this transaction.
   * Unwrapped objects are objects that were wrapped into other objects in the past,
   * and just got extracted out.
   */
  unwrapped: (0, import_superstruct.optional)((0, import_superstruct.array)(OwnedObjectRef)),
  /** Object Refs of objects now deleted (the old refs) */
  deleted: (0, import_superstruct.optional)((0, import_superstruct.array)(import_objects.SuiObjectRef)),
  /** Object Refs of objects now deleted (the old refs) */
  unwrappedThenDeleted: (0, import_superstruct.optional)((0, import_superstruct.array)(import_objects.SuiObjectRef)),
  /** Object refs of objects now wrapped in other objects */
  wrapped: (0, import_superstruct.optional)((0, import_superstruct.array)(import_objects.SuiObjectRef)),
  /**
   * The updated gas object reference. Have a dedicated field for convenient access.
   * It's also included in mutated.
   */
  gasObject: OwnedObjectRef,
  /** The events emitted during execution. Note that only successful transactions emit events */
  eventsDigest: (0, import_superstruct.nullable)((0, import_superstruct.optional)((0, import_superstruct.string)())),
  /** The set of transaction digests this transaction depends on */
  dependencies: (0, import_superstruct.optional)((0, import_superstruct.array)((0, import_superstruct.string)()))
});
const TransactionEvents = (0, import_superstruct.array)(import_events.SuiEvent);
const ReturnValueType = (0, import_superstruct.tuple)([(0, import_superstruct.array)((0, import_superstruct.number)()), (0, import_superstruct.string)()]);
const MutableReferenceOutputType = (0, import_superstruct.tuple)([SuiArgument, (0, import_superstruct.array)((0, import_superstruct.number)()), (0, import_superstruct.string)()]);
const ExecutionResultType = (0, import_superstruct.object)({
  mutableReferenceOutputs: (0, import_superstruct.optional)((0, import_superstruct.array)(MutableReferenceOutputType)),
  returnValues: (0, import_superstruct.optional)((0, import_superstruct.array)(ReturnValueType))
});
const DevInspectResults = (0, import_superstruct.object)({
  effects: TransactionEffects,
  events: TransactionEvents,
  results: (0, import_superstruct.optional)((0, import_superstruct.array)(ExecutionResultType)),
  error: (0, import_superstruct.optional)((0, import_superstruct.string)())
});
const AuthorityName = (0, import_superstruct.string)();
const SuiTransactionBlock = (0, import_superstruct.object)({
  data: SuiTransactionBlockData,
  txSignatures: (0, import_superstruct.array)((0, import_superstruct.string)())
});
const SuiObjectChangePublished = (0, import_superstruct.object)({
  type: (0, import_superstruct.literal)("published"),
  packageId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.string)(),
  digest: (0, import_superstruct.string)(),
  modules: (0, import_superstruct.array)((0, import_superstruct.string)())
});
const SuiObjectChangeTransferred = (0, import_superstruct.object)({
  type: (0, import_superstruct.literal)("transferred"),
  sender: (0, import_superstruct.string)(),
  recipient: import_common.ObjectOwner,
  objectType: (0, import_superstruct.string)(),
  objectId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.string)(),
  digest: (0, import_superstruct.string)()
});
const SuiObjectChangeMutated = (0, import_superstruct.object)({
  type: (0, import_superstruct.literal)("mutated"),
  sender: (0, import_superstruct.string)(),
  owner: import_common.ObjectOwner,
  objectType: (0, import_superstruct.string)(),
  objectId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.string)(),
  previousVersion: (0, import_superstruct.string)(),
  digest: (0, import_superstruct.string)()
});
const SuiObjectChangeDeleted = (0, import_superstruct.object)({
  type: (0, import_superstruct.literal)("deleted"),
  sender: (0, import_superstruct.string)(),
  objectType: (0, import_superstruct.string)(),
  objectId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.string)()
});
const SuiObjectChangeWrapped = (0, import_superstruct.object)({
  type: (0, import_superstruct.literal)("wrapped"),
  sender: (0, import_superstruct.string)(),
  objectType: (0, import_superstruct.string)(),
  objectId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.string)()
});
const SuiObjectChangeCreated = (0, import_superstruct.object)({
  type: (0, import_superstruct.literal)("created"),
  sender: (0, import_superstruct.string)(),
  owner: import_common.ObjectOwner,
  objectType: (0, import_superstruct.string)(),
  objectId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.string)(),
  digest: (0, import_superstruct.string)()
});
const SuiObjectChange = (0, import_superstruct.union)([
  SuiObjectChangePublished,
  SuiObjectChangeTransferred,
  SuiObjectChangeMutated,
  SuiObjectChangeDeleted,
  SuiObjectChangeWrapped,
  SuiObjectChangeCreated
]);
const BalanceChange = (0, import_superstruct.object)({
  owner: import_common.ObjectOwner,
  coinType: (0, import_superstruct.string)(),
  /* Coin balance change(positive means receive, negative means send) */
  amount: (0, import_superstruct.string)()
});
const SuiTransactionBlockResponse = (0, import_superstruct.object)({
  digest: (0, import_superstruct.string)(),
  transaction: (0, import_superstruct.optional)(SuiTransactionBlock),
  effects: (0, import_superstruct.optional)(TransactionEffects),
  events: (0, import_superstruct.optional)(TransactionEvents),
  timestampMs: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  checkpoint: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  confirmedLocalExecution: (0, import_superstruct.optional)((0, import_superstruct.boolean)()),
  objectChanges: (0, import_superstruct.optional)((0, import_superstruct.array)(SuiObjectChange)),
  balanceChanges: (0, import_superstruct.optional)((0, import_superstruct.array)(BalanceChange)),
  /* Errors that occurred in fetching/serializing the transaction. */
  errors: (0, import_superstruct.optional)((0, import_superstruct.array)((0, import_superstruct.string)()))
});
const SuiTransactionBlockResponseOptions = (0, import_superstruct.object)({
  /* Whether to show transaction input data. Default to be false. */
  showInput: (0, import_superstruct.optional)((0, import_superstruct.boolean)()),
  /* Whether to show transaction effects. Default to be false. */
  showEffects: (0, import_superstruct.optional)((0, import_superstruct.boolean)()),
  /* Whether to show transaction events. Default to be false. */
  showEvents: (0, import_superstruct.optional)((0, import_superstruct.boolean)()),
  /* Whether to show object changes. Default to be false. */
  showObjectChanges: (0, import_superstruct.optional)((0, import_superstruct.boolean)()),
  /* Whether to show coin balance changes. Default to be false. */
  showBalanceChanges: (0, import_superstruct.optional)((0, import_superstruct.boolean)())
});
const PaginatedTransactionResponse = (0, import_superstruct.object)({
  data: (0, import_superstruct.array)(SuiTransactionBlockResponse),
  nextCursor: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  hasNextPage: (0, import_superstruct.boolean)()
});
const DryRunTransactionBlockResponse = (0, import_superstruct.object)({
  effects: TransactionEffects,
  events: TransactionEvents,
  objectChanges: (0, import_superstruct.array)(SuiObjectChange),
  balanceChanges: (0, import_superstruct.array)(BalanceChange),
  // TODO: Remove optional when this is rolled out to all networks:
  input: (0, import_superstruct.optional)(SuiTransactionBlockData)
});
function getTransaction(tx) {
  return tx.transaction;
}
function getTransactionDigest(tx) {
  return tx.digest;
}
function getTransactionSignature(tx) {
  return tx.transaction?.txSignatures;
}
function getTransactionSender(tx) {
  return tx.transaction?.data.sender;
}
function getGasData(tx) {
  return tx.transaction?.data.gasData;
}
function getTransactionGasObject(tx) {
  return getGasData(tx)?.payment;
}
function getTransactionGasPrice(tx) {
  return getGasData(tx)?.price;
}
function getTransactionGasBudget(tx) {
  return getGasData(tx)?.budget;
}
function getChangeEpochTransaction(data) {
  return data.kind === "ChangeEpoch" ? data : void 0;
}
function getConsensusCommitPrologueTransaction(data) {
  return data.kind === "ConsensusCommitPrologue" ? data : void 0;
}
function getTransactionKind(data) {
  return data.transaction?.data.transaction;
}
function getTransactionKindName(data) {
  return data.kind;
}
function getProgrammableTransaction(data) {
  return data.kind === "ProgrammableTransaction" ? data : void 0;
}
function getExecutionStatusType(data) {
  return getExecutionStatus(data)?.status;
}
function getExecutionStatus(data) {
  return getTransactionEffects(data)?.status;
}
function getExecutionStatusError(data) {
  return getExecutionStatus(data)?.error;
}
function getExecutionStatusGasSummary(data) {
  if ((0, import_superstruct.is)(data, TransactionEffects)) {
    return data.gasUsed;
  }
  return getTransactionEffects(data)?.gasUsed;
}
function getTotalGasUsed(data) {
  const gasSummary = getExecutionStatusGasSummary(data);
  return gasSummary ? BigInt(gasSummary.computationCost) + BigInt(gasSummary.storageCost) - BigInt(gasSummary.storageRebate) : void 0;
}
function getTotalGasUsedUpperBound(data) {
  const gasSummary = getExecutionStatusGasSummary(data);
  return gasSummary ? BigInt(gasSummary.computationCost) + BigInt(gasSummary.storageCost) : void 0;
}
function getTransactionEffects(data) {
  return data.effects;
}
function getEvents(data) {
  return data.events;
}
function getCreatedObjects(data) {
  return getTransactionEffects(data)?.created;
}
function getTimestampFromTransactionResponse(data) {
  return data.timestampMs ?? void 0;
}
function getNewlyCreatedCoinRefsAfterSplit(data) {
  return getTransactionEffects(data)?.created?.map((c) => c.reference);
}
function getObjectChanges(data) {
  return data.objectChanges;
}
function getPublishedObjectChanges(data) {
  return data.objectChanges?.filter(
    (a) => (0, import_superstruct.is)(a, SuiObjectChangePublished)
  ) ?? [];
}
//# sourceMappingURL=transactions.js.map
