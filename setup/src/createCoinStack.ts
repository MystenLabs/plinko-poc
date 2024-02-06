import * as dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';


import fs from "fs";

import { 
    HOUSE_ADDRESS, 
    HOUSE_PRIVATE_KEY, 
    SUI_NETWORK 
} from "./config";

const COIN_SIZE = 10_000_000;

console.log("Connecting to ", SUI_NETWORK);

function getSigner() {

  let privateKeyArray = Uint8Array.from(Array.from(fromB64(HOUSE_PRIVATE_KEY!)));

  const keypairAdmin = Ed25519Keypair.fromSecretKey(privateKeyArray.slice(1));

  const address = keypairAdmin.getPublicKey().toSuiAddress();
  console.log("Signer Address = " + address);

  return keypairAdmin;
}

async function createCoins(numberOfCoins: number = 500) {
  let client = new SuiClient({url: SUI_NETWORK!});

  let txb = new TransactionBlock();

  for (let i = 0; i < numberOfCoins; i++) {
    let coin = txb.splitCoins(txb.gas, [txb.pure(COIN_SIZE)]);

    txb.transferObjects([coin], txb.pure(HOUSE_ADDRESS));
  }

  let res = await client.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    requestType: "WaitForLocalExecution",
    signer: getSigner(),
    options: {
      showEffects: true,
    },
  });

  fs.writeFileSync("./coinStack_execution.json", JSON.stringify(res));
}

createCoins();