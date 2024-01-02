import { array, number, object, string } from "superstruct";
const NetworkMetrics = object({
  currentTps: number(),
  tps30Days: number(),
  currentCheckpoint: string(),
  currentEpoch: string(),
  totalAddresses: string(),
  totalObjects: string(),
  totalPackages: string()
});
const AddressMetrics = object({
  checkpoint: number(),
  epoch: number(),
  timestampMs: number(),
  cumulativeAddresses: number(),
  cumulativeActiveAddresses: number(),
  dailyActiveAddresses: number()
});
const AllEpochsAddressMetrics = array(AddressMetrics);
export {
  AddressMetrics,
  AllEpochsAddressMetrics,
  NetworkMetrics
};
//# sourceMappingURL=metrics.js.map
