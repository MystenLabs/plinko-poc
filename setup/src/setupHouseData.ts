import * as dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromB64 } from "@mysten/sui/utils";

import {
  PACKAGE_ADDRESS,
  SUI_NETWORK,
  HOUSE_ADDRESS,
  HOUSE_PRIVATE_KEY,
  HOUSE_CAP,
} from "./config";

import { toB64 } from "@mysten/bcs";
import fs from "fs";

// The multipliers for the plinko game
let multiplierArray = [
  900, 820, 650, 380, 100, 60, 40, 60, 100, 380, 650, 820, 900,
];
let privateKeyArray = Uint8Array.from(Array.from(fromB64(HOUSE_PRIVATE_KEY!)));

const keypairAdmin = Ed25519Keypair.fromSecretKey(privateKeyArray.slice(1));

console.log("Connecting to ", SUI_NETWORK);
let provider = new SuiClient({
  url: SUI_NETWORK,
});

console.log("SUI_NETWORK = ", SUI_NETWORK);

console.log("Admin Address = " + HOUSE_ADDRESS);
console.log("Package ID  = " + PACKAGE_ADDRESS);
console.log("House Cap  = " + HOUSE_CAP);

// The initial balance of the house
const initHouseBalance = 50000000000;

const tx = new Transaction();

initializeContract();

//---------------------------------------------------------
/// Method Definitions
//---------------------------------------------------------

function initializeContract() {
  const houseCoin = tx.splitCoins(tx.gas, [tx.pure("u64", initHouseBalance)]);
  tx.moveCall({
    target: `${PACKAGE_ADDRESS}::house_data::initialize_house_data`,
    arguments: [
      tx.object(HOUSE_CAP),
      houseCoin,
      tx.pure.vector("u64", multiplierArray),
    ],
  });
}

//---------------------------------------------------------
/// Execute Transaction
//---------------------------------------------------------

tx.setGasBudget(1500000000);

if (SUI_NETWORK.includes("mainnet")) {
  tx.setSenderIfNotSet(HOUSE_ADDRESS as string);

  tx.build({ client: provider }).then((bytes) => {
    console.log("serialized_setup_tx bytes = ", bytes);
    let serializedBase64 = toB64(bytes);
    fs.writeFileSync("./serialized_setup_tx.txt", serializedBase64);
  });
} else {
  provider
    .signAndExecuteTransaction({
      transaction: tx,
      signer: keypairAdmin,
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    })
    .then(function (res) {
      const status = res?.effects?.status.status;

      console.log("executed! status = ", status);
      if (status === "success") {
        fs.writeFileSync("./tx_res.json", JSON.stringify(res));

        res?.objectChanges?.find((obj) => {
          if (
            obj.type === "created" &&
            obj.objectType.endsWith("house_data::HouseData")
          ) {
            const houseDataString = `HOUSE_DATA_ID=${obj.objectId}\n`;
            const next_house_data_id = `NEXT_PUBLIC_HOUSE_DATA_ID=${obj.objectId}\n`;
            console.log(houseDataString);
            // Append the house_data_id to the .env files
            fs.appendFileSync("../.env.local", houseDataString);
            fs.appendFileSync("../../api/.env.local", houseDataString);
            fs.appendFileSync("../../app/.env", next_house_data_id);
          }
        });
        process.exit(0);
      }
      if (status == "failure") {
        console.log("Error = ", res?.effects);
        process.exit(1);
      }
    });
}

//---------------------------------------------------------
/// Helper Functions
//---------------------------------------------------------

// function getBLS_KeyAsMoveParameter() {
//   const derived_bls_key = deriveBLS_SK(HOUSE_PRIVATE_KEY!);
//   return bls.getPublicKey(derived_bls_key);
// }

// function deriveBLS_SK(private_key: string): Uint8Array {
//   // initial key material
//   const ikm = private_key;
//   const length = 32;
//   const salt = "plinko";
//   const info = "bls-signature";
//   const hash = "SHA-256";
//   const derived_sk = hkdf(ikm, length, { salt, info, hash });
//   return Uint8Array.from(derived_sk);
// }
