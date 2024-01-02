import type { Keypair } from '../cryptography/keypair.js';
import type { SerializedSignature } from '../cryptography/signature.js';
import type { JsonRpcProvider } from '../providers/json-rpc-provider.js';
import { SignerWithProvider } from './signer-with-provider.js';
import type { SuiClient } from '../client/index.js';
export declare class RawSigner extends SignerWithProvider {
    private readonly keypair;
    constructor(keypair: Keypair, client: JsonRpcProvider | SuiClient);
    getAddress(): Promise<string>;
    signData(data: Uint8Array): Promise<SerializedSignature>;
    connect(client: SuiClient | JsonRpcProvider): SignerWithProvider;
}
