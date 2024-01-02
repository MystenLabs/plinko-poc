import { PublicKey } from './publickey';
/**
 * A keypair used for signing transactions.
 */
export type SignatureScheme = 'ED25519' | 'Secp256k1';
/**
 * Pair of signature and corresponding public key
 */
export type SignaturePubkeyPair = {
    signatureScheme: SignatureScheme;
    /** Base64-encoded signature */
    signature: Uint8Array;
    /** Base64-encoded public key */
    pubKey: PublicKey;
};
/**
 * (`flag || signature || pubkey` bytes, as base-64 encoded string).
 * Signature is committed to the intent message of the transaction data, as base-64 encoded string.
 */
export type SerializedSignature = string;
export declare const SIGNATURE_SCHEME_TO_FLAG: {
    ED25519: number;
    Secp256k1: number;
};
export declare const SIGNATURE_FLAG_TO_SCHEME: {
    readonly 0: "ED25519";
    readonly 1: "Secp256k1";
};
export declare function toSerializedSignature({ signature, signatureScheme, pubKey, }: SignaturePubkeyPair): SerializedSignature;
export declare function fromSerializedSignature(serializedSignature: SerializedSignature): SignaturePubkeyPair;
