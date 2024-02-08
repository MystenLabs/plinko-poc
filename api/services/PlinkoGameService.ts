// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// // import { SuiService, SuiServiceInterface } from "./SuiService";
import { SuiService } from "./SuiService";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import * as bls from "@noble/bls12-381";
import hkdf from "futoin-hkdf";

import {
  ExecutorServiceHandler,
  TransactionBlockWithLambda,
  DefaultSplitStrategy
} from "suioop";

class PlinkoGameService {
  
  private suiService: SuiService;
  public executorServiceHandler: ExecutorServiceHandler | undefined;

  private tx = new TransactionBlock();

  constructor() {
    this.suiService = new SuiService();

    ExecutorServiceHandler.initialize(
      this.suiService.keypair,
      this.suiService.client,
      1000
  )
      .then(
          (es: any) => {
            this.executorServiceHandler = es;
          })
      .catch((e: any) => {
        throw new Error(e)
      })

  ExecutorServiceHandler.initialize(
      SuiService.getKeyPair(process.env.PLINKO_HOUSE_PRIVATE_KEY!),
      this.suiService.client,
      1000
  )
      .catch((e: any) => {
        throw new Error(e)
      })
  }

// end-game for single player satoshi
public finishGame(
  gameId: string,
  vrfInputArray: Uint8Array,
  numberofBalls: number
): Promise<{ trace: string; transactionDigest: string }> {
  return new Promise(async (resolve, reject) => {
    console.log("bslSig=", vrfInputArray);
    
    let blsHouseSignedInput = await bls.sign(new Uint8Array(vrfInputArray), this.deriveBLS_SecretKey(process.env.PLINKO_HOUSE_PRIVATE_KEY!));

    const txbLambda = () => {
      const tx = new TransactionBlock();
      tx.setGasBudget(1000000000);
      tx.moveCall({
        target: `${process.env.PACKAGE_ADDRESS}::plinko::finish_game`,
        arguments: [
          tx.pure(gameId),
          tx.pure(Array.from(blsHouseSignedInput), "vector<u8>"),
          tx.object(String(process.env.HOUSE_DATA_ID!)),
          tx.pure(numberofBalls, "u64")
        ],
      });
      return tx;
    };  

    const txb = new TransactionBlockWithLambda(txbLambda);

    this.executorServiceHandler?.execute(
      txb,
      this.suiService.client,
      // Each pool will contain coins with a total balance of 1 SUI
      new DefaultSplitStrategy(5000000000),
      {
        showEvents: true,
        showBalanceChanges: true,
        showObjectChanges: true,
      },
    )
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
      console.log('end game digest', res.digest);
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
    .catch((e: any) => {
      reject({
        status: "failure",
        message: e.message || "Transaction failed",
        originalError: e
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
