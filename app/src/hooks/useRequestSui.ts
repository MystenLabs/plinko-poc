// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSui } from "./useSui";
import { useBalance } from "@/contexts/BalanceContext";
import { useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import {
  isEnokiWallet,
  EnokiWallet,
  getSession,
  AuthProvider,
} from "@mysten/enoki";

export const useRequestSui = () => {
  const { suiClient } = useSui();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [jwt, setJwt] = useState<string | null>(null);

  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { handleRefreshBalance } = useBalance();

  const wallets = useWallets().filter(isEnokiWallet);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const walletsByProvider = wallets.reduce<
          Map<AuthProvider, EnokiWallet>
        >((map, wallet) => {
          map.set(wallet.provider, wallet);
          return map;
        }, new Map<AuthProvider, EnokiWallet>());

        const googleWallet = walletsByProvider.get("google");
        if (!googleWallet) {
          if (active) setJwt(null);
          return;
        }

        const session = await getSession(googleWallet);
        if (active) {
          setJwt(session?.jwt ?? null);
        }
      } catch (err) {
        console.error("Failed to load Enoki session", err);
        if (active) setJwt(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [wallets]);

  const handleRequestSui = useCallback(async () => {
    if (!jwt) {
      toast.error("Missing login session; please sign in again.");
      return;
    }

    setIsLoading(true);
    try {
      const resp = await axios.get(
        "https://pocs-faucet.vercel.app/api/faucet",
        {
          headers: {
            "Enoki-api-key": process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      await suiClient.waitForTransaction({
        digest: resp.data.txDigest,
      });

      handleRefreshBalance();
      toast.success("SUI received");
    } catch (err) {
      console.error(err);
      toast.error("Faucet limitation reached. Try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [jwt, suiClient, handleRefreshBalance]);

  return {
    isLoading,
    balance,
    handleRequestSui,
  };
};
