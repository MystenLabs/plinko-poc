import * as dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';

import {
  PACKAGE_ADDRESS,
  SUI_NETWORK, 
  HOUSE_ADDRESS,
  HOUSE_PRIVATE_KEY, 
  HOUSE_CAP,
} from "./config";

let privateKeyArray = Uint8Array.from(Array.from(fromB64(HOUSE_PRIVATE_KEY!)));
const keypairAdmin = Ed25519Keypair.fromSecretKey(privateKeyArray.slice(1));

let provider = new SuiClient({
    url: SUI_NETWORK,
});

export const createCounterObject = async (): Promise<String|void> => {
    
}