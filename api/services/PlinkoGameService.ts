// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { EnokiClient } from "@mysten/enoki";
import { SuiService } from "./SuiService";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64, toBase64 } from "@mysten/sui/utils";
import { enokiClient } from "../utils/EnokiClient";

type EventWithParsedJson = { parsedJson?: unknown; type?: string };

// Return the `trace` field from the first event that actually contains it.
// If none match, fall back to checking the first event.

function extractTrace(events?: EventWithParsedJson[]): string | undefined {
  if (!events?.length) return undefined;

  // 1) Prefer the first event that explicitly has a `trace` in its parsedJson
  for (const event of events) {
    const parsed = event.parsedJson;
    if (
      parsed &&
      typeof parsed === "object" &&
      "trace" in (parsed as Record<string, unknown>)
    ) {
      return (parsed as Record<string, unknown>).trace as string | undefined;
    }
  }

  // 2) Fallback: check the very first event
  const firstParsed = events[0]?.parsedJson;
  if (
    firstParsed &&
    typeof firstParsed === "object" &&
    "trace" in (firstParsed as Record<string, unknown>)
  ) {
    return (firstParsed as Record<string, unknown>).trace as string | undefined;
  }

  return undefined;
}

class PlinkoGameService {
  private suiService: SuiService;
  private enokiClient: EnokiClient;

  constructor() {
    this.suiService = new SuiService();
    this.enokiClient = enokiClient;
  }

  public async finishGame(
    gameId: string,
    numberofBalls: number
  ): Promise<{ trace: string; transactionDigest: string }> {
    // 1) Create the tx and get TransactionKind bytes
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.PACKAGE_ADDRESS}::plinko::finish_game`,
      arguments: [
        tx.pure.address(gameId),
        tx.object("0x8"), //SUI Random object, to be replaced with tx.object.random() when stable
        tx.object(String(process.env.HOUSE_DATA_ID!)),
        tx.pure.u64(numberofBalls),
      ],
    });

    const txBytes = await tx.build({
      client: this.suiService.getClient(),
      onlyTransactionKind: true,
    });

    const sender = this.suiService.getSigner().getPublicKey().toSuiAddress();
    const network = process.env.SUI_NETWORK_NAME ?? "testnet";
    // 2) Sponsor the un-signed TxBytes
    const sponsored = await this.enokiClient.createSponsoredTransaction({
      network: network as "mainnet" | "testnet" | "devnet",
      transactionKindBytes: toBase64(txBytes),
      sender,
      allowedAddresses: [sender],
    });

    // 3) Sign the sponsored TxBytes
    const signer = this.suiService.getSigner();
    const { signature } = await signer.signTransaction(
      fromBase64(sponsored.bytes)
    );

    // 4) Execute the sponsored + signed TxBytes
    const exec = await this.enokiClient.executeSponsoredTransaction({
      digest: sponsored.digest,
      signature,
    });

    await this.suiService.getClient().waitForTransaction({
      digest: exec.digest,
      timeout: 10_000,
    });

    const txResult = await this.suiService.getClient().getTransactionBlock({
      digest: exec.digest,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: false,
      },
    });

    const status = txResult.effects?.status?.status;
    if (status !== "success") {
      throw new Error(
        `Transaction failed: ${
          txResult.effects?.status?.error ?? "unknown error"
        }`
      );
    }

    const trace = extractTrace(
      txResult.events as EventWithParsedJson[] | undefined
    );
    if (!trace) {
      throw new Error("Trace not found in transaction events");
    }

    return {
      trace,
      transactionDigest: exec.digest,
    };
  }
}

export default PlinkoGameService;
