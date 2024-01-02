import { Keypair } from '../cryptography/keypair';
import { SerializedSignature } from '../cryptography/signature';
import { JsonRpcProvider } from '../providers/json-rpc-provider';
import { SuiAddress } from '../types';
import { SignerWithProvider } from './signer-with-provider';
export declare class RawSigner extends SignerWithProvider {
    private readonly keypair;
    constructor(keypair: Keypair, provider: JsonRpcProvider);
    getAddress(): Promise<SuiAddress>;
    signData(data: Uint8Array): Promise<SerializedSignature>;
    connect(provider: JsonRpcProvider): SignerWithProvider;
}
