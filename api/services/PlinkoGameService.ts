// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SuiService } from "./SuiService";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64, toBase64 } from "@mysten/sui/utils";

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

  constructor() {
    this.suiService = new SuiService();
  }
  API_BASE = process.env.NEXT_PUBLIC_BACKEND_API ?? "http://localhost:8080";

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

    // 2) Sponsor the un-signed TxBytes
    const sponsorResp = await fetch(`${this.API_BASE}/sponsor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionKindBytes: toBase64(txBytes),
        sender: this.suiService.getSigner().getPublicKey().toSuiAddress(),
      }),
    });

    if (!sponsorResp.ok) {
      throw new Error(`Failed to sponsor transaction: ${sponsorResp.status}`);
    }

    const { bytes: sponsoredBytes, digest: sponsoredDigest } =
      (await sponsorResp.json()) as {
        bytes: string;
        digest: string;
      };

    // 3) Sign the sponsored TxBytes
    const signer = this.suiService.getSigner();
    const { signature } = await signer.signTransaction(
      fromBase64(sponsoredBytes)
    );

    // 4) Execute the sponsored + signed TxBytes
    const execResp = await fetch(`${this.API_BASE}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ digest: sponsoredDigest, signature }),
    });

    if (!execResp.ok) {
      throw new Error(`Failed to execute transaction: ${execResp.status}`);
    }

    const { digest: executedDigest } = (await execResp.json()) as {
      digest: string;
    };

    await this.suiService.getClient().waitForTransaction({
      digest: executedDigest,
      timeout: 10_000,
    });

    const txResult = await this.suiService.getClient().getTransactionBlock({
      digest: executedDigest,
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
      transactionDigest: executedDigest,
    };
  }
}

export default PlinkoGameService;
