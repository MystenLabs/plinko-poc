import { useContext, useEffect, useState, createContext, useCallback } from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import BigNumber from "bignumber.js";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import { useSui } from "@/hooks/useSui";
import { useAuthentication } from "@/contexts/Authentication";
import { useRequestSui } from "@/hooks/useRequestSui";

export const useBalance = () => {
  const context = useContext(BalanceContext);
  return context;
};

interface BalanceContextProps {
  balance: BigNumber;
  isLoading: boolean;
  handleRefreshBalance: () => void;
}

export const BalanceContext = createContext<BalanceContextProps>({
  balance: BigNumber(0),
  isLoading: true,
  handleRefreshBalance: () => {},
});

export const BalanceProvider = ({ children }: ChildrenProps) => {
  const [balance, setBalance] = useState(BigNumber(0));
  const [isLoading, setIsLoading] = useState(false);
  const { suiClient } = useSui();
  const { user } = useAuthentication();
  const { effectTrigger } = useRequestSui();

  useEffect(() => {
    if (user.address) handleRefreshBalance();
  }, [user.address, effectTrigger]); 

  const handleRefreshBalance = useCallback(async () => {
    if (!user.address) return;
    console.log(`Refreshing balance for ${user.address}...`);
    setIsLoading(true);
    await suiClient
      .getBalance({
        owner: user.address!,
      })
      .then((resp) => {
        setIsLoading(false);
        setBalance(
          BigNumber(resp.totalBalance).dividedBy(
            BigNumber(Number(MIST_PER_SUI))
          )
        );
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        setBalance(BigNumber(0));
      });
  }, [user.address, suiClient]);

  return (
    <BalanceContext.Provider
      value={{ balance, handleRefreshBalance, isLoading }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
