import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuthentication } from "@/contexts/Authentication";
import toast from "react-hot-toast";
import { useSui } from "./useSui";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import { useBalance } from "@/contexts/BalanceContext";

export const useRequestSui = () => {
  const { suiClient } = useSui();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const {
    user: { zkLoginSession, address },
  } = useAuthentication();
  const { user } = useAuthentication();
  const { handleRefreshBalance } = useBalance();

  const handleRequestSui = useCallback(async () => {
    setIsLoading(true);
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
