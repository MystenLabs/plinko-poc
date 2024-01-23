// // Copyright (c) Mysten Labs, Inc.
// // SPDX-License-Identifier: Apache-2.0

// import { SuiClient } from '@mysten/sui.js/client';
// import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
// import { fromB64 } from '@mysten/sui.js/utils';

// type CoinData = {
//   version: string;
//   digest: string;
//   coinType: string;
//   previousTransaction: string;
//   coinObjectId: string;
//   balance: string;
//   lockedUntilEpoch?: number | null | undefined;
// }[];

// class SuiService {
//   private _client: SuiClient;
//   private _keypair: Ed25519Keypair;

//   constructor() {
//     console.log(
//       "Generating Sui Service. Target Sui Node URL: ",
//       process.env.SUI_NETWORK
//     );
//     // @todo: parameterized initialization here?
//     this._client = new SuiClient({url: process.env.SUI_NETWORK! });
//     this._keypair = SuiService.getKeyPair(process.env.PLINKO_HOUSE_PRIVATE_KEY!);
//   }
//   static getKeyPair(privateKey: string): Ed25519Keypair {
//     const privateKeyArray: any = Array.from(fromB64(privateKey));
//     privateKeyArray.shift();
//     return Ed25519Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
//   }

//   public async getObject(objectId: string) {
//     //: Promise<GetObjectDataResponse> {
//     return this.client.getObject({
//       id: objectId,
//       options: {
//         showContent: true,
//       },
//     });
//   }

//   get keypair() { return this._keypair; }
//   get client() { return this._client; }
// }

// export { SuiService };


// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// import {
//   bcs,
//   Connection,
//   // JsonRpcProvider,
//   RawSigner,
//   localnetConnection,
//   TransactionBlock,
//   fromB64,
//   SuiTransactionBlockResponse,
// } from "@mysten/sui.js";

import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';

class SuiService {
  // private provider: JsonRpcProvider;
  private signer: Ed25519Keypair;
  private gasCoins: string[];
  private gasCoinSelection: string;
  private playCoins: string[];
 

  private _client: SuiClient;
  private _keypair: Ed25519Keypair;

  constructor() {
    console.log(
      "Generating Sui Service. Target Sui Node URL: ",
      process.env.SUI_NETWORK
    );
    // const keypair = Ed25519Keypair.deriveKeypair(phrase!)
    // @todo: parameterized initialization here?

    this._client = new SuiClient({
      url: process.env.SUI_NETWORK!
    });

    this._keypair = SuiService.getKeyPair(process.env.PLINKO_HOUSE_PRIVATE_KEY!);

    // const connectionOptions: Connection = new Connection({
    //   fullnode: process.env.SUI_NETWORK!,
    // });
    // this.provider = new JsonRpcProvider(connectionOptions);

    this.signer = this._keypair;
    this.gasCoins = [];
    this.playCoins = [];
    this.gasCoinSelection = "";
    // this.populateGasCoins();
  }

  static getKeyPair(privateKey: string): Ed25519Keypair {
        const privateKeyArray: any = Array.from(fromB64(privateKey));
        privateKeyArray.shift();
        return Ed25519Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
      }


  public getSigner(): Ed25519Keypair {
    const houseSigner = SuiService.getKeyPair(process.env.PLINKO_HOUSE_PRIVATE_KEY!);
    return houseSigner;
  }

  public getClient(): SuiClient {
    return this._client;
  }

  // public async hasBlockSynced(digest: string) {
  //   if (!digest) throw new Error("Invalid txn digest");

  //   try {
  //     let resp = await this.waitForTransactionBlock({
  //       timeout: 20000,
  //       digest,
  //       options: { showEffects: true },
  //     });

  //     return resp?.effects?.status.status === "success";
  //   } catch (e) {
  //     console.error("sync error", e);
  //     return false;
  //   }
  // }

  private ensureAvailableCoins(
    coins: { id: string; balance: number }[],
    minAmount: number,
    minBalance: number
  ) {
    let suitableCoins = 0;
    for (let coin of coins) {
      if (coin.balance >= minBalance) {
        suitableCoins += 1;
      }
    }
    return suitableCoins >= minAmount;
  }

  // private async requestFromFaucet() {
  //   console.log("Banker low on funds, requesting from faucet...");
  //   const faucetRes: any = await this.provider.requestSuiFromFaucet(
  //     String(process.env.SATOSHI_HOME_ADDRESS)
  //   );
  //   console.log("Requested from faucet successfully!");
  //   return faucetRes;
  // }

  // private async populateGasCoins() {
  //   try {
  //     let homeAddress = process.env.SATOSHI_HOME_ADDRESS;
  //     console.log("Fetching coins for :", homeAddress);
  //     const gasCoins = await this.provider.getCoins({
  //       owner: String(homeAddress),
  //     });
  //     console.log("Gas coins:", gasCoins);

  //     const gasCoinsFiltered = [];
  //     for (var coin in gasCoins.data) {
  //       //console.log("coin", coin);
  //       var coinData = gasCoins.data[coin];
  //       //console.log("coinData", coinData);
  //       gasCoinsFiltered.push({
  //         id: coinData.coinObjectId,
  //         balance: Number(coinData.balance),
  //       });
  //     }

  //     this.gasCoins = gasCoinsFiltered
  //       .filter((coin, index) => index < 5)
  //       .map((coin) => coin.id);

  //     console.log("Gas coins", this.gasCoins);
  //   } catch (e) {
  //     console.error("Populating gas coins failed: ", e);
  //   }
  // }

  // private async checkGasCoinBalances() {
  //   const allCoins = await this.provider.getCoins({
  //     owner: String(process.env.SATOSHI_HOME_ADDRESS),
  //   });

  //   const gasCoins = allCoins.data.filter((coin: { coinObjectId: string; }) =>
  //     this.gasCoins.some((coinId) => coinId === coin.coinObjectId)
  //   );

  //   const smallGasCoins = gasCoins.filter(
  //     (coin: { balance: any; }) => Number(coin.balance) <= 10000
  //   );

  //   const smallGasCoinsFiltered = [];
  //   for (var coin in smallGasCoins) {
  //     var coinData = smallGasCoins[coin];
  //     smallGasCoinsFiltered.push({
  //       id: coinData.coinObjectId,
  //       balance: Number(coinData.balance),
  //     });
  //   }
  //   await this.populateGasCoins();
  // }

  // private async getNextGasCoin() {
  //   // @todo: how do we recover if this call fails?
  //   await this.checkGasCoinBalances();

  //   const coinIdIndex = this.gasCoins.findIndex(
  //     (coinId) => coinId === this.gasCoinSelection
  //   );
  //   // select nextIndex + 1 and wrap around if we are at the end
  //   const nextIndex = (coinIdIndex + 1) % this.gasCoins.length;
  //   this.gasCoinSelection = this.gasCoins.at(nextIndex) || "";
  //   console.log("Gas coin", this.gasCoinSelection);
  //   return this.gasCoinSelection;
  // }

  // private async getLargestBankCoin(): Promise<{ id: string; balance: number }> {
  //   return new Promise((resolve, reject) => {
  //     let largestCoin = { id: "", balance: 0 };
  //     try {
  //       this.provider
  //         .getCoins({ owner: String(process.env.SATOSHI_HOME_ADDRESS) })
  //         .then((bankCoins: { data: any; }) => {
  //           for (let coin of bankCoins.data) {
  //             if (
  //               Number(coin.balance) >= largestCoin.balance &&
  //               !this.gasCoins.some((coinId) => coinId === coin.coinObjectId)
  //             ) {
  //               largestCoin = {
  //                 id: coin.coinObjectId,
  //                 balance: Number(coin.balance),
  //               };
  //             }
  //           }

  //           resolve(largestCoin);
  //         });
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }

  public async getObject(objectId: string) {
    //: Promise<GetObjectDataResponse> {
    return this.client.getObject({
      id: objectId,
      options: {
        showContent: true,
      },
    });
  }

  // public async executeMoveCall(
  //   packageObjId: string,
  //   module: string,
  //   typeArguments: [],
  //   funName: string,
  //   funArguments: SuiJsonValue[],
  //   gasBudget: number = 1000
  // ): Promise<SuiExecuteTransactionResponse> {
  //   const response = await this.signer.executeMoveCall({
  //     packageObjectId: packageObjId,
  //     module: module,
  //     typeArguments: typeArguments,
  //     function: funName,
  //     arguments: funArguments,
  //     gasBudget,
  //     gasPayment: await this.getNextGasCoin(),
  //   });

  //   return response;
  // }

  /**
   * Wait for a transaction block result to be available over the API.
   * This can be used in conjunction with `executeTransactionBlock` to wait for the transaction to
   * be available via the API.
   * This currently polls the `getTransactionBlock` API to check for the transaction.
   */
  // async waitForTransactionBlock({
  //   signal,
  //   timeout = 60 * 1000,
  //   pollInterval = 2 * 1000,
  //   ...input
  // }: {
  //   /** An optional abort signal that can be used to cancel */
  //   signal?: AbortSignal;
  //   /** The amount of time to wait for a transaction block. Defaults to one minute. */
  //   timeout?: number;
  //   /** The amount of time to wait between checks for the transaction block. Defaults to 2 seconds. */
  //   pollInterval?: number;
  // } & Parameters<
  //   JsonRpcProvider["getTransactionBlock"]
  // >[0]): Promise<SuiTransactionBlockResponse> {
  //   let blockRetrieved = false;
  //   const timeoutSignal = AbortSignal.timeout(timeout);
  //   const timeoutPromise = new Promise((_, reject) => {
  //     timeoutSignal.addEventListener("abort", () => {
  //       if (!blockRetrieved) reject(timeoutSignal.reason);
  //     });
  //   });

  //   // let index = 0;
  //   while (!timeoutSignal.aborted && !blockRetrieved) {
  //     console.log("block retrieved while", blockRetrieved);
  //     signal?.throwIfAborted();
  //     try {
  //       // test failing scenario
  //       // while (index < 3) {
  //       //   index ++;
  //       //   throw new Error("Simulating an error thrown");
  //       // }
  //       let sync = await this.provider.getTransactionBlock(input);
  //       if (sync.effects?.status.status === "success") blockRetrieved = true;
  //       return sync;
  //     } catch (e) {
  //       console.log("error?", e);
  //       // Wait for either the next poll interval, or the timeout.
  //       await Promise.race([
  //         new Promise((resolve) => setTimeout(resolve, pollInterval)),
  //         timeoutPromise,
  //       ]);
  //     }
  //   }

  //   timeoutSignal.throwIfAborted();

  //   // This should never happen, because the above case should always throw, but just adding it in the event that something goes horribly wrong.
  //   throw new Error("Unexpected error while waiting for transaction block.");
  // }

  get keypair() { return this._keypair; }
  get client() { return this._client; }
}

export { SuiService }; //, SuiServiceInterface };
