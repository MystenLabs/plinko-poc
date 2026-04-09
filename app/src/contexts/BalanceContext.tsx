// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
  useContext,
  useEffect,
  useState,
  createContext,
  useCallback,
} from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import BigNumber from "bignumber.js";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { useSui } from "@/hooks/useSui";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

export const useBalance = () => {
  const context = useContext(BalanceContext);
  return context;
};

interface BalanceContextProps {
  balance: BigNumber;
  isLoading: boolean;
  handleRefreshBalance: () => void;
  decreaseDisplayedBalance: (amountSui: number) => void;
  increaseDisplayedBalance: (amountSui: number) => void;
}

export const BalanceContext = createContext<BalanceContextProps>({
  balance: BigNumber(0),
  isLoading: true,
  handleRefreshBalance: () => {},
  decreaseDisplayedBalance: () => {},
  increaseDisplayedBalance: () => {},
});

export const BalanceProvider = ({ children }: ChildrenProps) => {
  // Base balance fetched from the network
  const [fetchedBalance, setFetchedBalance] = useState(BigNumber(0));
  // Adjustment applied to the displayed balance
  const [displayedDelta, setDisplayedDelta] = useState(BigNumber(0));
  const [isLoading, setIsLoading] = useState(false);
  const { suiClient } = useSui();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address!;

  useEffect(() => {
    if (address) handleRefreshBalance();
  }, [address]);

  const handleRefreshBalance = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    await suiClient.core
      .getBalance({
        owner: address,
      })
      .then((resp) => {
        setIsLoading(false);
        setFetchedBalance(
          BigNumber(resp.balance.balance).dividedBy(
            BigNumber(Number(MIST_PER_SUI))
          )
        );
        // Reset display adjustment after syncing with chain
        setDisplayedDelta(BigNumber(0));
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        setFetchedBalance(BigNumber(0));
        setDisplayedDelta(BigNumber(0));
      });
  }, [address, suiClient]);

  const decreaseDisplayedBalance = useCallback((amountSui: number) => {
    if (!Number.isFinite(amountSui) || amountSui <= 0) return;
    setDisplayedDelta((prev) => prev.minus(amountSui));
  }, []);

  const increaseDisplayedBalance = useCallback((amountSui: number) => {
    if (!Number.isFinite(amountSui) || amountSui <= 0) return;
    setDisplayedDelta((prev) => prev.plus(amountSui));
  }, []);

  // Displayed balance = fetched + display delta
  const balance = fetchedBalance.plus(displayedDelta);

  return (
    <BalanceContext.Provider
      value={{
        balance,
        handleRefreshBalance,
        isLoading,
        decreaseDisplayedBalance,
        increaseDisplayedBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
