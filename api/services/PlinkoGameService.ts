// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// import { SuiService, SuiServiceInterface } from "./SuiService";
import { SuiService } from "./SuiService";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import * as bls from "@noble/bls12-381";
import BlsService from "./BlsService";
import hkdf from "futoin-hkdf";

import {
  ExecutorServiceHandler,
  isCoin,
  SplitStrategy,
  PoolObject,
  TransactionBlockWithLambda
} from "suioop";

class NoMicroCoinsSplitStrategy implements SplitStrategy {
  private minimumBalancePerCoin = 1_000_000_000;
  private readonly minimumPoolBalance;
  private balanceSoFar = 0;

  constructor(minimumBalance = 30_000_000_000) {
    this.minimumPoolBalance = minimumBalance;
  }

  public pred(obj: PoolObject | undefined) {
    if (!obj) throw new Error('No object found!.');
    if (this.balanceSoFar >= this.minimumPoolBalance) {
      return null;
    }
    if (isCoin(obj.type) && (obj.balance ?? 0) > this.minimumBalancePerCoin) {
      this.balanceSoFar += obj.balance ?? 0;
      return true;
    } else {
      return false;
    }
  }

  public succeeded() {
    return this.balanceSoFar >= this.minimumPoolBalance;
  }
}

class PlinkoGameService {
  
  private suiService: SuiService;
  public executorServiceHandler: ExecutorServiceHandler | undefined;
  public testUserServiceHandler: ExecutorServiceHandler | undefined;

  private tx = new TransactionBlock();

  constructor() {
    this.suiService = new SuiService();

    ExecutorServiceHandler.initialize(
      this.suiService.keypair,
      this.suiService.client,
      10000
  )
      .then(
          (es: any) => {
            this.executorServiceHandler = es;
          })
      .catch((e: any) => {
        throw new Error(e)
      })

  ExecutorServiceHandler.initialize(
      SuiService.getKeyPair(process.env.PLINKO_HOUSE_PRIVATE_KEY!), // ..ac36
      this.suiService.client,
      10000
  )
      .then(
          (es: any) => {
            this.testUserServiceHandler = es;
          })
      .catch((e: any) => {
        throw new Error(e)
      })
  }

// end-game for single player satoshi
public finishGame(
  gameId: string,
  blsSig: Uint8Array,
  numberofBalls: number
): Promise<{ trace: string; transactionDigest: string }> {
  return new Promise(async (resolve, reject) => {
    console.log("bslSig=", blsSig);
    console.log("----------------------");
    
    let houseSignedInput = await bls.sign(new Uint8Array(blsSig), this.deriveBLS_SecretKey(process.env.PLINKO_HOUSE_PRIVATE_KEY!));

    console.log("houseSignedInput=", houseSignedInput);
    console.log("GameID: ",gameId);
    console.log("numberofBalls: ",numberofBalls);
    console.log("HOUSE DATA ID: ",String(process.env.HOUSE_DATA_ID!));
    console.log("PACKAGE_ADDRESS: ",process.env.PACKAGE_ADDRESS);

    const txbLambda = () => {
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
      return tx;
    };  

    const customSplitStrategy = new NoMicroCoinsSplitStrategy()
    const txb = new TransactionBlockWithLambda(txbLambda);

    this.executorServiceHandler?.execute(
      txb,
      this.suiService.client,
      customSplitStrategy,
      {
        showEvents: true,
        showBalanceChanges: true,
        showObjectChanges: true,
      },
    )
    .then(async (res: any) => {
      const {
        effects,
        objectChanges,
        balanceChanges,
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