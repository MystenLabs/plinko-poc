// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { usePlayContext } from "../../contexts/PlayContext";
import { splitIntoPathsAndNormalize } from "@/helpers/traceFromTheEventToPathsForBalls";
import { MIST_PER_SUI, fromB64, toB64 } from "@mysten/sui/utils";
import { useCurrentAccount, useSignTransaction } from "@mysten/dapp-kit";

const client = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_NETWORK!,
});

const API_BASE =
  // process.env.NEXT_PUBLIC_API_BASE ??
  // process.env.NEXT_PUBLIC_BACKEND_API ??
  "http://localhost:8080";

type EventWithParsedJson = { parsedJson?: unknown; type?: string };

function extractGameId(events?: EventWithParsedJson[]): string | undefined {
  if (!events?.length) return undefined;

  // Prefer the first event that has a `game_id` field in parsedJson
  const hit = events.find(
    (e) =>
      typeof e?.parsedJson === "object" &&
      e.parsedJson !== null &&
      "game_id" in (e.parsedJson as Record<string, unknown>)
  ) as { parsedJson: { game_id?: string } } | undefined;

  if (hit?.parsedJson?.game_id) return hit.parsedJson.game_id;

  // Fallback: check first event defensively
  const pj = events[0]?.parsedJson;
  if (typeof pj === "object" && pj !== null) {
    const maybe = (pj as Record<string, unknown>).game_id;
    if (typeof maybe === "string") return maybe;
  }
  return undefined;
}

export const useCreateGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gameId, setGameId] = useState("");

  const currentAccount = useCurrentAccount();
  const sender = currentAccount?.address;

  // We only need to sign the sponsored bytes, not execute them on the wallet.
  const { mutateAsync: signTransaction } = useSignTransaction();

  const {
    finalPaths,
    setFinalPaths,
    setPopupInsufficientCoinBalanceIsVisible,
    setTxDigest,
  } = usePlayContext();

  const handleCreateGame = async (
    total_bet_amount: number,
    numberofBalls: number
  ) => {
    setIsLoading(true);
    try {
      if (!sender) {
        console.error("No wallet/account connected.");
        setPopupInsufficientCoinBalanceIsVisible(true);
        return;
      }
      const betInMist = total_bet_amount * Number(MIST_PER_SUI);
      const coinsResp = await client.getCoins({
        owner: sender,
        coinType: "0x2::sui::SUI",
      });
      const coin = coinsResp.data.find((c) => BigInt(c.balance) >= betInMist);
      if (!coin) {
        // (optional) implement merge or show insufficient balance
        setPopupInsufficientCoinBalanceIsVisible(true);
        return;
      }
      // 1) Create the tx and get TransactionKind bytes
      const tx = new Transaction();

      const betAmountCoin = tx.splitCoins(coin.coinObjectId, [
        tx.pure.u64(betInMist),
      ]);

      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::plinko::start_game`,
        arguments: [
          betAmountCoin,
          tx.object(`${process.env.NEXT_PUBLIC_HOUSE_DATA_ID}`),
        ],
      });

      const txBytes = await tx.build({
        client,
        onlyTransactionKind: true,
      });

      // 2) Sponsor (POST /sponsor). Expect { bytes, digest }
      const sponsorResp = await fetch(`${API_BASE}/sponsor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionKindBytes: toB64(txBytes),
          sender, // your wallet address
        }),
      });

      if (!sponsorResp.ok) {
        console.error("Failed to sponsor transaction:", sponsorResp.status);
        setPopupInsufficientCoinBalanceIsVisible(true);
        return;
      }

      const { bytes: sponsoredBytes, digest: sponsoredDigest } =
        (await sponsorResp.json()) as { bytes: string; digest: string };

      // 3) Sign the sponsored TxBytes with the connected wallet
      const { signature } = await signTransaction({
        transaction: sponsoredBytes,
      });

      // 4) Execute (POST /execute) with digest + signature. Expect { digest }
      const execResp = await fetch(`${API_BASE}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digest: sponsoredDigest, signature }),
      });

      if (!execResp.ok) {
        console.error("Failed to execute transaction:", execResp.status);
        setPopupInsufficientCoinBalanceIsVisible(true);
        return;
      }

      const { digest: executedDigest } = (await execResp.json()) as {
        digest: string;
      };

      // 5) Wait for finality (optional but recommended)
      await client.waitForTransaction({
        digest: executedDigest,
        timeout: 10_000,
      });

      // 6) Query the executed tx to read effects/events
      const txResult: SuiTransactionBlockResponse =
        await client.getTransactionBlock({
          digest: executedDigest,
          options: {
            showEffects: true,
            showEvents: true,
            showObjectChanges: false,
          },
        });

      if (txResult.effects?.status.status === "failure") {
        console.error("TX failed:", txResult.effects?.status);
        setPopupInsufficientCoinBalanceIsVisible(true);
        return;
      }

      // Extract game_id from events (same logic as before, but now from queried tx)
      const game_id = extractGameId(
        txResult.events as EventWithParsedJson[] | undefined
      );

      if (!game_id) {
        // Treat missing game_id as insufficient/invalid state
        setPopupInsufficientCoinBalanceIsVisible(true);
        return;
      }

      // We have a game_id: store it and continue the flow
      setGameId(game_id);
      if (executedDigest) setTxDigest(String(executedDigest));

      // --- Call backend only if we have a valid game_id ---
      try {
        const response = await fetch(`${API_BASE}/game/plinko/end`, {
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
      }

      return [game_id, finalPaths];
    } catch (err) {
      console.error("Unexpected error in handleCreateGame:", err);
      setPopupInsufficientCoinBalanceIsVisible(true); // safe fallback
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCreateGame,
  };
};
