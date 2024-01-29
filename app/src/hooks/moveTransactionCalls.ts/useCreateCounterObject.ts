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
  const handleCreateCounterObject = async (total_bet_amount: number) => {
    setIsLoading(true);
    const keypair = await enokiFlow.getKeypair();
    console.log("keypair = ", keypair);
    //log a type of total_bet_amount
    console.log("total_bet_amount = ", typeof total_bet_amount);
    console.log("total_bet_amount = *************", total_bet_amount);
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

    return [game__id, vrf__input];
  };

  return {
    isLoading,
    counterNftId,
    handleCreateCounterObject,
  };
};