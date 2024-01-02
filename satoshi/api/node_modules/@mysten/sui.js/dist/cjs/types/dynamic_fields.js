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
var dynamic_fields_exports = {};
__export(dynamic_fields_exports, {
  DynamicFieldInfo: () => DynamicFieldInfo,
  DynamicFieldName: () => DynamicFieldName,
  DynamicFieldPage: () => DynamicFieldPage,
  DynamicFieldType: () => DynamicFieldType
});
module.exports = __toCommonJS(dynamic_fields_exports);
var import_superstruct = require("superstruct");
const DynamicFieldType = (0, import_superstruct.union)([(0, import_superstruct.literal)("DynamicField"), (0, import_superstruct.literal)("DynamicObject")]);
const DynamicFieldName = (0, import_superstruct.object)({
  type: (0, import_superstruct.string)(),
  value: (0, import_superstruct.any)()
});
const DynamicFieldInfo = (0, import_superstruct.object)({
  name: DynamicFieldName,
  bcsName: (0, import_superstruct.string)(),
  type: DynamicFieldType,
  objectType: (0, import_superstruct.string)(),
  objectId: (0, import_superstruct.string)(),
  version: (0, import_superstruct.number)(),
  digest: (0, import_superstruct.string)()
});
const DynamicFieldPage = (0, import_superstruct.object)({
  data: (0, import_superstruct.array)(DynamicFieldInfo),
  nextCursor: (0, import_superstruct.nullable)((0, import_superstruct.string)()),
  hasNextPage: (0, import_superstruct.boolean)()
});
//# sourceMappingURL=dynamic_fields.js.map
