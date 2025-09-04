import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { usePlayContext } from "../../contexts/PlayContext";
import { splitIntoPathsAndNormalize } from "@/helpers/traceFromTheEventToPathsForBalls";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

const client = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_NETWORK!,
});

export const useCreateGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gameId, setGameId] = useState("");

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction<SuiTransactionBlockResponse>({
      execute: async ({ bytes, signature }) => {
        return client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showEvents: true,
            showEffects: true,
            showObjectChanges: false,
          },
        });
      },
    });

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
      const tx = new Transaction();

      const betAmountCoin = tx.splitCoins(tx.gas, [
        tx.pure.u64(total_bet_amount * Number(MIST_PER_SUI)),
      ]);

      // Avoid shadowing React state "gameId"
      const _txGameCall = tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::plinko::start_game`,
        arguments: [
          betAmountCoin,
          tx.object(`${process.env.NEXT_PUBLIC_HOUSE_DATA_ID}`),
        ],
      });

      const res = await signAndExecuteTransaction({ transaction: tx });
      console.log("Response", res);

      // Real failure path => show popup and stop
      if (res.effects?.status.status === "failure") {
        console.error("TX failed:", res.effects?.status);
        setPopupInsufficientCoinBalanceIsVisible(true);
        setIsLoading(false);
        return;
      }

      // Extract game_id from events
      const evt = res.events?.find(
        (e: any) => e?.parsedJson && "game_id" in e.parsedJson
        // or stricter by type: e.type?.endsWith("::plinko::GameStarted")
      );

      const game_id: string | undefined = (
        evt?.parsedJson as { game_id?: string } | undefined
      )?.game_id;

      // If we didn't get a game_id, treat as insufficient-balance/invalid state
      if (!game_id) {
        setPopupInsufficientCoinBalanceIsVisible(true);
        setIsLoading(false);
        return;
      }

      // We have a game_id: store it and continue the flow
      setGameId(game_id);

      // --- Call backend only if we have a valid game_id ---
      try {
        const response = await fetch("http://localhost:8080/game/plinko/end", {
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
        // optional: surface an error toast here
      }

      return [game_id, finalPaths];
    } catch (err) {
      console.error("Unexpected error in handleCreateGame:", err);
      // optional: surface an error toast here
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
