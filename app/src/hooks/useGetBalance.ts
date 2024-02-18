import { useEffect, useState } from "react";
import { useSui } from "./useSui";
import { GeneralSuiObject } from "@/types/GeneralSuiObject";
import { useAuthentication } from "@/contexts/Authentication";
import { CoinBalance } from "@mysten/sui.js";
import { set } from "zod";

export const useGetBalance = () => {
  const { suiClient } = useSui();
  const {
    user: { address },
  } = useAuthentication();

  const [coinBalance, setCoinBalance] = useState<CoinBalance>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!!address) {
      reFetchData();
    } else {
      setCoinBalance(undefined);
      setIsLoading(false);
      setIsError(false);
    }
  }, [address]);

  const reFetchData = async () => {
    setIsLoading(true);
    const allData = [];

    try {
      const coin_balance = await suiClient.getBalance({
        owner: address!,
      }); //! Check the address

      setCoinBalance(coin_balance);
      setIsLoading(false);
      setIsError(false);
    } catch (err) {
      console.log(err);
      setCoinBalance(undefined);
      setIsLoading(false);
      setIsError(true);
    }
  };

  return {
    coinBalance,
    isLoading,
    isError,
    reFetchData,
  };
};
