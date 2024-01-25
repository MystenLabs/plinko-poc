import * as dotenv from "dotenv";
import { SuiClient } from "@mysten/sui.js/client";
import { getKeyPairEd25519 } from "./getkeypair";
import { TransactionBlock } from "@mysten/sui.js/transactions";

dotenv.config({ path: "../.env.local" });

import {
  PLAYER_PRIVATE_KEY, 
  PACKAGE_ADDRESS, 
  HOUSE_DATA_ID, 
  SUI_NETWORK} from "./config";

const client = new SuiClient({
    url: SUI_NETWORK,
  });

const playerSigner = getKeyPairEd25519(PLAYER_PRIVATE_KEY);

const playerAddress = playerSigner.getPublicKey().toSuiAddress();
console.log("Player Address = " + playerAddress);

const betAmount = 1000000000;

export const createCounterObject = async (): Promise<String|void> => {

    const tx = new TransactionBlock();

    const betAmountCoin = tx.splitCoins(tx.gas, [tx.pure(betAmount)]);

    const counterNFT = tx.moveCall({
        target: `${PACKAGE_ADDRESS}::counter_nft::mint`,
        arguments: [],
    });

     const gameId = tx.moveCall({
      target: `${PACKAGE_ADDRESS}::plinko::start_game`,
      arguments: [
        tx.object(counterNFT),
        betAmountCoin,
        tx.object(HOUSE_DATA_ID)
      ],
    }) 

    tx.moveCall({
      target: `${PACKAGE_ADDRESS}::counter_nft::transfer_to_sender`,
      arguments: [tx.object(counterNFT)],
  });


    tx.setGasBudget(10000000000);

    let res = await client.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        signer: playerSigner,
        options: {
          showEffects: true,
          showObjectChanges: true,
          showEvents: true,
        },
      });

      console.log("executed! status = ", res);

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