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
var validator_exports = {};
__export(validator_exports, {
  Apy: () => Apy,
  Balance: () => Balance,
  CommitteeInfo: () => CommitteeInfo,
  Contents: () => Contents,
  ContentsFields: () => ContentsFields,
  ContentsFieldsWithdraw: () => ContentsFieldsWithdraw,
  DelegatedStake: () => DelegatedStake,
  DelegationStakingPool: () => DelegationStakingPool,
  DelegationStakingPoolFields: () => DelegationStakingPoolFields,
  StakeObject: () => StakeObject,
  StakeSubsidy: () => StakeSubsidy,
  StakeSubsidyFields: () => StakeSubsidyFields,
  SuiSupplyFields: () => SuiSupplyFields,
  SuiSystemStateSummary: () => SuiSystemStateSummary,
  SuiValidatorSummary: () => SuiValidatorSummary,
  Validators: () => Validators,
  ValidatorsApy: () => ValidatorsApy
});
module.exports = __toCommonJS(validator_exports);
var import_superstruct = require("superstruct");
const Apy = (0, import_superstruct.object)({
  apy: (0, import_superstruct.number)(),
  address: (0, import_superstruct.string)()
});
const ValidatorsApy = (0, import_superstruct.object)({
  epoch: (0, import_superstruct.string)(),
  apys: (0, import_superstruct.array)(Apy)
});
const Balance = (0, import_superstruct.object)({
  value: (0, import_superstruct.number)()
});
const StakeObject = (0, import_superstruct.object)({
  stakedSuiId: (0, import_superstruct.string)(),
  stakeRequestEpoch: (0, import_superstruct.string)(),
  stakeActiveEpoch: (0, import_superstruct.string)(),
  principal: (0, import_superstruct.string)(),
  status: (0, import_superstruct.union)([(0, import_superstruct.literal)("Active"), (0, import_superstruct.literal)("Pending"), (0, import_superstruct.literal)("Unstaked")]),
  estimatedReward: (0, import_superstruct.optional)((0, import_superstruct.string)())
});
const DelegatedStake = (0, import_superstruct.object)({
  validatorAddress: (0, import_superstruct.string)(),
  stakingPool: (0, import_superstruct.string)(),
  stakes: (0, import_superstruct.array)(StakeObject)
});
const StakeSubsidyFields = (0, import_superstruct.object)({
  balance: (0, import_superstruct.object)({ value: (0, import_superstruct.number)() }),
  distribution_counter: (0, import_superstruct.number)(),
  current_distribution_amount: (0, import_superstruct.number)(),
  stake_subsidy_period_length: (0, import_superstruct.number)(),
  stake_subsidy_decrease_rate: (0, import_superstruct.number)()
});
const StakeSubsidy = (0, import_superstruct.object)({
  type: (0, import_superstruct.string)(),
  fields: StakeSubsidyFields
});
const SuiSupplyFields = (0, import_superstruct.object)({
  value: (0, import_superstruct.number)()
});
const ContentsFields = (0, import_superstruct.object)({
  id: (0, import_superstruct.string)(),
  size: (0, import_superstruct.number)(),
  head: (0, import_superstruct.object)({ vec: (0, import_superstruct.array)() }),
  tail: (0, import_superstruct.object)({ vec: (0, import_superstruct.array)() })
});
const ContentsFieldsWithdraw = (0, import_superstruct.object)({
  id: (0, import_superstruct.string)(),
  size: (0, import_superstruct.number)()
});
const Contents = (0, import_superstruct.object)({
  type: (0, import_superstruct.string)(),
  fields: ContentsFields
});
const DelegationStakingPoolFields = (0, import_superstruct.object)({
  exchangeRates: (0, import_superstruct.object)({
    id: (0, import_superstruct.string)(),
    size: (0, import_superstruct.number)()
  }),
  id: (0, import_superstruct.string)(),
  pendingStake: (0, import_superstruct.number)(),
  pendingPoolTokenWithdraw: (0, import_superstruct.number)(),
  pendingTotalSuiWithdraw: (0, import_superstruct.number)(),
  poolTokenBalance: (0, import_superstruct.number)(),
  rewardsPool: (0, import_superstruct.object)({ value: (0, import_superstruct.number)() }),
  activationEpoch: (0, import_superstruct.object)({ vec: (0, import_superstruct.array)() }),
  deactivationEpoch: (0, import_superstruct.object)({ vec: (0, import_superstruct.array)() }),
  suiBalance: (0, import_superstruct.number)()
});
const DelegationStakingPool = (0, import_superstruct.object)({
  type: (0, import_superstruct.string)(),
  fields: DelegationStakingPoolFields
});
const Validators = (0, import_superstruct.array)((0, import_superstruct.tuple)([(0, import_superstruct.string)(), (0, import_superstruct.string)()]));
const CommitteeInfo = (0, import_superstruct.object)({
  epoch: (0, import_superstruct.string)(),
  /** Array of (validator public key, stake unit) tuple */
  validators: Validators
});
const SuiValidatorSummary = (0, import_superstruct.object)({
  suiAddress: (0, import_superstruct.string)(),
  protocolPubkeyBytes: (0, import_superstruct.string)(),
  networkPubkeyBytes: (0, import_superstruct.string)(),
  workerPubkeyBytes: (0, import_superstruct.string)(),
  proofOfPossessionBytes: (0, import_superstruct.string)(),
  operationCapId: (0, import_superstruct.string)(),
  name: (0, import_superstruct.string)(),
  description: (0, import_superstruct.string)(),
  imageUrl: (0, import_superstruct.string)(),
  projectUrl: (0, import_superstruct.string)(),
  p2pAddress: (0, import_superstruct.string)(),
  netAddress: (0, import_superstruct.string)(),
  primaryAddress: (0, import_superstruct.string)(),
  workerAddress: (0, import_superstruct.string)(),
  nextEpochProtocolPubkeyBytes: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  nextEpochProofOfPossession: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  nextEpochNetworkPubkeyBytes: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  nextEpochWorkerPubkeyBytes: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  nextEpochNetAddress: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  nextEpochP2pAddress: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  nextEpochPrimaryAddress: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  nextEpochWorkerAddress: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  votingPower: (0, import_superstruct.string)(),
  gasPrice: (0, import_superstruct.string)(),
  commissionRate: (0, import_superstruct.string)(),
  nextEpochStake: (0, import_superstruct.string)(),
  nextEpochGasPrice: (0, import_superstruct.string)(),
  nextEpochCommissionRate: (0, import_superstruct.string)(),
  stakingPoolId: (0, import_superstruct.string)(),
  stakingPoolActivationEpoch: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  stakingPoolDeactivationEpoch: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  stakingPoolSuiBalance: (0, import_superstruct.string)(),
  rewardsPool: (0, import_superstruct.string)(),
  poolTokenBalance: (0, import_superstruct.string)(),
  pendingStake: (0, import_superstruct.string)(),
  pendingPoolTokenWithdraw: (0, import_superstruct.string)(),
  pendingTotalSuiWithdraw: (0, import_superstruct.string)(),
  exchangeRatesId: (0, import_superstruct.string)(),
  exchangeRatesSize: (0, import_superstruct.string)()
});
const SuiSystemStateSummary = (0, import_superstruct.object)({
  epoch: (0, import_superstruct.string)(),
  protocolVersion: (0, import_superstruct.string)(),
  systemStateVersion: (0, import_superstruct.string)(),
  storageFundTotalObjectStorageRebates: (0, import_superstruct.string)(),
  storageFundNonRefundableBalance: (0, import_superstruct.string)(),
  referenceGasPrice: (0, import_superstruct.string)(),
  safeMode: (0, import_superstruct.boolean)(),
  safeModeStorageRewards: (0, import_superstruct.string)(),
  safeModeComputationRewards: (0, import_superstruct.string)(),
  safeModeStorageRebates: (0, import_superstruct.string)(),
  safeModeNonRefundableStorageFee: (0, import_superstruct.string)(),
  epochStartTimestampMs: (0, import_superstruct.string)(),
  epochDurationMs: (0, import_superstruct.string)(),
  stakeSubsidyStartEpoch: (0, import_superstruct.string)(),
  maxValidatorCount: (0, import_superstruct.string)(),
  minValidatorJoiningStake: (0, import_superstruct.string)(),
  validatorLowStakeThreshold: (0, import_superstruct.string)(),
  validatorVeryLowStakeThreshold: (0, import_superstruct.string)(),
  validatorLowStakeGracePeriod: (0, import_superstruct.string)(),
  stakeSubsidyBalance: (0, import_superstruct.string)(),
  stakeSubsidyDistributionCounter: (0, import_superstruct.string)(),
  stakeSubsidyCurrentDistributionAmount: (0, import_superstruct.string)(),
  stakeSubsidyPeriodLength: (0, import_superstruct.string)(),
  stakeSubsidyDecreaseRate: (0, import_superstruct.number)(),
  totalStake: (0, import_superstruct.string)(),
  activeValidators: (0, import_superstruct.array)(SuiValidatorSummary),
  pendingActiveValidatorsId: (0, import_superstruct.string)(),
  pendingActiveValidatorsSize: (0, import_superstruct.string)(),
  pendingRemovals: (0, import_superstruct.array)((0, import_superstruct.string)()),
  stakingPoolMappingsId: (0, import_superstruct.string)(),
  stakingPoolMappingsSize: (0, import_superstruct.string)(),
  inactivePoolsId: (0, import_superstruct.string)(),
  inactivePoolsSize: (0, import_superstruct.string)(),
  validatorCandidatesId: (0, import_superstruct.string)(),
  validatorCandidatesSize: (0, import_superstruct.string)(),
  atRiskValidators: (0, import_superstruct.array)((0, import_superstruct.tuple)([(0, import_superstruct.string)(), (0, import_superstruct.string)()])),
  validatorReportRecords: (0, import_superstruct.array)((0, import_superstruct.tuple)([(0, import_superstruct.string)(), (0, import_superstruct.array)((0, import_superstruct.string)())]))
});
//# sourceMappingURL=validator.js.map
