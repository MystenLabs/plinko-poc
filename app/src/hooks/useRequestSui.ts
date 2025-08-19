import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSui } from "./useSui";
import { useBalance } from "@/contexts/BalanceContext";
import { useZkLogin, useZkLoginSession } from "@mysten/enoki/react";

export const useRequestSui = () => {
  const { suiClient } = useSui();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const { address } = useZkLogin();
  const zkLoginSession = useZkLoginSession();
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
        await suiClient.waitForTransaction({
          digest: resp.data.txDigest,
        });
        handleRefreshBalance();
        toast.success("SUI received");
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toast.error("Faucet limitation reached. Try again later.");
      });
  }, [zkLoginSession?.jwt]);

  return {
    isLoading,
    balance,
    handleRequestSui,
  };
};
