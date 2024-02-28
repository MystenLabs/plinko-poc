import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuthentication } from "@/contexts/Authentication";
import toast from "react-hot-toast";
import { useSui } from "./useSui";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

export const useRequestSui = () => {
  const { suiClient } = useSui();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const {
    user: { zkLoginSession, address },
  } = useAuthentication();

  useEffect(() => {
    if (address) handleRefreshBalance();
  }, [address]);

  const handleRefreshBalance = async () => {
    await suiClient
      .getBalance({
        owner: address,
      })
      .then((resp) => {
        setBalance(Number(resp.totalBalance) / Number(MIST_PER_SUI));
      })
      .catch((err) => {
        console.error(err);
        setBalance(0);
      });
  };

  const handleRequestSui = useCallback(async () => {
    setIsLoading(true);
    console.log({
      enokiApiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
      jwt: zkLoginSession?.jwt,
    });
    await axios
      .get("https://pocs-faucet.vercel.app/api/faucet", {
        headers: {
          "Enoki-api-key": process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
          Authorization: `Bearer ${zkLoginSession?.jwt}`,
        },
      })
      .then(async (resp) => {
        setIsLoading(false);
        await suiClient.waitForTransactionBlock({
          digest: resp.data.txDigest,
        });
        handleRefreshBalance();
        toast.success("SUI received");
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toast.error("Failed to receive SUI");
      });
  }, [zkLoginSession?.jwt]);

  return {
    isLoading,
    balance,
    handleRequestSui,
  };
};