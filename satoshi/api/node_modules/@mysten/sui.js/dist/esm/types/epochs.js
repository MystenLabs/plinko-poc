import { array, boolean, nullable, number, object, string } from "superstruct";
import { SuiValidatorSummary } from "./validator.js";
const EndOfEpochInfo = object({
  lastCheckpointId: string(),
  epochEndTimestamp: string(),
  protocolVersion: string(),
  referenceGasPrice: string(),
  totalStake: string(),
  storageFundReinvestment: string(),
  storageCharge: string(),
  storageRebate: string(),
  storageFundBalance: string(),
  stakeSubsidyAmount: string(),
  totalGasFees: string(),
  totalStakeRewardsDistributed: string(),
  leftoverStorageFundInflow: string()
});
const EpochInfo = object({
  epoch: string(),
  validators: array(SuiValidatorSummary),
  epochTotalTransactions: string(),
  firstCheckpointId: string(),
  epochStartTimestamp: string(),
  endOfEpochInfo: nullable(EndOfEpochInfo),
  referenceGasPrice: nullable(number())
});
const EpochPage = object({
  data: array(EpochInfo),
  nextCursor: nullable(string()),
  hasNextPage: boolean()
});
export {
  EndOfEpochInfo,
  EpochInfo,
  EpochPage
};
//# sourceMappingURL=epochs.js.map
