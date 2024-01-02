import { array, boolean, integer, object, string, union } from "superstruct";
import { SuiObjectRef } from "../types/index.js";
import { builder } from "./bcs.js";
import { normalizeSuiAddress } from "../utils/sui-types.js";
const ObjectArg = union([
  object({ ImmOrOwned: SuiObjectRef }),
  object({
    Shared: object({
      objectId: string(),
      initialSharedVersion: union([integer(), string()]),
      mutable: boolean()
    })
  })
]);
const PureCallArg = object({ Pure: array(integer()) });
const ObjectCallArg = object({ Object: ObjectArg });
const BuilderCallArg = union([PureCallArg, ObjectCallArg]);
const Inputs = {
  Pure(data, type) {
    return {
      Pure: Array.from(
        data instanceof Uint8Array ? data : (
          // NOTE: We explicitly set this to be growable to infinity, because we have maxSize validation at the builder-level:
          builder.ser(type, data, { maxSize: Infinity }).toBytes()
        )
      )
    };
  },
  ObjectRef({ objectId, digest, version }) {
    return {
      Object: {
        ImmOrOwned: {
          digest,
          version,
          objectId: normalizeSuiAddress(objectId)
        }
      }
    };
  },
  SharedObjectRef({ objectId, mutable, initialSharedVersion }) {
    return {
      Object: {
        Shared: {
          mutable,
          initialSharedVersion,
          objectId: normalizeSuiAddress(objectId)
        }
      }
    };
  }
};
function getIdFromCallArg(arg) {
  if (typeof arg === "string") {
    return normalizeSuiAddress(arg);
  }
  if ("ImmOrOwned" in arg.Object) {
    return normalizeSuiAddress(arg.Object.ImmOrOwned.objectId);
  }
  return normalizeSuiAddress(arg.Object.Shared.objectId);
}
function getSharedObjectInput(arg) {
  return typeof arg === "object" && "Object" in arg && "Shared" in arg.Object ? arg.Object.Shared : void 0;
}
function isSharedObjectInput(arg) {
  return !!getSharedObjectInput(arg);
}
function isMutableSharedObjectInput(arg) {
  return getSharedObjectInput(arg)?.mutable ?? false;
}
export {
  BuilderCallArg,
  Inputs,
  ObjectCallArg,
  PureCallArg,
  getIdFromCallArg,
  getSharedObjectInput,
  isMutableSharedObjectInput,
  isSharedObjectInput
};
//# sourceMappingURL=Inputs.js.map
