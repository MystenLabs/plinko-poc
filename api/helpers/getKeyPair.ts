import { fromB64 } from "@mysten/sui.js/utils";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

export const getKeypair = (secretKey: string) => {
  let privateKeyArray = Uint8Array.from(Array.from(fromB64(secretKey)));
  // Create an `Ed25519Keypair` instance from the decoded secret key.
  // The `slice(1)` method is used to remove the first byte from the `privateKeyArray` before creating the keypair.
  const keypairAdmin = Ed25519Keypair.fromSecretKey(privateKeyArray.slice(1));
  
  // Return the created `Ed25519Keypair` instance.
  return keypairAdmin;
};
