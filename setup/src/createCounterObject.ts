import * as dotenv from "dotenv";
import { SuiClient } from "@mysten/sui.js/client";
// import { config } from "./helper/config";
import { getKeyPairEd25519 } from "./getkeypair";
import { TransactionBlock } from "@mysten/sui.js/transactions";

dotenv.config({ path: "../.env.local" });

import {PLAYER_PRIVATE_KEY, PACKAGE_ADDRESS, SUI_NETWORK,} from "./config";

// const {
//     client,
//     PLAYER_PRIVATE_KEY,
//     PACKAGE_ADDRESS,
// } = config();


const client = new SuiClient({
    url: SUI_NETWORK,
  });


const playerSigner = getKeyPairEd25519(PLAYER_PRIVATE_KEY);

const playerAddress = playerSigner.getPublicKey().toSuiAddress();
console.log("Player Address = " + playerAddress);

export const createCounterObject = async (): Promise<String|void> => {

    const tx = new TransactionBlock();

    tx.moveCall({
        target: `${PACKAGE_ADDRESS}::counter_nft::mint`,
        arguments: [],
    });

    tx.setGasBudget(1000000000);

    let res = await client.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        signer: playerSigner,
        options: {
          showEffects: true,
        },
      });

      if (res?.effects?.status.status === "success") {
        res?.objectChanges?.find((obj) => {
          if (obj.type === "created" && obj.objectType.endsWith("counter_nft::Counter")) {
            const counterNftId = `COUNTER_NFT_ID=${obj.objectId}\n`;
            console.log(counterNftId);
            return counterNftId
          }
        });
      }
        if (res?.effects?.status.status === "failure") {
            console.log("Error = ", res?.effects);
        }

}

createCounterObject();