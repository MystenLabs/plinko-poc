import type { SerializedSignature, SignatureScheme } from './signature.js';
import type { PublicKey } from './publickey.js';
import type { ExportedKeypair, Keypair } from './keypair.js';
/**
 * Pair of signature and corresponding public key
 */
export type SignaturePubkeyPair = {
    signatureScheme: SignatureScheme;
    /** Base64-encoded signature */
    signature: Uint8Array;
    /** Base64-encoded public key */
    pubKey: PublicKey;
    weight?: number;
};
export declare function toParsedSignaturePubkeyPair(serializedSignature: SerializedSignature): SignaturePubkeyPair[];
export declare function toSingleSignaturePubkeyPair(serializedSignature: SerializedSignature): SignaturePubkeyPair;
export declare function publicKeyFromSerialized(schema: SignatureScheme, pubKey: string): PublicKey;
export declare function fromExportedKeypair(keypair: ExportedKeypair): Keypair;
