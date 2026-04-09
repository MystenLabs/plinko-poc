// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { createDAppKit } from "@mysten/dapp-kit-react";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { enokiWalletsInitializer } from "@mysten/enoki";

const networkName = process.env.NEXT_PUBLIC_SUI_NETWORK_NAME! as
  | "mainnet"
  | "testnet"
  | "devnet";

export const dAppKit = createDAppKit({
  networks: [networkName],
  createClient(network) {
    return new SuiGrpcClient({
      baseUrl: process.env.NEXT_PUBLIC_SUI_NETWORK!,
      network,
    });
  },
  walletInitializers: [
    enokiWalletsInitializer({
      apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
      providers: {
        google: {
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        },
      },
    }),
  ],
});

declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
