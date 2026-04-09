// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import "server-only";

import { EnokiClient } from "@mysten/enoki";
import { SuiService } from "@/app/api/services/SuiService";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64, toBase64 } from "@mysten/sui/utils";
import { enokiClient } from "@/app/api/EnokiClient";
import * as plinko from "../../../generated/plinko/plinko";

type CoreEvent = { json?: Record<string, unknown> | null; eventType?: string };

function extractTrace(events?: CoreEvent[]): number[] | undefined {
  if (!events?.length) return undefined;

  for (const event of events) {
    const parsed = event.json;
    if (parsed && typeof parsed === "object" && "trace" in parsed) {
      const trace = parsed.trace;
      // gRPC returns vector<u8> as base64 string; decode to number array
      if (typeof trace === "string") {
        return Array.from(fromBase64(trace));
      }
      // JSON-RPC returned it as number array directly
      if (Array.isArray(trace)) {
        return trace as number[];
      }
    }
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
  ): Promise<{ trace: number[]; transactionDigest: string }> {
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

    await this.suiService.getClient().core.waitForTransaction({
      digest: exec.digest,
      timeout: 10_000,
    });

    const txResult = await this.suiService.getClient().core.getTransaction({
      digest: exec.digest,
      include: {
        effects: true,
        events: true,
      },
    });

    const txData = txResult.Transaction ?? txResult.FailedTransaction;
    if (!txData) {
      throw new Error("Transaction result not found");
    }

    if (!txData.effects.status.success) {
      throw new Error(
        `Transaction failed: ${txData.effects.status.error ?? "unknown error"}`
      );
    }

    const trace = extractTrace(
      txData.events as CoreEvent[] | undefined
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
