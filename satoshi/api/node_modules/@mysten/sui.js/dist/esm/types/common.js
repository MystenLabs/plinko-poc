import { boolean, define, literal, nullable, object, record, string, union } from "superstruct";
const TransactionDigest = string();
const TransactionEffectsDigest = string();
const TransactionEventDigest = string();
const ObjectId = string();
const SuiAddress = string();
const SequenceNumber = string();
const ObjectOwner = union([
  object({
    AddressOwner: string()
  }),
  object({
    ObjectOwner: string()
  }),
  object({
    Shared: object({
      initial_shared_version: nullable(string())
    })
  }),
  literal("Immutable")
]);
const SuiJsonValue = define("SuiJsonValue", () => true);
const ProtocolConfigValue = union([
  object({ u32: string() }),
  object({ u64: string() }),
  object({ f64: string() })
]);
const ProtocolConfig = object({
  attributes: record(string(), nullable(ProtocolConfigValue)),
  featureFlags: record(string(), boolean()),
  maxSupportedProtocolVersion: string(),
  minSupportedProtocolVersion: string(),
  protocolVersion: string()
});
export {
  ObjectId,
  ObjectOwner,
  ProtocolConfig,
  SequenceNumber,
  SuiAddress,
  SuiJsonValue,
  TransactionDigest,
  TransactionEffectsDigest,
  TransactionEventDigest
};
//# sourceMappingURL=common.js.map
