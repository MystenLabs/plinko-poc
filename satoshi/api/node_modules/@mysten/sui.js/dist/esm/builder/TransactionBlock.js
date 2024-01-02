var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _blockData, _input, input_fn, _getConfig, getConfig_fn, _validate, validate_fn, _prepareGasPayment, prepareGasPayment_fn, _prepareGasPrice, prepareGasPrice_fn, _prepareTransactions, prepareTransactions_fn, _prepare, prepare_fn;
import { fromB64 } from "@mysten/bcs";
import { is, mask } from "superstruct";
import {
  extractMutableReference,
  extractStructTag,
  getObjectReference,
  SuiObjectRef
} from "../types/index.js";
import { Transactions, TransactionBlockInput, getTransactionType } from "./Transactions.js";
import {
  BuilderCallArg,
  getIdFromCallArg,
  Inputs,
  isMutableSharedObjectInput,
  PureCallArg
} from "./Inputs.js";
import { getPureSerializationType, isTxContext } from "./serializer.js";
import { TransactionBlockDataBuilder } from "./TransactionBlockData.js";
import { TRANSACTION_TYPE, create } from "./utils.js";
import { normalizeSuiObjectId } from "../utils/sui-types.js";
import { SUI_TYPE_ARG } from "../framework/framework.js";
const DefaultOfflineLimits = {
  maxPureArgumentSize: 16 * 1024,
  maxTxGas: 5e10,
  maxGasObjects: 256,
  maxTxSizeBytes: 128 * 1024
};
function createTransactionResult(index) {
  const baseResult = { kind: "Result", index };
  const nestedResults = [];
  const nestedResultFor = (resultIndex) => nestedResults[resultIndex] ?? (nestedResults[resultIndex] = {
    kind: "NestedResult",
    index,
    resultIndex
  });
  return new Proxy(baseResult, {
    set() {
      throw new Error(
        "The transaction result is a proxy, and does not support setting properties directly"
      );
    },
    // TODO: Instead of making this return a concrete argument, we should ideally
    // make it reference-based (so that this gets resolved at build-time), which
    // allows re-ordering transactions.
    get(target, property) {
      if (property in target) {
        return Reflect.get(target, property);
      }
      if (property === Symbol.iterator) {
        return function* () {
          let i = 0;
          while (true) {
            yield nestedResultFor(i);
            i++;
          }
        };
      }
      if (typeof property === "symbol")
        return;
      const resultIndex = parseInt(property, 10);
      if (Number.isNaN(resultIndex) || resultIndex < 0)
        return;
      return nestedResultFor(resultIndex);
    }
  });
}
function expectClient(options) {
  if (!options.client && !options.provider) {
    throw new Error(
      `No provider passed to Transaction#build, but transaction data was not sufficient to build offline.`
    );
  }
  return options.client ?? options.provider;
}
const TRANSACTION_BRAND = Symbol.for("@mysten/transaction");
const LIMITS = {
  // The maximum gas that is allowed.
  maxTxGas: "max_tx_gas",
  // The maximum number of gas objects that can be selected for one transaction.
  maxGasObjects: "max_gas_payment_objects",
  // The maximum size (in bytes) that the transaction can be:
  maxTxSizeBytes: "max_tx_size_bytes",
  // The maximum size (in bytes) that pure arguments can be:
  maxPureArgumentSize: "max_pure_argument_size"
};
const GAS_SAFE_OVERHEAD = 1000n;
const MAX_OBJECTS_PER_FETCH = 50;
const chunk = (arr, size) => Array.from(
  { length: Math.ceil(arr.length / size) },
  (_, i) => arr.slice(i * size, i * size + size)
);
function isTransactionBlock(obj) {
  return !!obj && typeof obj === "object" && obj[TRANSACTION_BRAND] === true;
}
const _TransactionBlock = class _TransactionBlock {
  constructor(transaction) {
    /**
     * Dynamically create a new input, which is separate from the `input`. This is important
     * for generated clients to be able to define unique inputs that are non-overlapping with the
     * defined inputs.
     *
     * For `Uint8Array` type automatically convert the input into a `Pure` CallArg, since this
     * is the format required for custom serialization.
     *
     */
    __privateAdd(this, _input);
    __privateAdd(this, _getConfig);
    __privateAdd(this, _validate);
    // The current default is just picking _all_ coins we can which may not be ideal.
    __privateAdd(this, _prepareGasPayment);
    __privateAdd(this, _prepareGasPrice);
    __privateAdd(this, _prepareTransactions);
    /**
     * Prepare the transaction by valdiating the transaction data and resolving all inputs
     * so that it can be built into bytes.
     */
    __privateAdd(this, _prepare);
    __privateAdd(this, _blockData, void 0);
    __privateSet(this, _blockData, new TransactionBlockDataBuilder(
      transaction ? transaction.blockData : void 0
    ));
  }
  /** Returns `true` if the object is an instance of the Transaction builder class.
   * @deprecated Use `isTransactionBlock` from `@mysten/sui.js/transactions` instead.
   */
  static is(obj) {
    return !!obj && typeof obj === "object" && obj[TRANSACTION_BRAND] === true;
  }
  /**
   * Converts from a serialize transaction kind (built with `build({ onlyTransactionKind: true })`) to a `Transaction` class.
   * Supports either a byte array, or base64-encoded bytes.
   */
  static fromKind(serialized) {
    const tx = new _TransactionBlock();
    __privateSet(tx, _blockData, TransactionBlockDataBuilder.fromKindBytes(
      typeof serialized === "string" ? fromB64(serialized) : serialized
    ));
    return tx;
  }
  /**
   * Converts from a serialized transaction format to a `Transaction` class.
   * There are two supported serialized formats:
   * - A string returned from `Transaction#serialize`. The serialized format must be compatible, or it will throw an error.
   * - A byte array (or base64-encoded bytes) containing BCS transaction data.
   */
  static from(serialized) {
    const tx = new _TransactionBlock();
    if (typeof serialized !== "string" || !serialized.startsWith("{")) {
      __privateSet(tx, _blockData, TransactionBlockDataBuilder.fromBytes(
        typeof serialized === "string" ? fromB64(serialized) : serialized
      ));
    } else {
      __privateSet(tx, _blockData, TransactionBlockDataBuilder.restore(JSON.parse(serialized)));
    }
    return tx;
  }
  /**
   * A helper to retrieve the Transaction builder `Transactions`
   * @deprecated Either use the helper methods on the `TransactionBlock` class, or import `Transactions` from `@mysten/sui.js/transactions`.
   */
  static get Transactions() {
    return Transactions;
  }
  /**
   * A helper to retrieve the Transaction builder `Inputs`
   * * @deprecated Either use the helper methods on the `TransactionBlock` class, or import `Inputs` from `@mysten/sui.js/transactions`.
   */
  static get Inputs() {
    return Inputs;
  }
  setSender(sender) {
    __privateGet(this, _blockData).sender = sender;
  }
  /**
   * Sets the sender only if it has not already been set.
   * This is useful for sponsored transaction flows where the sender may not be the same as the signer address.
   */
  setSenderIfNotSet(sender) {
    if (!__privateGet(this, _blockData).sender) {
      __privateGet(this, _blockData).sender = sender;
    }
  }
  setExpiration(expiration) {
    __privateGet(this, _blockData).expiration = expiration;
  }
  setGasPrice(price) {
    __privateGet(this, _blockData).gasConfig.price = String(price);
  }
  setGasBudget(budget) {
    __privateGet(this, _blockData).gasConfig.budget = String(budget);
  }
  setGasOwner(owner) {
    __privateGet(this, _blockData).gasConfig.owner = owner;
  }
  setGasPayment(payments) {
    __privateGet(this, _blockData).gasConfig.payment = payments.map((payment) => mask(payment, SuiObjectRef));
  }
  /** Get a snapshot of the transaction data, in JSON form: */
  get blockData() {
    return __privateGet(this, _blockData).snapshot();
  }
  // Used to brand transaction classes so that they can be identified, even between multiple copies
  // of the builder.
  get [TRANSACTION_BRAND]() {
    return true;
  }
  /** Returns an argument for the gas coin, to be used in a transaction. */
  get gas() {
    return { kind: "GasCoin" };
  }
  /**
   * Add a new object input to the transaction.
   */
  object(value) {
    const id = getIdFromCallArg(value);
    const inserted = __privateGet(this, _blockData).inputs.find(
      (i) => i.type === "object" && id === getIdFromCallArg(i.value)
    );
    return inserted ?? __privateMethod(this, _input, input_fn).call(this, "object", value);
  }
  /**
   * Add a new object input to the transaction using the fully-resolved object reference.
   * If you only have an object ID, use `builder.object(id)` instead.
   */
  objectRef(...args) {
    return this.object(Inputs.ObjectRef(...args));
  }
  /**
   * Add a new shared object input to the transaction using the fully-resolved shared object reference.
   * If you only have an object ID, use `builder.object(id)` instead.
   */
  sharedObjectRef(...args) {
    return this.object(Inputs.SharedObjectRef(...args));
  }
  /**
   * Add a new non-object input to the transaction.
   */
  pure(value, type) {
    return __privateMethod(this, _input, input_fn).call(this, "pure", value instanceof Uint8Array ? Inputs.Pure(value) : type ? Inputs.Pure(value, type) : value);
  }
  /** Add a transaction to the transaction block. */
  add(transaction) {
    const index = __privateGet(this, _blockData).transactions.push(transaction);
    return createTransactionResult(index - 1);
  }
  // Method shorthands:
  splitCoins(...args) {
    return this.add(Transactions.SplitCoins(...args));
  }
  mergeCoins(...args) {
    return this.add(Transactions.MergeCoins(...args));
  }
  publish(...args) {
    return this.add(Transactions.Publish(...args));
  }
  upgrade(...args) {
    return this.add(Transactions.Upgrade(...args));
  }
  moveCall(...args) {
    return this.add(Transactions.MoveCall(...args));
  }
  transferObjects(...args) {
    return this.add(Transactions.TransferObjects(...args));
  }
  makeMoveVec(...args) {
    return this.add(Transactions.MakeMoveVec(...args));
  }
  /**
   * Serialize the transaction to a string so that it can be sent to a separate context.
   * This is different from `build` in that it does not serialize to BCS bytes, and instead
   * uses a separate format that is unique to the transaction builder. This allows
   * us to serialize partially-complete transactions, that can then be completed and
   * built in a separate context.
   *
   * For example, a dapp can construct a transaction, but not provide gas objects
   * or a gas budget. The transaction then can be sent to the wallet, where this
   * information is automatically filled in (e.g. by querying for coin objects
   * and performing a dry run).
   */
  serialize() {
    return JSON.stringify(__privateGet(this, _blockData).snapshot());
  }
  /** Build the transaction to BCS bytes, and sign it with the provided keypair. */
  async sign(options) {
    const { signer, ...buildOptions } = options;
    const bytes = await this.build(buildOptions);
    return signer.signTransactionBlock(bytes);
  }
  /** Build the transaction to BCS bytes. */
  async build(options = {}) {
    await __privateMethod(this, _prepare, prepare_fn).call(this, options);
    return __privateGet(this, _blockData).build({
      maxSizeBytes: __privateMethod(this, _getConfig, getConfig_fn).call(this, "maxTxSizeBytes", options),
      onlyTransactionKind: options.onlyTransactionKind
    });
  }
  /** Derive transaction digest */
  async getDigest(options = {}) {
    await __privateMethod(this, _prepare, prepare_fn).call(this, options);
    return __privateGet(this, _blockData).getDigest();
  }
};
_blockData = new WeakMap();
_input = new WeakSet();
input_fn = function(type, value) {
  const index = __privateGet(this, _blockData).inputs.length;
  const input = create(
    {
      kind: "Input",
      // bigints can't be serialized to JSON, so just string-convert them here:
      value: typeof value === "bigint" ? String(value) : value,
      index,
      type
    },
    TransactionBlockInput
  );
  __privateGet(this, _blockData).inputs.push(input);
  return input;
};
_getConfig = new WeakSet();
getConfig_fn = function(key, { protocolConfig, limits }) {
  if (limits && typeof limits[key] === "number") {
    return limits[key];
  }
  if (!protocolConfig) {
    return DefaultOfflineLimits[key];
  }
  const attribute = protocolConfig?.attributes[LIMITS[key]];
  if (!attribute) {
    throw new Error(`Missing expected protocol config: "${LIMITS[key]}"`);
  }
  const value = "u64" in attribute ? attribute.u64 : "u32" in attribute ? attribute.u32 : attribute.f64;
  if (!value) {
    throw new Error(`Unexpected protocol config value found for: "${LIMITS[key]}"`);
  }
  return Number(value);
};
_validate = new WeakSet();
validate_fn = function(options) {
  const maxPureArgumentSize = __privateMethod(this, _getConfig, getConfig_fn).call(this, "maxPureArgumentSize", options);
  __privateGet(this, _blockData).inputs.forEach((input, index) => {
    if (is(input.value, PureCallArg)) {
      if (input.value.Pure.length > maxPureArgumentSize) {
        throw new Error(
          `Input at index ${index} is too large, max pure input size is ${maxPureArgumentSize} bytes, got ${input.value.Pure.length} bytes`
        );
      }
    }
  });
};
_prepareGasPayment = new WeakSet();
prepareGasPayment_fn = async function(options) {
  if (__privateGet(this, _blockData).gasConfig.payment) {
    const maxGasObjects = __privateMethod(this, _getConfig, getConfig_fn).call(this, "maxGasObjects", options);
    if (__privateGet(this, _blockData).gasConfig.payment.length > maxGasObjects) {
      throw new Error(`Payment objects exceed maximum amount: ${maxGasObjects}`);
    }
  }
  if (options.onlyTransactionKind || __privateGet(this, _blockData).gasConfig.payment) {
    return;
  }
  const gasOwner = __privateGet(this, _blockData).gasConfig.owner ?? __privateGet(this, _blockData).sender;
  const coins = await expectClient(options).getCoins({
    owner: gasOwner,
    coinType: SUI_TYPE_ARG
  });
  const paymentCoins = coins.data.filter((coin) => {
    const matchingInput = __privateGet(this, _blockData).inputs.find((input) => {
      if (is(input.value, BuilderCallArg) && "Object" in input.value && "ImmOrOwned" in input.value.Object) {
        return coin.coinObjectId === input.value.Object.ImmOrOwned.objectId;
      }
      return false;
    });
    return !matchingInput;
  }).slice(0, __privateMethod(this, _getConfig, getConfig_fn).call(this, "maxGasObjects", options) - 1).map((coin) => ({
    objectId: coin.coinObjectId,
    digest: coin.digest,
    version: coin.version
  }));
  if (!paymentCoins.length) {
    throw new Error("No valid gas coins found for the transaction.");
  }
  this.setGasPayment(paymentCoins);
};
_prepareGasPrice = new WeakSet();
prepareGasPrice_fn = async function(options) {
  if (options.onlyTransactionKind || __privateGet(this, _blockData).gasConfig.price) {
    return;
  }
  this.setGasPrice(await expectClient(options).getReferenceGasPrice());
};
_prepareTransactions = new WeakSet();
prepareTransactions_fn = async function(options) {
  const { inputs, transactions } = __privateGet(this, _blockData);
  const moveModulesToResolve = [];
  const objectsToResolve = [];
  transactions.forEach((transaction) => {
    if (transaction.kind === "MoveCall") {
      const needsResolution = transaction.arguments.some(
        (arg) => arg.kind === "Input" && !is(inputs[arg.index].value, BuilderCallArg)
      );
      if (needsResolution) {
        moveModulesToResolve.push(transaction);
      }
      return;
    }
    const transactionType = getTransactionType(transaction);
    if (!transactionType.schema)
      return;
    Object.entries(transaction).forEach(([key, value]) => {
      if (key === "kind")
        return;
      const keySchema = transactionType.schema[key];
      const isArray = keySchema.type === "array";
      const wellKnownEncoding = isArray ? keySchema.schema[TRANSACTION_TYPE] : keySchema[TRANSACTION_TYPE];
      if (!wellKnownEncoding)
        return;
      const encodeInput = (index) => {
        const input = inputs[index];
        if (!input) {
          throw new Error(`Missing input ${value.index}`);
        }
        if (is(input.value, BuilderCallArg))
          return;
        if (wellKnownEncoding.kind === "object" && typeof input.value === "string") {
          objectsToResolve.push({ id: input.value, input });
        } else if (wellKnownEncoding.kind === "pure") {
          input.value = Inputs.Pure(input.value, wellKnownEncoding.type);
        } else {
          throw new Error("Unexpected input format.");
        }
      };
      if (isArray) {
        value.forEach((arrayItem) => {
          if (arrayItem.kind !== "Input")
            return;
          encodeInput(arrayItem.index);
        });
      } else {
        if (value.kind !== "Input")
          return;
        encodeInput(value.index);
      }
    });
  });
  if (moveModulesToResolve.length) {
    await Promise.all(
      moveModulesToResolve.map(async (moveCall) => {
        const [packageId, moduleName, functionName] = moveCall.target.split("::");
        const normalized = await expectClient(options).getNormalizedMoveFunction({
          package: normalizeSuiObjectId(packageId),
          module: moduleName,
          function: functionName
        });
        const hasTxContext = normalized.parameters.length > 0 && isTxContext(normalized.parameters.at(-1));
        const params = hasTxContext ? normalized.parameters.slice(0, normalized.parameters.length - 1) : normalized.parameters;
        if (params.length !== moveCall.arguments.length) {
          throw new Error("Incorrect number of arguments.");
        }
        params.forEach((param, i) => {
          const arg = moveCall.arguments[i];
          if (arg.kind !== "Input")
            return;
          const input = inputs[arg.index];
          if (is(input.value, BuilderCallArg))
            return;
          const inputValue = input.value;
          const serType = getPureSerializationType(param, inputValue);
          if (serType) {
            input.value = Inputs.Pure(inputValue, serType);
            return;
          }
          const structVal = extractStructTag(param);
          if (structVal != null || typeof param === "object" && "TypeParameter" in param) {
            if (typeof inputValue !== "string") {
              throw new Error(
                `Expect the argument to be an object id string, got ${JSON.stringify(
                  inputValue,
                  null,
                  2
                )}`
              );
            }
            objectsToResolve.push({
              id: inputValue,
              input,
              normalizedType: param
            });
            return;
          }
          throw new Error(
            `Unknown call arg type ${JSON.stringify(param, null, 2)} for value ${JSON.stringify(
              inputValue,
              null,
              2
            )}`
          );
        });
      })
    );
  }
  if (objectsToResolve.length) {
    const dedupedIds = [...new Set(objectsToResolve.map(({ id }) => id))];
    const objectChunks = chunk(dedupedIds, MAX_OBJECTS_PER_FETCH);
    const objects = (await Promise.all(
      objectChunks.map(
        (chunk2) => expectClient(options).multiGetObjects({
          ids: chunk2,
          options: { showOwner: true }
        })
      )
    )).flat();
    let objectsById = new Map(
      dedupedIds.map((id, index) => {
        return [id, objects[index]];
      })
    );
    const invalidObjects = Array.from(objectsById).filter(([_, obj]) => obj.error).map(([id, _]) => id);
    if (invalidObjects.length) {
      throw new Error(`The following input objects are invalid: ${invalidObjects.join(", ")}`);
    }
    objectsToResolve.forEach(({ id, input, normalizedType }) => {
      const object = objectsById.get(id);
      const owner = object.data?.owner;
      const initialSharedVersion = owner && typeof owner === "object" && "Shared" in owner ? owner.Shared.initial_shared_version : void 0;
      if (initialSharedVersion) {
        const mutable = isMutableSharedObjectInput(input.value) || normalizedType != null && extractMutableReference(normalizedType) != null;
        input.value = Inputs.SharedObjectRef({
          objectId: id,
          initialSharedVersion,
          mutable
        });
      } else {
        input.value = Inputs.ObjectRef(getObjectReference(object));
      }
    });
  }
};
_prepare = new WeakSet();
prepare_fn = async function(options) {
  if (!options.onlyTransactionKind && !__privateGet(this, _blockData).sender) {
    throw new Error("Missing transaction sender");
  }
  const client = options.client || options.provider;
  if (!options.protocolConfig && !options.limits && client) {
    options.protocolConfig = await client.getProtocolConfig();
  }
  await Promise.all([__privateMethod(this, _prepareGasPrice, prepareGasPrice_fn).call(this, options), __privateMethod(this, _prepareTransactions, prepareTransactions_fn).call(this, options)]);
  if (!options.onlyTransactionKind) {
    await __privateMethod(this, _prepareGasPayment, prepareGasPayment_fn).call(this, options);
    if (!__privateGet(this, _blockData).gasConfig.budget) {
      const dryRunResult = await expectClient(options).dryRunTransactionBlock({
        transactionBlock: __privateGet(this, _blockData).build({
          maxSizeBytes: __privateMethod(this, _getConfig, getConfig_fn).call(this, "maxTxSizeBytes", options),
          overrides: {
            gasConfig: {
              budget: String(__privateMethod(this, _getConfig, getConfig_fn).call(this, "maxTxGas", options)),
              payment: []
            }
          }
        })
      });
      if (dryRunResult.effects.status.status !== "success") {
        throw new Error(
          `Dry run failed, could not automatically determine a budget: ${dryRunResult.effects.status.error}`,
          { cause: dryRunResult }
        );
      }
      const safeOverhead = GAS_SAFE_OVERHEAD * BigInt(this.blockData.gasConfig.price || 1n);
      const baseComputationCostWithOverhead = BigInt(dryRunResult.effects.gasUsed.computationCost) + safeOverhead;
      const gasBudget = baseComputationCostWithOverhead + BigInt(dryRunResult.effects.gasUsed.storageCost) - BigInt(dryRunResult.effects.gasUsed.storageRebate);
      this.setGasBudget(
        gasBudget > baseComputationCostWithOverhead ? gasBudget : baseComputationCostWithOverhead
      );
    }
  }
  __privateMethod(this, _validate, validate_fn).call(this, options);
};
let TransactionBlock = _TransactionBlock;
export {
  TransactionBlock,
  isTransactionBlock
};
//# sourceMappingURL=TransactionBlock.js.map
