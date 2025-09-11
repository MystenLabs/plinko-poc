// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import "server-only";

import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";

class SuiService {
  private signer: Ed25519Keypair;

  private _client: SuiClient;
  private _keypair: Ed25519Keypair;

  constructor() {
    this._client = new SuiClient({
      url: process.env.NEXT_PUBLIC_SUI_NETWORK!,
    });

    this._keypair = SuiService.getKeyPair(
      process.env.PLINKO_HOUSE_PRIVATE_KEY!
    );

    this.signer = this._keypair;
  }

  static getKeyPair(privateKey: string): Ed25519Keypair {
    const privateKeyArray: any = Array.from(fromBase64(privateKey));
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

  public async getObject(objectId: string) {
    return this.client.getObject({
      id: objectId,
      options: {
        showContent: true,
      },
    });
  }
  get client() {
    return this._client;
  }
}

export { SuiService };
