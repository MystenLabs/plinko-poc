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
var checkpoints_exports = {};
__export(checkpoints_exports, {
  CheckPointContentsDigest: () => CheckPointContentsDigest,
  Checkpoint: () => Checkpoint,
  CheckpointCommitment: () => CheckpointCommitment,
  CheckpointDigest: () => CheckpointDigest,
  CheckpointPage: () => CheckpointPage,
  ECMHLiveObjectSetDigest: () => ECMHLiveObjectSetDigest,
  EndOfEpochData: () => EndOfEpochData,
  ExecutionDigests: () => ExecutionDigests,
  GasCostSummary: () => GasCostSummary,
  ValidatorSignature: () => ValidatorSignature
});
module.exports = __toCommonJS(checkpoints_exports);
var import_superstruct = require("superstruct");
const GasCostSummary = (0, import_superstruct.object)({
  computationCost: (0, import_superstruct.string)(),
  storageCost: (0, import_superstruct.string)(),
  storageRebate: (0, import_superstruct.string)(),
  nonRefundableStorageFee: (0, import_superstruct.string)()
});
const CheckPointContentsDigest = (0, import_superstruct.string)();
const CheckpointDigest = (0, import_superstruct.string)();
const ECMHLiveObjectSetDigest = (0, import_superstruct.object)({
  digest: (0, import_superstruct.array)((0, import_superstruct.number)())
});
const CheckpointCommitment = (0, import_superstruct.any)();
const ValidatorSignature = (0, import_superstruct.string)();
const EndOfEpochData = (0, import_superstruct.object)({
  nextEpochCommittee: (0, import_superstruct.array)((0, import_superstruct.tuple)([(0, import_superstruct.string)(), (0, import_superstruct.string)()])),
  nextEpochProtocolVersion: (0, import_superstruct.string)(),
  epochCommitments: (0, import_superstruct.array)(CheckpointCommitment)
});
const ExecutionDigests = (0, import_superstruct.object)({
  transaction: (0, import_superstruct.string)(),
  effects: (0, import_superstruct.string)()
});
const Checkpoint = (0, import_superstruct.object)({
  epoch: (0, import_superstruct.string)(),
  sequenceNumber: (0, import_superstruct.string)(),
  digest: (0, import_superstruct.string)(),
  networkTotalTransactions: (0, import_superstruct.string)(),
  previousDigest: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  epochRollingGasCostSummary: GasCostSummary,
  timestampMs: (0, import_superstruct.string)(),
  endOfEpochData: (0, import_superstruct.optional)(EndOfEpochData),
  validatorSignature: (0, import_superstruct.string)(),
  transactions: (0, import_superstruct.array)((0, import_superstruct.string)()),
  checkpointCommitments: (0, import_superstruct.array)(CheckpointCommitment)
});
const CheckpointPage = (0, import_superstruct.object)({
  data: (0, import_superstruct.array)(Checkpoint),
  nextCursor: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  hasNextPage: (0, import_superstruct.boolean)()
});
//# sourceMappingURL=checkpoints.js.map
