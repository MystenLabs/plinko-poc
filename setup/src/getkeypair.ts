// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { fromB64 } from '@mysten/sui.js/utils';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { Secp256k1Keypair } from '@mysten/sui.js/keypairs/secp256k1';

/// Helper to make keypair from private key that is in string format
export function getKeyPairEd25519(privateKey: string): Ed25519Keypair {
  let privateKeyArray = Array.from(fromB64(privateKey));
  privateKeyArray.shift();
  return Ed25519Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
}

/// Helper to make keypair from private key that is in string format
export function getKeyPairSecp256(privateKey: string): Secp256k1Keypair {
  let privateKeyArray = Array.from(fromB64(privateKey));
  privateKeyArray.shift();
  return Secp256k1Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
}