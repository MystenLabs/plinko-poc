// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// import { SuiService, SuiServiceInterface } from "./SuiService";
import { SuiService } from "./SuiService";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import * as bls from "@noble/bls12-381";
import BlsService from "./BlsService";
import hkdf from "futoin-hkdf";

class PlinkoGameService {
  // private suiService: SuiServiceInterface;
  private suiService: SuiService;
  
  private gameIdMap: Map<
    String,
    {
      txn_digest: string;
      date_created: String;
      game_ended: boolean;
      player_won: boolean | null;
      date_ended: String | null;
    }
  > = new Map<
    String,
    {
      txn_digest: string;
      date_created: String;
      game_ended: boolean;
      player_won: boolean | null;
      date_ended: String | null;
    }
  >();

  private tx = new TransactionBlock();

  constructor() {
    this.suiService = new SuiService();
  }

  public getGames() {
    let games: Object[] = [];
    for (let key of this.gameIdMap.keys()) {
      games.push({ gameId: key, details: this.gameIdMap.get(key) });
    }
    return games;
  }

  public registerGame(gameId: string, txn_digest: string) {
    try {
      this.gameIdMap.set(gameId, {
        txn_digest,
        date_created: new Date().toUTCString(),
        game_ended: false,
        player_won: null,
        date_ended: null,
      });
      return true;
    } catch (e) {
      console.error("Encountered error while registering game", e);
      return false;
    }
  }

// end-game for single player satoshi
public finishGame(
  gameId: string,
  blsSig: Uint8Array,
  numberofBalls: number
): Promise<{ trace: string; transactionDigest: string }> {
  return new Promise(async (resolve, reject) => {
    console.log("bslSig=", blsSig);
    let txnDigest = this.gameIdMap.get(gameId)?.txn_digest;
    console.log("----------------------");
    
    let houseSignedInput = await bls.sign(new Uint8Array(blsSig), this.deriveBLS_SecretKey(process.env.PLINKO_HOUSE_PRIVATE_KEY!));

    console.log("houseSignedInput=", houseSignedInput);
    console.log("GameID: ",gameId);
    console.log("numberofBalls: ",numberofBalls);
    console.log("HOUSE DATA ID: ",String(process.env.HOUSE_DATA_ID!));
    console.log("PACKAGE_ADDRESS: ",process.env.PACKAGE_ADDRESS);
    const tx = new TransactionBlock();
    tx.setGasBudget(1000000000);
    tx.moveCall({
      target: `${process.env.PACKAGE_ADDRESS}::plinko::finish_game`,
      arguments: [
        tx.pure(gameId),
        tx.pure(Array.from(houseSignedInput), "vector<u8>"),
        tx.object(String(process.env.HOUSE_DATA_ID!)),
        tx.pure(numberofBalls, "u64")
      ],
    });

    this.suiService
      .getClient()
      .signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        signer: this.suiService.getSigner(),
        options: {
          showObjectChanges: true,
          showEffects: true,
          showEvents: true,
        },
      })
      .then(async (res: any) => {
        const {
          effects,
          events
        } = res;
        const trace = events[0].parsedJson.trace;
        console.log("trace", trace);
        console.log(effects);
        const status = effects?.status?.status;
        const transactionDigest = effects?.transactionDigest!;

        if (status === "success") {
          resolve({
            trace,
            transactionDigest,
          });
        } else {
          reject({
            status: "failure",
            effects,
          });
        }
      })
      .catch((e: { message: any; }) => {
        reject({
          status: "failure",
          message: e.message || "Transaction failed",
        });
      });
  });
}


   public deriveBLS_SecretKey(private_key: string): Uint8Array {
    // initial key material
    const ikm = private_key;
    const length = 32;
    const salt = "plinko";
    const info = "bls-signature";
    const hash = 'SHA-256';
    const derived_sk = hkdf(ikm, length, {salt, info, hash});
    return Uint8Array.from(derived_sk);
}
}

export default PlinkoGameService;