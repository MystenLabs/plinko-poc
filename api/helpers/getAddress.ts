// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getKeypair } from "./getKeyPair";

export const getAddress = (secretKey: string): string => {
  // Generate a keypair using the provided `secretKey`.
  const keypair = getKeypair(secretKey);
  // Obtain the public key from the generated keypair and convert it to a Sui address.
  const address = keypair.getPublicKey().toSuiAddress();

  // Return the generated Sui address.
  return address;
};
