// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import "server-only";

import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";

const networkName = (process.env.NEXT_PUBLIC_SUI_NETWORK_NAME ?? "testnet") as
  | "mainnet"
  | "testnet"
  | "devnet";

class SuiService {
  private signer: Ed25519Keypair;

  private _client: SuiGrpcClient;
  private _keypair: Ed25519Keypair;

  constructor() {
    this._client = new SuiGrpcClient({
      baseUrl: process.env.NEXT_PUBLIC_SUI_NETWORK!,
      network: networkName,
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

  public getClient(): SuiGrpcClient {
    return this._client;
  }

  public async getObject(objectId: string) {
    return this.client.core.getObject({
      objectId,
      include: {
        content: true,
      },
    });
  }
  get client() {
    return this._client;
  }
}

export { SuiService };
