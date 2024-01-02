import { IntentScope } from '../cryptography/intent.js';
import type { SerializedSignature } from '../cryptography/signature.js';
/** Verify data that is signed with the expected scope. */
export declare function verifyMessage(message: Uint8Array | string, serializedSignature: SerializedSignature, scope: IntentScope): Promise<boolean>;
