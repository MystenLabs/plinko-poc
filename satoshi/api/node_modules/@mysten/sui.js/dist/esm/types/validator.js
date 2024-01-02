import {
  array,
  boolean,
  literal,
  number,
  object,
  string,
  union,
  nullable,
  tuple,
  optional
} from "superstruct";
const Apy = object({
  apy: number(),
  address: string()
});
const ValidatorsApy = object({
  epoch: string(),
  apys: array(Apy)
});
const Balance = object({
  value: number()
});
const StakeObject = object({
  stakedSuiId: string(),
  stakeRequestEpoch: string(),
  stakeActiveEpoch: string(),
  principal: string(),
  status: union([literal("Active"), literal("Pending"), literal("Unstaked")]),
  estimatedReward: optional(string())
});
const DelegatedStake = object({
  validatorAddress: string(),
  stakingPool: string(),
  stakes: array(StakeObject)
});
const StakeSubsidyFields = object({
  balance: object({ value: number() }),
  distribution_counter: number(),
  current_distribution_amount: number(),
  stake_subsidy_period_length: number(),
  stake_subsidy_decrease_rate: number()
});
const StakeSubsidy = object({
  type: string(),
  fields: StakeSubsidyFields
});
const SuiSupplyFields = object({
  value: number()
});
const ContentsFields = object({
  id: string(),
  size: number(),
  head: object({ vec: array() }),
  tail: object({ vec: array() })
});
const ContentsFieldsWithdraw = object({
  id: string(),
  size: number()
});
const Contents = object({
  type: string(),
  fields: ContentsFields
});
const DelegationStakingPoolFields = object({
  exchangeRates: object({
    id: string(),
    size: number()
  }),
  id: string(),
  pendingStake: number(),
  pendingPoolTokenWithdraw: number(),
  pendingTotalSuiWithdraw: number(),
  poolTokenBalance: number(),
  rewardsPool: object({ value: number() }),
  activationEpoch: object({ vec: array() }),
  deactivationEpoch: object({ vec: array() }),
  suiBalance: number()
});
const DelegationStakingPool = object({
  type: string(),
  fields: DelegationStakingPoolFields
});
const Validators = array(tuple([string(), string()]));
const CommitteeInfo = object({
  epoch: string(),
  /** Array of (validator public key, stake unit) tuple */
  validators: Validators
});
const SuiValidatorSummary = object({
  suiAddress: string(),
  protocolPubkeyBytes: string(),
  networkPubkeyBytes: string(),
  workerPubkeyBytes: string(),
  proofOfPossessionBytes: string(),
  operationCapId: string(),
  name: string(),
  description: string(),
  imageUrl: string(),
  projectUrl: string(),
  p2pAddress: string(),
  netAddress: string(),
  primaryAddress: string(),
  workerAddress: string(),
  nextEpochProtocolPubkeyBytes: nullable(string()),
  nextEpochProofOfPossession: nullable(string()),
  nextEpochNetworkPubkeyBytes: nullable(string()),
  nextEpochWorkerPubkeyBytes: nullable(string()),
  nextEpochNetAddress: nullable(string()),
  nextEpochP2pAddress: nullable(string()),
  nextEpochPrimaryAddress: nullable(string()),
  nextEpochWorkerAddress: nullable(string()),
  votingPower: string(),
  gasPrice: string(),
  commissionRate: string(),
  nextEpochStake: string(),
  nextEpochGasPrice: string(),
  nextEpochCommissionRate: string(),
  stakingPoolId: string(),
  stakingPoolActivationEpoch: nullable(string()),
  stakingPoolDeactivationEpoch: nullable(string()),
  stakingPoolSuiBalance: string(),
  rewardsPool: string(),
  poolTokenBalance: string(),
  pendingStake: string(),
  pendingPoolTokenWithdraw: string(),
  pendingTotalSuiWithdraw: string(),
  exchangeRatesId: string(),
  exchangeRatesSize: string()
});
const SuiSystemStateSummary = object({
  epoch: string(),
  protocolVersion: string(),
  systemStateVersion: string(),
  storageFundTotalObjectStorageRebates: string(),
  storageFundNonRefundableBalance: string(),
  referenceGasPrice: string(),
  safeMode: boolean(),
  safeModeStorageRewards: string(),
  safeModeComputationRewards: string(),
  safeModeStorageRebates: string(),
  safeModeNonRefundableStorageFee: string(),
  epochStartTimestampMs: string(),
  epochDurationMs: string(),
  stakeSubsidyStartEpoch: string(),
  maxValidatorCount: string(),
  minValidatorJoiningStake: string(),
  validatorLowStakeThreshold: string(),
  validatorVeryLowStakeThreshold: string(),
  validatorLowStakeGracePeriod: string(),
  stakeSubsidyBalance: string(),
  stakeSubsidyDistributionCounter: string(),
  stakeSubsidyCurrentDistributionAmount: string(),
  stakeSubsidyPeriodLength: string(),
  stakeSubsidyDecreaseRate: number(),
  totalStake: string(),
  activeValidators: array(SuiValidatorSummary),
  pendingActiveValidatorsId: string(),
  pendingActiveValidatorsSize: string(),
  pendingRemovals: array(string()),
  stakingPoolMappingsId: string(),
  stakingPoolMappingsSize: string(),
  inactivePoolsId: string(),
  inactivePoolsSize: string(),
  validatorCandidatesId: string(),
  validatorCandidatesSize: string(),
  atRiskValidators: array(tuple([string(), string()])),
  validatorReportRecords: array(tuple([string(), array(string())]))
});
export {
  Apy,
  Balance,
  CommitteeInfo,
  Contents,
  ContentsFields,
  ContentsFieldsWithdraw,
  DelegatedStake,
  DelegationStakingPool,
  DelegationStakingPoolFields,
  StakeObject,
  StakeSubsidy,
  StakeSubsidyFields,
  SuiSupplyFields,
  SuiSystemStateSummary,
  SuiValidatorSummary,
  Validators,
  ValidatorsApy
};
//# sourceMappingURL=validator.js.map
