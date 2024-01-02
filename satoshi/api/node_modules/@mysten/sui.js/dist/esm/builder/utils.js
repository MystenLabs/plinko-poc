import { create as superstructCreate } from "superstruct";
function create(value, struct) {
  return superstructCreate(value, struct);
}
const TRANSACTION_TYPE = Symbol("transaction-argument-type");
export {
  TRANSACTION_TYPE,
  create
};
//# sourceMappingURL=utils.js.map
