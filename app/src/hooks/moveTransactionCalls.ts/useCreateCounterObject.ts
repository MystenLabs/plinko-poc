import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { usePlayContext } from "../../contexts/PlayContext";
import { splitIntoPathsAndNormalize } from "@/helpers/traceFromTheEventToPathsForBalls";
import { MIST_PER_SUI } from "@mysten/sui/utils";
//TODO: Refactor deprecated EnokiFlow
// import { useEnokiFlow } from "@mysten/enoki/react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

const client = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_NETWORK!,
});

export const useCreateCounterObject = () => {
  // const enokiFlow = useEnokiFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [counterNftId, setCounterNftId] = useState("");
  const [gameId, setGameId] = useState("");
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction<SuiTransactionBlockResponse>({
      // This runs AFTER the wallet signs; you decide how to execute it on the node:
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
          // requestType is optional; defaults are fine for most cases
          // requestType: 'WaitForEffectsCert',
        });
      },
    });

  const {
    //@ts-ignore
    final_paths,
    setFinalPaths,
    setPopupInsufficientCoinBalanceIsVisible,
    setTxDigest,
  } = usePlayContext();
  const handleCreateCounterObject = async (
    total_bet_amount: number,
    numberofBalls: number
  ) => {
    setIsLoading(true);

    // const keypair = await enokiFlow.getKeypair();
    // let player = keypair.getPublicKey().toSuiAddress();
    const tx = new Transaction();

    const betAmountCoin = tx.splitCoins(tx.gas, [
      tx.pure.u64(total_bet_amount * Number(MIST_PER_SUI)),
    ]);

    const gameId = tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::plinko::start_game`,
      arguments: [
        betAmountCoin,
        tx.object(`${process.env.NEXT_PUBLIC_HOUSE_DATA_ID}`),
      ],
    });

    const res = await signAndExecuteTransaction({ transaction: tx });
    if (res.effects?.status.status === "failure") {
      console.error("TX failed:", res.effects?.status);
      // onInsufficientBalance?.();
      return;
    }
    // Extract game_id from events
    const evt = res.events?.find(
      (e: any) => e?.parsedJson && "game_id" in e.parsedJson
      // or match by type:
      // (e: any) => e.type?.endsWith('::plinko::GameStarted')
    );
    //@ts-ignore
    const game_id: string | undefined = evt?.parsedJson?.game_id;

    if (game_id) setGameId?.(game_id);
    // else onInsufficientBalance?.();
    console.log(res, "Response");
    // let res = await client.signAndExecuteTransaction({
    //   transaction: tx,
    //   //@ts-ignore
    //   signer: keypair,
    //   options: {
    //     showEffects: true,
    //     showObjectChanges: true,
    //     showEvents: true,
    //   },
    // });

    // if (res?.effects?.status.status === "success") {
    //   res?.objectChanges?.find((obj) => {
    //     if (
    //       obj.type === "created" &&
    //       obj.objectType.endsWith("counter_nft::Counter")
    //     ) {
    //       setCounterNftId(obj.objectId);
    //     }
    //   });
    // }
    // if (res?.effects?.status.status === "failure") {
    //   console.log("Error = ", res?.effects);
    // }

    // let events = res?.events?.find((obj) => {
    //   //@ts-ignore
    //   if (obj.parsedJson?.game_id) {
    //     //@ts-ignore
    //     return obj.parsedJson?.game_id;
    //   }
    // });
    // //@ts-ignore
    // let game__id = events?.parsedJson?.game_id;
    //@ts-ignore
    // setGameId(game__id);

    if (typeof game__id === "undefined") {
      setPopupInsufficientCoinBalanceIsVisible(true);
    }

    // Fetch API call for the game/plinko/end endpoint
    try {
      //TOOD: Make this dynamic depending on the host
      const response = await fetch(
        // "https://plinko-poc-api.vercel.app/game/plinko/end",
        "http://localhost:8080/game/plinko/end",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: game_id,
            numberofBalls: numberofBalls,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming the trace vector is directly in the data object; adjust according to actual structure
      const traceVector = data.trace;
      const txDigest = data.transactionDigest;
      setTxDigest(txDigest.toString());
      const final_paths_t = await splitIntoPathsAndNormalize(traceVector);
      setFinalPaths(final_paths_t);
    } catch (error) {
      console.error("Error in calling /game/plinko/end:", error);
    }

    return [game_id, final_paths];
  };

  return {
    isLoading,
    counterNftId,
    handleCreateCounterObject,
  };
};
