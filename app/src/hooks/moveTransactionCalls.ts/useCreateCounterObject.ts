import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { usePlayContext } from "../../contexts/PlayContext";
import { splitIntoPathsAndNormalize } from "@/helpers/traceFromTheEventToPathsForBalls";
import { MIST_PER_SUI } from "@mysten/sui/utils";
//TODO: Refactor deprecated EnokiFlow
import { useEnokiFlow } from "@mysten/enoki/react";

const client = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_NETWORK!,
});

export const useCreateCounterObject = () => {
  const enokiFlow = useEnokiFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [counterNftId, setCounterNftId] = useState("");
  const [gameId, setGameId] = useState("");
  const [vrfInput, setVrfInput] = useState("");

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

    const keypair = await enokiFlow.getKeypair();
    let player = keypair.getPublicKey().toSuiAddress();
    const tx = new Transaction();

    const betAmountCoin = tx.splitCoins(tx.gas, [
      tx.pure.u64(total_bet_amount * Number(MIST_PER_SUI)),
    ]);

    const counterNFT = tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::counter_nft::mint`,
      arguments: [],
    });

    const gameId = tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::plinko::start_game`,
      arguments: [
        counterNFT,
        tx.pure.u64(numberofBalls),
        betAmountCoin,
        tx.object(`${process.env.NEXT_PUBLIC_HOUSE_DATA_ID}`),
      ],
    });

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::counter_nft::transfer_to_sender`,
      arguments: [counterNFT],
    });

    let res = await client.signAndExecuteTransaction({
      transaction: tx,
      requestType: "WaitForLocalExecution",
      //@ts-ignore
      signer: keypair,
      options: {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
      },
    });

    if (res?.effects?.status.status === "success") {
      res?.objectChanges?.find((obj) => {
        if (
          obj.type === "created" &&
          obj.objectType.endsWith("counter_nft::Counter")
        ) {
          setCounterNftId(obj.objectId);
        }
      });
    }
    if (res?.effects?.status.status === "failure") {
      console.log("Error = ", res?.effects);
    }

    let events = res?.events?.find((obj) => {
      //@ts-ignore
      if (obj.parsedJson?.game_id) {
        //@ts-ignore
        return obj.parsedJson?.game_id;
      }
    });
    //@ts-ignore
    let game__id = events?.parsedJson?.game_id;
    //@ts-ignore
    let vrf__input = events?.parsedJson?.vrf_input;
    setGameId(game__id);
    setVrfInput(vrf__input);

    if (typeof game__id === "undefined" || typeof vrf__input === "undefined") {
      setPopupInsufficientCoinBalanceIsVisible(true);
    }

    // Fetch API call for the game/plinko/end endpoint
    try {
      const response = await fetch(
        "https://plinko-poc-api.vercel.app/game/plinko/end",
        // "http://localhost:8080/game/plinko/end",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: game__id,
            vrfInput: vrf__input,
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

    return [game__id, vrf__input, final_paths];
  };

  return {
    isLoading,
    counterNftId,
    handleCreateCounterObject,
  };
};
