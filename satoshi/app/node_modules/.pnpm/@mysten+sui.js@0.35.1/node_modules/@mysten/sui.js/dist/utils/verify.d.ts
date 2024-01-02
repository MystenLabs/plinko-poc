import { IntentScope } from './intent';
import { SerializedSignature } from '../cryptography/signature';
/** Verify data that is signed with the expected scope. */
export declare function verifyMessage(message: Uint8Array | string, serializedSignature: SerializedSignature, scope: IntentScope): Promise<boolean>;
