import {
  array,
  number,
  object,
  string,
  tuple,
  boolean,
  optional,
  any,
  nullable
} from "superstruct";
const GasCostSummary = object({
  computationCost: string(),
  storageCost: string(),
  storageRebate: string(),
  nonRefundableStorageFee: string()
});
const CheckPointContentsDigest = string();
const CheckpointDigest = string();
const ECMHLiveObjectSetDigest = object({
  digest: array(number())
});
const CheckpointCommitment = any();
const ValidatorSignature = string();
const EndOfEpochData = object({
  nextEpochCommittee: array(tuple([string(), string()])),
  nextEpochProtocolVersion: string(),
  epochCommitments: array(CheckpointCommitment)
});
const ExecutionDigests = object({
  transaction: string(),
  effects: string()
});
const Checkpoint = object({
  epoch: string(),
  sequenceNumber: string(),
  digest: string(),
  networkTotalTransactions: string(),
  previousDigest: optional(string()),
  epochRollingGasCostSummary: GasCostSummary,
  timestampMs: string(),
  endOfEpochData: optional(EndOfEpochData),
  validatorSignature: string(),
  transactions: array(string()),
  checkpointCommitments: array(CheckpointCommitment)
});
const CheckpointPage = object({
  data: array(Checkpoint),
  nextCursor: nullable(string()),
  hasNextPage: boolean()
});
export {
  CheckPointContentsDigest,
  Checkpoint,
  CheckpointCommitment,
  CheckpointDigest,
  CheckpointPage,
  ECMHLiveObjectSetDigest,
  EndOfEpochData,
  ExecutionDigests,
  GasCostSummary,
  ValidatorSignature
};
//# sourceMappingURL=checkpoints.js.map
