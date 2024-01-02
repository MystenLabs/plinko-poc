import { array, boolean, nullable, number, object, optional, string } from "superstruct";
const CoinStruct = object({
  coinType: string(),
  // TODO(chris): rename this to objectId
  coinObjectId: string(),
  version: string(),
  digest: string(),
  balance: string(),
  previousTransaction: string()
});
const PaginatedCoins = object({
  data: array(CoinStruct),
  nextCursor: nullable(string()),
  hasNextPage: boolean()
});
const CoinBalance = object({
  coinType: string(),
  coinObjectCount: number(),
  totalBalance: string(),
  lockedBalance: object({
    epochId: optional(number()),
    number: optional(number())
  })
});
const CoinSupply = object({
  value: string()
});
export {
  CoinBalance,
  CoinStruct,
  CoinSupply,
  PaginatedCoins
};
//# sourceMappingURL=coin.js.map
