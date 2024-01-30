import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useState } from "react";
import { useAuthentication } from "@/contexts/Authentication";
import { set } from "zod";

const client = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_NETWORK!,
});

export const useCreateCounterObject = () => {
  const { enokiFlow } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  const [counterNftId, setCounterNftId] = useState("");
  const [gameId, setGameId] = useState("");
  const [vrfInput, setVrfInput] = useState("");
  const handleCreateCounterObject = async (total_bet_amount: number , numberofBalls: number) => {
    setIsLoading(true);
    const keypair = await enokiFlow.getKeypair();
    console.log("keypair = ", keypair);
    //log a type of total_bet_amount
    console.log("total_bet_amount = ", typeof total_bet_amount);
    console.log("total_bet_amount = *************", total_bet_amount);
    console.log("numberofBalls = ------------------- > ", numberofBalls);
    let player = keypair.getPublicKey().toSuiAddress();
    console.log("Player Address = **************" + player);

    const tx = new TransactionBlock();

    const betAmountCoin = tx.splitCoins(tx.gas, [
      tx.pure(total_bet_amount * 1000000000),
    ]);

    const counterNFT = tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::counter_nft::mint`,
      arguments: [],
    });

    const gameId = tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::plinko::start_game`,
      arguments: [
        counterNFT,
        betAmountCoin,
        tx.object(`${process.env.NEXT_PUBLIC_HOUSE_DATA_ID}`),
      ],
    });

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::counter_nft::transfer_to_sender`,
      arguments: [counterNFT],
    });

    tx.setGasBudget(1000000000);

    let res = await client.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      //@ts-ignore
      signer: keypair,
      options: {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
      },
    });

    console.log("************************", res);
    //vrf & game_id

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

    console.log("****game_id*** ", res?.events);
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
    console.log("game_id = ", game__id);
    console.log("VRF_Input = ", vrf__input);

    // Fetch API call for the game/plinko/end endpoint
    try {
      const response = await fetch('http://localhost:8080/game/plinko/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: "0xe1fc83f56f7e8016fdbc10a27c20ff6907516bea0529504c34ccd640df6400e8",
          blsSig: "[38, 116, 51, 100, 81, 12, 207, 166, 14, 208, 53, 40, 79, 73, 239, 56, 35, 56, 160, 45, 39, 122, 174, 7, 86, 48, 241, 79, 155, 176, 52, 58, 0, 0, 0, 0, 0, 0, 0, 0]",
          numberofBalls: 2,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from /game/plinko/end:", data);
    } catch (error) {
      console.error("Error in calling /game/plinko/end:", error);
    }

    return [game__id, vrf__input];
  };

  return {
    isLoading,
    counterNftId,
    handleCreateCounterObject,
  };
};
