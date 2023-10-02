// adminKey, adminPhrase, userPhrase from config

import { JsonRpcProvider } from "@mysten/sui.js/dist/cjs/providers/json-rpc-provider";
import { bls12_381 as bls } from "@noble/curves/bls12-381";
const hkdf = require("function-hkdf");

// console.log("Connecting to ", SUI_NETWORK);

// export function getSigner(account: "user" | "admin" = "admin") {
//     let phrase = adminPhrase;
//     if (account === "user") {
//         phrase = userPhrase;
//     }

//     const connOptions = new Connection({
//         fullnode: SUI_NETWORK,
//     });

//     let provider = new JsonRpcProvider(connOptions);
//     const keypair = Ed25519Keypair.deriveKeypair(phrase!);
//     const signer = new RawSigner(keypair, provider);

//     const address = keypair.getPublicKey().toSuiAdddress();
//     console.log("Signer Address = " + address);

//     return { signer, address, provider};
// }

export class BlsService {
    private SecretKey: any;
    private PublicKey: any;

    //key derivation function (deriving a sk from house's sk)
    constructor() {
        // @todo: keygen source should be coming from .env
        this.SecretKey = this.deriveBLS_SK();
        this.PublicKey = bls.getPublicKey(this.SecretKey);
        console.log("Public Key", this.PublicKey);
    }

    deriveBLS_SK(){
        // initial key meterial
        const ikm = adminKey;
        const length = 32;
        const salt = "plinko";
        const info = "bls-signature";
        const hash = "SHA-256";
        const derived_sk = hkdf(ikm, length, { salt, info, hash });
        return Uint8Array.from(derived_sk);
    }

    async sign(msg: string): Promise<Uint8Array> {
        const sig = await bls.sign(msg, this.SecretKey);
        return sig;
    }

    async verify(msg: string, sig: Buffer) {
        const isValid = await bls.verify(
            Uint8Array.from(sig),
            msg,
            Uint8Array.from(this.PublicKey)
        );
        return isValid;
    }
}