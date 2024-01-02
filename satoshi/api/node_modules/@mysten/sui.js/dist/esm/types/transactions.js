import {
  is,
  array,
  literal,
  number,
  object,
  optional,
  string,
  union,
  boolean,
  tuple,
  assign,
  nullable
} from "superstruct";
import { ObjectOwner, SuiJsonValue } from "./common.js";
import { SuiEvent } from "./events.js";
import { SuiGasData, SuiMovePackage, SuiObjectRef } from "./objects.js";
const EpochId = string();
const SuiChangeEpoch = object({
  epoch: string(),
  storage_charge: string(),
  computation_charge: string(),
  storage_rebate: string(),
  epoch_start_timestamp_ms: optional(string())
});
const SuiConsensusCommitPrologue = object({
  epoch: string(),
  round: string(),
  commit_timestamp_ms: string()
});
const Genesis = object({
  objects: array(string())
});
const SuiArgument = union([
  literal("GasCoin"),
  object({ Input: number() }),
  object({ Result: number() }),
  object({ NestedResult: tuple([number(), number()]) })
]);
const MoveCallSuiTransaction = object({
  arguments: optional(array(SuiArgument)),
  type_arguments: optional(array(string())),
  package: string(),
  module: string(),
  function: string()
});
const SuiTransaction = union([
  object({ MoveCall: MoveCallSuiTransaction }),
  object({ TransferObjects: tuple([array(SuiArgument), SuiArgument]) }),
  object({ SplitCoins: tuple([SuiArgument, array(SuiArgument)]) }),
  object({ MergeCoins: tuple([SuiArgument, array(SuiArgument)]) }),
  object({
    Publish: union([
      // TODO: Remove this after 0.34 is released:
      tuple([SuiMovePackage, array(string())]),
      array(string())
    ])
  }),
  object({
    Upgrade: union([
      // TODO: Remove this after 0.34 is released:
      tuple([SuiMovePackage, array(string()), string(), SuiArgument]),
      tuple([array(string()), string(), SuiArgument])
    ])
  }),
  object({ MakeMoveVec: tuple([nullable(string()), array(SuiArgument)]) })
]);
const SuiCallArg = union([
  object({
    type: literal("pure"),
    valueType: nullable(string()),
    value: SuiJsonValue
  }),
  object({
    type: literal("object"),
    objectType: literal("immOrOwnedObject"),
    objectId: string(),
    version: string(),
    digest: string()
  }),
  object({
    type: literal("object"),
    objectType: literal("sharedObject"),
    objectId: string(),
    initialSharedVersion: string(),
    mutable: boolean()
  })
]);
const ProgrammableTransaction = object({
  transactions: array(SuiTransaction),
  inputs: array(SuiCallArg)
});
const SuiTransactionBlockKind = union([
  assign(SuiChangeEpoch, object({ kind: literal("ChangeEpoch") })),
  assign(
    SuiConsensusCommitPrologue,
    object({
      kind: literal("ConsensusCommitPrologue")
    })
  ),
  assign(Genesis, object({ kind: literal("Genesis") })),
  assign(ProgrammableTransaction, object({ kind: literal("ProgrammableTransaction") }))
]);
const SuiTransactionBlockData = object({
  // Eventually this will become union(literal('v1'), literal('v2'), ...)
  messageVersion: literal("v1"),
  transaction: SuiTransactionBlockKind,
  sender: string(),
  gasData: SuiGasData
});
const AuthoritySignature = string();
const GenericAuthoritySignature = union([string(), array(string())]);
const AuthorityQuorumSignInfo = object({
  epoch: string(),
  signature: GenericAuthoritySignature,
  signers_map: array(number())
});
const GasCostSummary = object({
  computationCost: string(),
  storageCost: string(),
  storageRebate: string(),
  nonRefundableStorageFee: string()
});
const ExecutionStatusType = union([literal("success"), literal("failure")]);
const ExecutionStatus = object({
  status: ExecutionStatusType,
  error: optional(string())
});
const OwnedObjectRef = object({
  owner: ObjectOwner,
  reference: SuiObjectRef
});
const TransactionEffectsModifiedAtVersions = object({
  objectId: string(),
  sequenceNumber: string()
});
const TransactionEffects = object({
  // Eventually this will become union(literal('v1'), literal('v2'), ...)
  messageVersion: literal("v1"),
  /** The status of the execution */
  status: ExecutionStatus,
  /** The epoch when this transaction was executed */
  executedEpoch: string(),
  /** The version that every modified (mutated or deleted) object had before it was modified by this transaction. **/
  modifiedAtVersions: optional(array(TransactionEffectsModifiedAtVersions)),
  gasUsed: GasCostSummary,
  /** The object references of the shared objects used in this transaction. Empty if no shared objects were used. */
  sharedObjects: optional(array(SuiObjectRef)),
  /** The transaction digest */
  transactionDigest: string(),
  /** ObjectRef and owner of new objects created */
  created: optional(array(OwnedObjectRef)),
  /** ObjectRef and owner of mutated objects, including gas object */
  mutated: optional(array(OwnedObjectRef)),
  /**
   * ObjectRef and owner of objects that are unwrapped in this transaction.
   * Unwrapped objects are objects that were wrapped into other objects in the past,
   * and just got extracted out.
   */
  unwrapped: optional(array(OwnedObjectRef)),
  /** Object Refs of objects now deleted (the old refs) */
  deleted: optional(array(SuiObjectRef)),
  /** Object Refs of objects now deleted (the old refs) */
  unwrappedThenDeleted: optional(array(SuiObjectRef)),
  /** Object refs of objects now wrapped in other objects */
  wrapped: optional(array(SuiObjectRef)),
  /**
   * The updated gas object reference. Have a dedicated field for convenient access.
   * It's also included in mutated.
   */
  gasObject: OwnedObjectRef,
  /** The events emitted during execution. Note that only successful transactions emit events */
  eventsDigest: nullable(optional(string())),
  /** The set of transaction digests this transaction depends on */
  dependencies: optional(array(string()))
});
const TransactionEvents = array(SuiEvent);
const ReturnValueType = tuple([array(number()), string()]);
const MutableReferenceOutputType = tuple([SuiArgument, array(number()), string()]);
const ExecutionResultType = object({
  mutableReferenceOutputs: optional(array(MutableReferenceOutputType)),
  returnValues: optional(array(ReturnValueType))
});
const DevInspectResults = object({
  effects: TransactionEffects,
  events: TransactionEvents,
  results: optional(array(ExecutionResultType)),
  error: optional(string())
});
const AuthorityName = string();
const SuiTransactionBlock = object({
  data: SuiTransactionBlockData,
  txSignatures: array(string())
});
const SuiObjectChangePublished = object({
  type: literal("published"),
  packageId: string(),
  version: string(),
  digest: string(),
  modules: array(string())
});
const SuiObjectChangeTransferred = object({
  type: literal("transferred"),
  sender: string(),
  recipient: ObjectOwner,
  objectType: string(),
  objectId: string(),
  version: string(),
  digest: string()
});
const SuiObjectChangeMutated = object({
  type: literal("mutated"),
  sender: string(),
  owner: ObjectOwner,
  objectType: string(),
  objectId: string(),
  version: string(),
  previousVersion: string(),
  digest: string()
});
const SuiObjectChangeDeleted = object({
  type: literal("deleted"),
  sender: string(),
  objectType: string(),
  objectId: string(),
  version: string()
});
const SuiObjectChangeWrapped = object({
  type: literal("wrapped"),
  sender: string(),
  objectType: string(),
  objectId: string(),
  version: string()
});
const SuiObjectChangeCreated = object({
  type: literal("created"),
  sender: string(),
  owner: ObjectOwner,
  objectType: string(),
  objectId: string(),
  version: string(),
  digest: string()
});
const SuiObjectChange = union([
  SuiObjectChangePublished,
  SuiObjectChangeTransferred,
  SuiObjectChangeMutated,
  SuiObjectChangeDeleted,
  SuiObjectChangeWrapped,
  SuiObjectChangeCreated
]);
const BalanceChange = object({
  owner: ObjectOwner,
  coinType: string(),
  /* Coin balance change(positive means receive, negative means send) */
  amount: string()
});
const SuiTransactionBlockResponse = object({
  digest: string(),
  transaction: optional(SuiTransactionBlock),
  effects: optional(TransactionEffects),
  events: optional(TransactionEvents),
  timestampMs: optional(string()),
  checkpoint: optional(string()),
  confirmedLocalExecution: optional(boolean()),
  objectChanges: optional(array(SuiObjectChange)),
  balanceChanges: optional(array(BalanceChange)),
  /* Errors that occurred in fetching/serializing the transaction. */
  errors: optional(array(string()))
});
const SuiTransactionBlockResponseOptions = object({
  /* Whether to show transaction input data. Default to be false. */
  showInput: optional(boolean()),
  /* Whether to show transaction effects. Default to be false. */
  showEffects: optional(boolean()),
  /* Whether to show transaction events. Default to be false. */
  showEvents: optional(boolean()),
  /* Whether to show object changes. Default to be false. */
  showObjectChanges: optional(boolean()),
  /* Whether to show coin balance changes. Default to be false. */
  showBalanceChanges: optional(boolean())
});
const PaginatedTransactionResponse = object({
  data: array(SuiTransactionBlockResponse),
  nextCursor: nullable(string()),
  hasNextPage: boolean()
});
const DryRunTransactionBlockResponse = object({
  effects: TransactionEffects,
  events: TransactionEvents,
  objectChanges: array(SuiObjectChange),
  balanceChanges: array(BalanceChange),
  // TODO: Remove optional when this is rolled out to all networks:
  input: optional(SuiTransactionBlockData)
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
  if (is(data, TransactionEffects)) {
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
    (a) => is(a, SuiObjectChangePublished)
  ) ?? [];
}
export {
  AuthorityName,
  AuthorityQuorumSignInfo,
  AuthoritySignature,
  BalanceChange,
  DevInspectResults,
  DryRunTransactionBlockResponse,
  EpochId,
  ExecutionStatus,
  ExecutionStatusType,
  GasCostSummary,
  GenericAuthoritySignature,
  Genesis,
  MoveCallSuiTransaction,
  OwnedObjectRef,
  PaginatedTransactionResponse,
  ProgrammableTransaction,
  SuiArgument,
  SuiCallArg,
  SuiChangeEpoch,
  SuiConsensusCommitPrologue,
  SuiObjectChange,
  SuiObjectChangeCreated,
  SuiObjectChangeDeleted,
  SuiObjectChangeMutated,
  SuiObjectChangePublished,
  SuiObjectChangeTransferred,
  SuiObjectChangeWrapped,
  SuiTransaction,
  SuiTransactionBlock,
  SuiTransactionBlockData,
  SuiTransactionBlockKind,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
  TransactionEffects,
  TransactionEffectsModifiedAtVersions,
  TransactionEvents,
  getChangeEpochTransaction,
  getConsensusCommitPrologueTransaction,
  getCreatedObjects,
  getEvents,
  getExecutionStatus,
  getExecutionStatusError,
  getExecutionStatusGasSummary,
  getExecutionStatusType,
  getGasData,
  getNewlyCreatedCoinRefsAfterSplit,
  getObjectChanges,
  getProgrammableTransaction,
  getPublishedObjectChanges,
  getTimestampFromTransactionResponse,
  getTotalGasUsed,
  getTotalGasUsedUpperBound,
  getTransaction,
  getTransactionDigest,
  getTransactionEffects,
  getTransactionGasBudget,
  getTransactionGasObject,
  getTransactionGasPrice,
  getTransactionKind,
  getTransactionKindName,
  getTransactionSender,
  getTransactionSignature
};
//# sourceMappingURL=transactions.js.map
