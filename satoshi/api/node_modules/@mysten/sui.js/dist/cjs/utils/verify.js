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
var verify_exports = {};
__export(verify_exports, {
  verifyMessage: () => verifyMessage
});
module.exports = __toCommonJS(verify_exports);
var import_bcs = require("@mysten/bcs");
var import_intent = require("../cryptography/intent.js");
var import_intent2 = require("../cryptography/intent.js");
var import_blake2b = require("@noble/hashes/blake2b");
var import_utils = require("../cryptography/utils.js");
var import_bcs2 = require("../bcs/index.js");
async function verifyMessage(message, serializedSignature, scope) {
  const signature = (0, import_utils.toSingleSignaturePubkeyPair)(serializedSignature);
  if (scope === import_intent.IntentScope.PersonalMessage) {
    const messageBytes2 = (0, import_intent2.messageWithIntent)(
      scope,
      import_bcs2.bcs.ser(["vector", "u8"], typeof message === "string" ? (0, import_bcs.fromB64)(message) : message).toBytes()
    );
    if (await signature.pubKey.verify((0, import_blake2b.blake2b)(messageBytes2, { dkLen: 32 }), signature.signature)) {
      return true;
    }
    const unwrappedMessageBytes = (0, import_intent2.messageWithIntent)(
      scope,
      typeof message === "string" ? (0, import_bcs.fromB64)(message) : message
    );
    return signature.pubKey.verify(
      (0, import_blake2b.blake2b)(unwrappedMessageBytes, { dkLen: 32 }),
      signature.signature
    );
  }
  const messageBytes = (0, import_intent2.messageWithIntent)(
    scope,
    typeof message === "string" ? (0, import_bcs.fromB64)(message) : message
  );
  return signature.pubKey.verify((0, import_blake2b.blake2b)(messageBytes, { dkLen: 32 }), signature.signature);
}
//# sourceMappingURL=verify.js.map
