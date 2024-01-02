import React, { useState } from "react";
import {TransactionBlock } from "@mysten/sui.js/transactions";
import { useWalletKit } from "@mysten/wallet-kit";
import { useSui } from "./useSui";
import { getSigner, BlsService } from "../helpers/blsSigns";
import { contractVersion, houseData, packageId } from "../utils/config";
import { bytesToHex } from "@noble/hashes/utils";

// to update this imports with the new sdk
import {
    getCreatedObjects,
    getEvents,
    getExacutionStatus,
    getExacutionStatusGasSummary,
} from "@mysten/sui.js";

// // isos auto na min mporei na ginei gt thelei polla
// interface HandleStartGameArgs {
//     ball_place: number;
//     counter: Counter;
//     // to coin den xreiazetai gt to pairneis apo to tx
//     house_data: HouseData;
// }

// interface HandleFinishGameArgs {
//     // fill this...
// }

const STAKE_AMOUNT = 1_000_000_000;
const COUNTER_ID = "";
let blsService = new BlsService();

function getGameObjects(createdObjects: any) {
    let sharedObjs = createdObjects.filter(
        (obj: any) =>
        obj.owner?.ObjectOwner !== ""//address here
    );
    return sharedObjs.map((obj: any) => obj.reference.objectId);
}

// Building transaction
// to start game ousiastika mporei na ginei sign apo ton player

export const useStartGame = () => {
    const { signTransactionBlock, signAndExecuteTransactionBlock } =
    useWalletKit();
    const { executeSignedTransactionBlock } = useSui();

    const [isLoading, setIsLoading] = useState(false);

    const handleCall = async ({}: //fill this...
        HandleStartGameArgs) => {
            const tx = new TransactionBlock();

            let coin = tx.splitCoins(tx.gas, [tx.pure(STAKE_AMOUNT)]);

            tx.moveCall({
                target: `${process.env.NEXT_PUBLIC_PACKAGE}::plinko::start_game`,
                arguments: [
                    // todo where should I set this up?
                    tx.pure(ball_placement),
                    tx.object(COUNTER_ID),
                    coin,
                    tx.object(houseData),
                ],
            });

            const signedTx = await signTransactionBlock({ transactionBlock: tx });
            await executeSignedTransactionBlock({
                signedTx,
                requestType: "WaitForLocalExecution",
                options: {
                    showEffects: true,
                },
            })
            .then((resp) => {
                console.log(resp);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
        });
    };

    return {
        handleCall: () => {},
        isLoading,
    };

};

export const useFinishGame = () => {
    const { signTransactionBlock, signAndExecuteTransactionBlock } =
    useWalletKit();
    const { executeSignedTransactionBlock } = useSui();

    const [isLoading, setIsLoading] = useState(false);

    const handleCall = async ({}:
        HandleFinishGameArgs) => {
            const tx = new TransactionBlock();
            // na do ligo to provider pou na to theso i apo pou na to perno, vasika auto paizei
            // na prepei na to kalo allou kai na ta pernao edo mesa

            tx.moveCall({
                target: `${process.env.NEXT_PUBLIC_PACKAGE}::plinko::finish_game`,
                arguments: [
                    tx.pure(gameId),
                    tx.pure(Array.from(signature)),
                    tx.object(houseData),
                ],
            });
            //fill tx..

            const signedTx = await signTransactionBlock({ transactionBlock: tx});
            await executeSignedTransactionBlock({
                signedTx,
                requestType: "WaitForLocalExecution",
                options: {
                    showEffects: true,
                    showEvents: true,
                },
            })
            .then((resp) =>{
                console.log(resp);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
            });

            // console.log(getExecutionStatusGasSummary(res));
            // console.log(getExecutionStatus(res));

            // let outcomes: any = getEvents(res)?.filter((event: any) =>
            //     event.type.includes("Outcome")
            // );

            // if (outcomes.length === 1) {
            //     console.log(outcomes);
            // }
            // return outcomes.map((outcome: any) => outcome?.parsedJson);
            // }
    };
    
    return {
        handleCall: () => {},
        isLoading,
    };
};