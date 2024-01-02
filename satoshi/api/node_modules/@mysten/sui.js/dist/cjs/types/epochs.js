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
var epochs_exports = {};
__export(epochs_exports, {
  EndOfEpochInfo: () => EndOfEpochInfo,
  EpochInfo: () => EpochInfo,
  EpochPage: () => EpochPage
});
module.exports = __toCommonJS(epochs_exports);
var import_superstruct = require("superstruct");
var import_validator = require("./validator.js");
const EndOfEpochInfo = (0, import_superstruct.object)({
  lastCheckpointId: (0, import_superstruct.string)(),
  epochEndTimestamp: (0, import_superstruct.string)(),
  protocolVersion: (0, import_superstruct.string)(),
  referenceGasPrice: (0, import_superstruct.string)(),
  totalStake: (0, import_superstruct.string)(),
  storageFundReinvestment: (0, import_superstruct.string)(),
  storageCharge: (0, import_superstruct.string)(),
  storageRebate: (0, import_superstruct.string)(),
  storageFundBalance: (0, import_superstruct.string)(),
  stakeSubsidyAmount: (0, import_superstruct.string)(),
  totalGasFees: (0, import_superstruct.string)(),
  totalStakeRewardsDistributed: (0, import_superstruct.string)(),
  leftoverStorageFundInflow: (0, import_superstruct.string)()
});
const EpochInfo = (0, import_superstruct.object)({
  epoch: (0, import_superstruct.string)(),
  validators: (0, import_superstruct.array)(import_validator.SuiValidatorSummary),
  epochTotalTransactions: (0, import_superstruct.string)(),
  firstCheckpointId: (0, import_superstruct.string)(),
  epochStartTimestamp: (0, import_superstruct.string)(),
  endOfEpochInfo: (0, import_superstruct.nullable)(EndOfEpochInfo),
  referenceGasPrice: (0, import_superstruct.nullable)((0, import_superstruct.number)())
});
const EpochPage = (0, import_superstruct.object)({
  data: (0, import_superstruct.array)(EpochInfo),
  nextCursor: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  hasNextPage: (0, import_superstruct.boolean)()
});
//# sourceMappingURL=epochs.js.map
