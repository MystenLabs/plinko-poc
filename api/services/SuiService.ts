// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromB64 } from "@mysten/sui/utils";

class SuiService {
  private signer: Ed25519Keypair;
  private gasCoins: string[];
  private gasCoinSelection: string;
  private playCoins: string[];

  private _client: SuiClient;
  private _keypair: Ed25519Keypair;

  constructor() {
    this._client = new SuiClient({
      url: process.env.SUI_NETWORK!,
    });

    this._keypair = SuiService.getKeyPair(
      process.env.PLINKO_HOUSE_PRIVATE_KEY!
    );

    this.signer = this._keypair;
    this.gasCoins = [];
    this.playCoins = [];
    this.gasCoinSelection = "";
  }

  static getKeyPair(privateKey: string): Ed25519Keypair {
    const privateKeyArray: any = Array.from(fromB64(privateKey));
    privateKeyArray.shift();
    return Ed25519Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
  }

  public getSigner(): Ed25519Keypair {
    const houseSigner = SuiService.getKeyPair(
      process.env.PLINKO_HOUSE_PRIVATE_KEY!
    );
    return houseSigner;
  }

  public getClient(): SuiClient {
    return this._client;
  }

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

  public async getObject(objectId: string) {
    return this.client.getObject({
      id: objectId,
      options: {
        showContent: true,
      },
    });
  }

  get keypair() {
    return this._keypair;
  }
  get client() {
    return this._client;
  }
}

export { SuiService };
