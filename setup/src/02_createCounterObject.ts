import * as dotenv from "dotenv";
import { SuiClient } from "@mysten/sui.js/client";
// import { config } from "./helper/config";
import { getKeyPairEd25519 } from "./getkeypair";
import { TransactionBlock } from "@mysten/sui.js/transactions";

dotenv.config({ path: "../.env.local" });

import {
  PLAYER_PRIVATE_KEY, 
  PACKAGE_ADDRESS, 
  HOUSE_DATA_ID, 
  SUI_NETWORK} from "./config";

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

const betAmount = 1000000000;

export const createCounterObject = async (): Promise<String|void> => {

    const tx = new TransactionBlock();

    const betAmountCoin = tx.splitCoins(tx.gas, [tx.pure(betAmount)]);

    const counterNFT = tx.moveCall({
        target: `${PACKAGE_ADDRESS}::counter_nft::mint`,
        arguments: [],
    });

   const vrf_input = tx.moveCall ({
      target: `${PACKAGE_ADDRESS}::counter_nft::get_vrf_input_and_increment`,
      arguments: [tx.object(counterNFT)],
    });

    tx.moveCall({
      target: `${PACKAGE_ADDRESS}::counter_nft::transfer_to_sender`,
      arguments: [tx.object(counterNFT)],
  });

  const gameId = tx.moveCall({
      target: `${PACKAGE_ADDRESS}::plinko::start_game`,
      arguments: [
        tx.object(counterNFT),
        betAmountCoin,
        tx.object(HOUSE_DATA_ID)
      ],
    }) 

    tx.setGasBudget(1000000000);

    let res = await client.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        signer: playerSigner,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      console.log("executed! status = ", res);

      if (res?.effects?.status.status === "success") {
        res?.objectChanges?.find((obj) => {
          if (obj.type === "created" && obj.objectType.endsWith("counter_nft::Counter")) {
            const counterNftId = `COUNTER_NFT_ID=${obj.objectId}\n`;
            console.log(counterNftId);
            console.log("VRF Input = ", vrf_input);
            return counterNftId
          }
        });
      }
        if (res?.effects?.status.status === "failure") {
            console.log("Error = ", res?.effects);
        }

}

createCounterObject();