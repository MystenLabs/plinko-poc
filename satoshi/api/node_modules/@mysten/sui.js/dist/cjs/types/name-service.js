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
var name_service_exports = {};
__export(name_service_exports, {
  ResolvedNameServiceNames: () => ResolvedNameServiceNames
});
module.exports = __toCommonJS(name_service_exports);
var import_superstruct = require("superstruct");
const ResolvedNameServiceNames = (0, import_superstruct.object)({
  data: (0, import_superstruct.array)((0, import_superstruct.string)()),
  hasNextPage: (0, import_superstruct.boolean)(),
  nextCursor: (0, import_superstruct.nullable)((0, import_superstruct.string)())
});
//# sourceMappingURL=name-service.js.map
