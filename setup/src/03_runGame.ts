import * as dotenv from "dotenv";
import { SuiClient } from "@mysten/sui.js/client";
// import { config } from "./helper/config";
import { getKeyPairEd25519 } from "./getkeypair";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import * as bls from "@noble/bls12-381";
import {bytesToHex} from "@noble/hashes/utils";
import hkdf from "futoin-hkdf";

dotenv.config({ path: "../.env.local" });

import {
  PLAYER_PRIVATE_KEY, 
  PACKAGE_ADDRESS, 
  HOUSE_DATA_ID, 
  HOUSE_PRIVATE_KEY,
  SUI_NETWORK} from "./config";

  const client = new SuiClient({
    url: SUI_NETWORK,
  });


const playerSigner = getKeyPairEd25519(PLAYER_PRIVATE_KEY);
const houseSigner = getKeyPairEd25519(HOUSE_PRIVATE_KEY);
const playerAddress = playerSigner.getPublicKey().toSuiAddress();
console.log("Player Address = " + playerAddress);

async function runGame() {

  const vrf_input = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // TBD - get this from the NewGame event emitted from Plinko.move

   let houseSignedInput = await bls.sign(new Uint8Array(vrf_input), deriveBLS_SecretKey(HOUSE_PRIVATE_KEY!));
   let gameId = "0x7a9369e3f439e48524d2a34c8ac649029e615327505d68d88d8bbe8b11452988"; // TBD - get this from the NewGame event emitted from Plinko.move
   let numberofBalls = 2; // User input from UI

  //  const gameId = await client.getObject({ id: "coinObjectId" });

    const tx = new TransactionBlock(); 
    
    const [total_funds, player_address, trace] = tx.moveCall({
      target: `${PACKAGE_ADDRESS}::plinko::finish_game`,
      arguments: [
        tx.pure(gameId),
        tx.pure(Array.from(houseSignedInput), "vector<u8>"),
        tx.object(HOUSE_DATA_ID),
        tx.pure(numberofBalls, "u64")
      ],
    }); 

  tx.setGasBudget(10000000000);

  let res = await client.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      signer: houseSigner,
      options: {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
      },
    });

    console.log("executed! status = ", res);

    // if (res?.effects?.status.status === "success") {
    //   res?.objectChanges?.find((obj) => {
    //     if (obj.type === "created" && obj.objectType.endsWith("counter_nft::Counter")) {
    //       const counterNftId = `COUNTER_NFT_ID=${obj.objectId}\n`;
    //       console.log(counterNftId);
    //       return counterNftId
    //     }
    //   });
    // }
    //   if (res?.effects?.status.status === "failure") {
    //       console.log("Error = ", res?.effects);
    //   }

}

export function deriveBLS_SecretKey(private_key: string): Uint8Array {
    // initial key material
    const ikm = private_key;
    const length = 32;
    const salt = "plinko";
    const info = "bls-signature";
    const hash = 'SHA-256';
    const derived_sk = hkdf(ikm, length, {salt, info, hash});
    return Uint8Array.from(derived_sk);
}

runGame();