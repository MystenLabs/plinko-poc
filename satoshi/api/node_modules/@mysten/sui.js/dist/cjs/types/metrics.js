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
var metrics_exports = {};
__export(metrics_exports, {
  AddressMetrics: () => AddressMetrics,
  AllEpochsAddressMetrics: () => AllEpochsAddressMetrics,
  NetworkMetrics: () => NetworkMetrics
});
module.exports = __toCommonJS(metrics_exports);
var import_superstruct = require("superstruct");
const NetworkMetrics = (0, import_superstruct.object)({
  currentTps: (0, import_superstruct.number)(),
  tps30Days: (0, import_superstruct.number)(),
  currentCheckpoint: (0, import_superstruct.string)(),
  currentEpoch: (0, import_superstruct.string)(),
  totalAddresses: (0, import_superstruct.string)(),
  totalObjects: (0, import_superstruct.string)(),
  totalPackages: (0, import_superstruct.string)()
});
const AddressMetrics = (0, import_superstruct.object)({
  checkpoint: (0, import_superstruct.number)(),
  epoch: (0, import_superstruct.number)(),
  timestampMs: (0, import_superstruct.number)(),
  cumulativeAddresses: (0, import_superstruct.number)(),
  cumulativeActiveAddresses: (0, import_superstruct.number)(),
  dailyActiveAddresses: (0, import_superstruct.number)()
});
const AllEpochsAddressMetrics = (0, import_superstruct.array)(AddressMetrics);
//# sourceMappingURL=metrics.js.map
