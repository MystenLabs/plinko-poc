import { fromB64 } from "@mysten/bcs";
import { IntentScope } from "../cryptography/intent.js";
import { messageWithIntent } from "../cryptography/intent.js";
import { blake2b } from "@noble/hashes/blake2b";
import { toSingleSignaturePubkeyPair } from "../cryptography/utils.js";
import { bcs } from "../bcs/index.js";
async function verifyMessage(message, serializedSignature, scope) {
  const signature = toSingleSignaturePubkeyPair(serializedSignature);
  if (scope === IntentScope.PersonalMessage) {
    const messageBytes2 = messageWithIntent(
      scope,
      bcs.ser(["vector", "u8"], typeof message === "string" ? fromB64(message) : message).toBytes()
    );
    if (await signature.pubKey.verify(blake2b(messageBytes2, { dkLen: 32 }), signature.signature)) {
      return true;
    }
    const unwrappedMessageBytes = messageWithIntent(
      scope,
      typeof message === "string" ? fromB64(message) : message
    );
    return signature.pubKey.verify(
      blake2b(unwrappedMessageBytes, { dkLen: 32 }),
      signature.signature
    );
  }
  const messageBytes = messageWithIntent(
    scope,
    typeof message === "string" ? fromB64(message) : message
  );
  return signature.pubKey.verify(blake2b(messageBytes, { dkLen: 32 }), signature.signature);
}
export {
  verifyMessage
};
//# sourceMappingURL=verify.js.map
