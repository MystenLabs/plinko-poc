// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import "server-only";

import { EnokiClient } from "@mysten/enoki";
import { SuiService } from "@/app/api/services/SuiService";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64, toBase64 } from "@mysten/sui/utils";
import { enokiClient } from "@/app/api/EnokiClient";
import * as plinko from "../../../generated/plinko/plinko";

type EventWithParsedJson = { parsedJson?: unknown; type?: string };

function extractTrace(events?: EventWithParsedJson[]): string | undefined {
  if (!events?.length) return undefined;

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
    tx.add(
      plinko.finishGame({
        package: process.env.NEXT_PUBLIC_PACKAGE_ADDRESS!,
        arguments: {
          gameId,
          random: tx.object("0x8"), //SUI Random object, to be replaced with tx.object.random() when stable
          houseData: tx.object(process.env.NEXT_PUBLIC_HOUSE_DATA_ID!),
          numBalls: BigInt(Number(numberofBalls)),
        },
      })
    );

    const txBytes = await tx.build({
      client: this.suiService.getClient(),
      onlyTransactionKind: true,
    });

    const sender = this.suiService.getSigner().getPublicKey().toSuiAddress();
    const network = process.env.NEXT_PUBLIC_SUI_NETWORK_NAME ?? "testnet";

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
