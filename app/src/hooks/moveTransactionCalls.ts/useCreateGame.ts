// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { usePlayContext } from "@/contexts/PlayContext";
import { splitIntoPathsAndNormalize } from "@/helpers/traceFromTheEventToPathsForBalls";
import { MIST_PER_SUI, toBase64 } from "@mysten/sui/utils";
import {
  useCurrentAccount,
  useCurrentClient,
  useDAppKit,
} from "@mysten/dapp-kit-react";
import * as plinko from "../../generated/plinko/plinko";

type CoreEvent = { json?: Record<string, unknown> | null; eventType?: string };

function extractGameId(events?: CoreEvent[]): string | undefined {
  if (!events?.length) return undefined;

  const hit = events.find(
    (e) =>
      typeof e?.json === "object" &&
      e.json !== null &&
      "game_id" in e.json
  );

  if (hit?.json?.game_id) return hit.json.game_id as string;

  const pj = events[0]?.json;
  if (typeof pj === "object" && pj !== null) {
    const maybe = pj.game_id;
    if (typeof maybe === "string") return maybe;
  }
  return undefined;
}

export const useCreateGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gameId, setGameId] = useState("");

  const currentAccount = useCurrentAccount();
  const sender = currentAccount?.address;

  const client = useCurrentClient();
  const dAppKit = useDAppKit();

  const { finalPaths, setFinalPaths, setTxDigest, showError } =
    usePlayContext();

  const handleCreateGame = async (
    total_bet_amount: number,
    numberofBalls: number
  ) => {
    setIsLoading(true);
    try {
      if (!sender) {
        showError("No wallet/account connected.");
        return;
      }

      const betInMist = BigInt(
        Math.trunc(total_bet_amount * Number(MIST_PER_SUI))
      );

      // 1) Create the tx and get TransactionKind bytes
      const tx = new Transaction();
      tx.setSender(sender);
      const betCoin = coinWithBalance({
        type: "0x2::sui::SUI",
        balance: betInMist,
        useGasCoin: false, // important for sponsorship
      })(tx);
      tx.add(
        plinko.startGame({
          package: process.env.NEXT_PUBLIC_PACKAGE_ADDRESS,
          arguments: [betCoin, `${process.env.NEXT_PUBLIC_HOUSE_DATA_ID}`],
        })
      );

      const txBytes = await tx.build({
        client,
        onlyTransactionKind: true,
      });

      // 2) Sponsor the un-signed TxBytes
      const sponsorResp = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionKindBytes: toBase64(txBytes),
          sender,
        }),
      });

      if (!sponsorResp.ok) {
        console.error("Failed to sponsor transaction:", sponsorResp.status);
        showError("Failed to sponsor transaction. Please try again.");
        return;
      }

      const { bytes: sponsoredBytes, digest: sponsoredDigest } =
        (await sponsorResp.json()) as { bytes: string; digest: string };

      // 3) Sign the sponsored TxBytes
      const { signature } = await dAppKit.signTransaction({
        transaction: sponsoredBytes,
      });

      // 4) Execute the sponsored + signed TxBytes
      const execResp = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digest: sponsoredDigest, signature }),
      });

      if (!execResp.ok) {
        console.error("Failed to execute transaction:", execResp.status);
        showError("Failed to execute transaction. Please try again.");
        return;
      }

      const { digest: executedDigest } = (await execResp.json()) as {
        digest: string;
      };

      await client.core.waitForTransaction({
        digest: executedDigest,
        timeout: 10_000,
      });

      const txResult = await client.core.getTransaction({
        digest: executedDigest,
        include: {
          effects: true,
          events: true,
        },
      });

      const txData = txResult.Transaction ?? txResult.FailedTransaction;
      if (!txData) {
        showError("Transaction result not found.");
        return;
      }

      if (!txData.effects.status.success) {
        console.error("TX failed:", txData.effects.status);
        showError(txData.effects.status.error ?? "Transaction failed.");
        return;
      }

      // Extract game_id from events
      const game_id = extractGameId(
        txData.events as CoreEvent[] | undefined
      );

      if (!game_id) {
        showError("Could not start game. Please try again.");
        return;
      }

      // We have a game_id: store it and continue the flow
      setGameId(game_id);
      if (executedDigest) setTxDigest(String(executedDigest));

      // Call backend only if we have a valid game_id
      try {
        const response = await fetch("/api/game/plinko/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: game_id, numberofBalls }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const traceVector = data.trace;
        const txDigest = data.transactionDigest;

        if (txDigest) setTxDigest(String(txDigest));

        const final_paths_t = await splitIntoPathsAndNormalize(traceVector);
        setFinalPaths(final_paths_t);
      } catch (err) {
        console.error("Error calling /game/plinko/end:", err);
        showError("Failed to complete game calculation. Please try again.");
      }

      return [game_id, finalPaths];
    } catch (err) {
      console.error("Unexpected error in handleCreateGame:", err);
      showError("Unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCreateGame,
  };
};
