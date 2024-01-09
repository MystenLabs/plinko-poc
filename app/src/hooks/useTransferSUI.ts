import { useState } from "react";
import { useSui } from "./useSui";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { MIST_PER_SUI, fromB64 } from "@mysten/sui.js/utils";
import toast from "react-hot-toast";
import { useAuthentication } from "@/contexts/Authentication";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

interface HandleTransferSUIProps {
  amount: number;
  recipient: string;
  refresh?: () => void;
}

export const useTransferSUI = () => {
  const { user: {zkLoginSession } } = useAuthentication();
  const { suiClient } = useSui();
  const [isLoading, setIsLoading] = useState(false);

  const handleTransferSUI = async ({
    amount,
    recipient,
    refresh,
  }: HandleTransferSUIProps) => {
    setIsLoading(true);

    const tx = new TransactionBlock();
    let coin = tx.splitCoins(tx.gas, [tx.pure(amount * Number(MIST_PER_SUI))]);
    tx.transferObjects([coin], tx.pure(recipient));

    const keypair = zkLoginSession?.ephemeralKeyPair;
    let privateKeyArray = Uint8Array.from(Array.from(fromB64(keypair!)));
    const signer = Ed25519Keypair.fromSecretKey(privateKeyArray)

    await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })
      .then((resp) => {
        console.log(resp);
        if (resp.effects?.status.status !== "success") {
          throw new Error("Transaction failed");
        }
        setIsLoading(false);
        toast.success("SUI transferred successfully!");
        !!refresh && refresh();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Transaction failed");
        setIsLoading(false);
      });
  };

  return {
    isLoading,
    handleTransferSUI,
  };
};
