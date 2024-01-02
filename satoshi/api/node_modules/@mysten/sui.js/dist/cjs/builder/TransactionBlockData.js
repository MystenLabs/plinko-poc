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
var TransactionBlockData_exports = {};
__export(TransactionBlockData_exports, {
  SerializedTransactionDataBuilder: () => SerializedTransactionDataBuilder,
  TransactionBlockDataBuilder: () => TransactionBlockDataBuilder,
  TransactionExpiration: () => TransactionExpiration
});
module.exports = __toCommonJS(TransactionBlockData_exports);
var import_bcs = require("@mysten/bcs");
var import_superstruct = require("superstruct");
var import_hash = require("./hash.js");
var import_types = require("../types/index.js");
var import_bcs2 = require("./bcs.js");
var import_Transactions = require("./Transactions.js");
var import_Inputs = require("./Inputs.js");
var import_utils = require("./utils.js");
var import_sui_types = require("../utils/sui-types.js");
const TransactionExpiration = (0, import_superstruct.optional)(
  (0, import_superstruct.nullable)(
    (0, import_superstruct.union)([(0, import_superstruct.object)({ Epoch: (0, import_superstruct.integer)() }), (0, import_superstruct.object)({ None: (0, import_superstruct.union)([(0, import_superstruct.literal)(true), (0, import_superstruct.literal)(null)]) })])
  )
);
const StringEncodedBigint = (0, import_superstruct.define)("StringEncodedBigint", (val) => {
  if (!["string", "number", "bigint"].includes(typeof val))
    return false;
  try {
    BigInt(val);
    return true;
  } catch {
    return false;
  }
});
const GasConfig = (0, import_superstruct.object)({
  budget: (0, import_superstruct.optional)(StringEncodedBigint),
  price: (0, import_superstruct.optional)(StringEncodedBigint),
  payment: (0, import_superstruct.optional)((0, import_superstruct.array)(import_types.SuiObjectRef)),
  owner: (0, import_superstruct.optional)((0, import_superstruct.string)())
});
const SerializedTransactionDataBuilder = (0, import_superstruct.object)({
  version: (0, import_superstruct.literal)(1),
  sender: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  expiration: TransactionExpiration,
  gasConfig: GasConfig,
  inputs: (0, import_superstruct.array)(import_Transactions.TransactionBlockInput),
  transactions: (0, import_superstruct.array)(import_Transactions.TransactionType)
});
function prepareSuiAddress(address) {
  return (0, import_sui_types.normalizeSuiAddress)(address).replace("0x", "");
}
class TransactionBlockDataBuilder {
  constructor(clone) {
    this.version = 1;
    this.sender = clone?.sender;
    this.expiration = clone?.expiration;
    this.gasConfig = clone?.gasConfig ?? {};
    this.inputs = clone?.inputs ?? [];
    this.transactions = clone?.transactions ?? [];
  }
  static fromKindBytes(bytes) {
    const kind = import_bcs2.builder.de("TransactionKind", bytes);
    const programmableTx = kind?.ProgrammableTransaction;
    if (!programmableTx) {
      throw new Error("Unable to deserialize from bytes.");
    }
    const serialized = (0, import_utils.create)(
      {
        version: 1,
        gasConfig: {},
        inputs: programmableTx.inputs.map(
          (value, index) => (0, import_utils.create)(
            {
              kind: "Input",
              value,
              index,
              type: (0, import_superstruct.is)(value, import_Inputs.PureCallArg) ? "pure" : "object"
            },
            import_Transactions.TransactionBlockInput
          )
        ),
        transactions: programmableTx.transactions
      },
      SerializedTransactionDataBuilder
    );
    return TransactionBlockDataBuilder.restore(serialized);
  }
  static fromBytes(bytes) {
    const rawData = import_bcs2.builder.de("TransactionData", bytes);
    const data = rawData?.V1;
    const programmableTx = data?.kind?.ProgrammableTransaction;
    if (!data || !programmableTx) {
      throw new Error("Unable to deserialize from bytes.");
    }
    const serialized = (0, import_utils.create)(
      {
        version: 1,
        sender: data.sender,
        expiration: data.expiration,
        gasConfig: data.gasData,
        inputs: programmableTx.inputs.map(
          (value, index) => (0, import_utils.create)(
            {
              kind: "Input",
              value,
              index,
              type: (0, import_superstruct.is)(value, import_Inputs.PureCallArg) ? "pure" : "object"
            },
            import_Transactions.TransactionBlockInput
          )
        ),
        transactions: programmableTx.transactions
      },
      SerializedTransactionDataBuilder
    );
    return TransactionBlockDataBuilder.restore(serialized);
  }
  static restore(data) {
    (0, import_superstruct.assert)(data, SerializedTransactionDataBuilder);
    const transactionData = new TransactionBlockDataBuilder();
    Object.assign(transactionData, data);
    return transactionData;
  }
  /**
   * Generate transaction digest.
   *
   * @param bytes BCS serialized transaction data
   * @returns transaction digest.
   */
  static getDigestFromBytes(bytes) {
    const hash = (0, import_hash.hashTypedData)("TransactionData", bytes);
    return (0, import_bcs.toB58)(hash);
  }
  build({
    maxSizeBytes = Infinity,
    overrides,
    onlyTransactionKind
  } = {}) {
    const inputs = this.inputs.map((input) => {
      (0, import_superstruct.assert)(input.value, import_Inputs.BuilderCallArg);
      return input.value;
    });
    const kind = {
      ProgrammableTransaction: {
        inputs,
        transactions: this.transactions
      }
    };
    if (onlyTransactionKind) {
      return import_bcs2.builder.ser("TransactionKind", kind, { maxSize: maxSizeBytes }).toBytes();
    }
    const expiration = overrides?.expiration ?? this.expiration;
    const sender = overrides?.sender ?? this.sender;
    const gasConfig = { ...this.gasConfig, ...overrides?.gasConfig };
    if (!sender) {
      throw new Error("Missing transaction sender");
    }
    if (!gasConfig.budget) {
      throw new Error("Missing gas budget");
    }
    if (!gasConfig.payment) {
      throw new Error("Missing gas payment");
    }
    if (!gasConfig.price) {
      throw new Error("Missing gas price");
    }
    const transactionData = {
      sender: prepareSuiAddress(sender),
      expiration: expiration ? expiration : { None: true },
      gasData: {
        payment: gasConfig.payment,
        owner: prepareSuiAddress(this.gasConfig.owner ?? sender),
        price: BigInt(gasConfig.price),
        budget: BigInt(gasConfig.budget)
      },
      kind: {
        ProgrammableTransaction: {
          inputs,
          transactions: this.transactions
        }
      }
    };
    return import_bcs2.builder.ser("TransactionData", { V1: transactionData }, { maxSize: maxSizeBytes }).toBytes();
  }
  getDigest() {
    const bytes = this.build({ onlyTransactionKind: false });
    return TransactionBlockDataBuilder.getDigestFromBytes(bytes);
  }
  snapshot() {
    return (0, import_utils.create)(this, SerializedTransactionDataBuilder);
  }
}
//# sourceMappingURL=TransactionBlockData.js.map
