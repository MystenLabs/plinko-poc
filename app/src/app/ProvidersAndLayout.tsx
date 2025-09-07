// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { LargeScreenLayout } from "@/components/layouts/LargeScreenLayout";
import { MobileLayout } from "@/components/layouts/MobileLayout";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRegisterServiceWorker } from "@/hooks/useRegisterServiceWorker";
import { ChildrenProps } from "@/types/ChildrenProps";
import React from "react";
import { Toaster } from "react-hot-toast";
import backgroundImage from "../../public/Tablebackground.svg";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { RegisterEnokiWallets } from "@/contexts/RegisterEnokiWallets";

export const ProvidersAndLayout = ({ children }: ChildrenProps) => {
  const _ = useRegisterServiceWorker();
  const { isMobile } = useIsMobile();
  const queryClient = new QueryClient();
  const { networkConfig } = createNetworkConfig({
    [process.env.NEXT_PUBLIC_SUI_NETWORK_NAME!]: {
      url: process.env.NEXT_PUBLIC_SUI_NETWORK!,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={process.env.NEXT_PUBLIC_SUI_NETWORK_NAME!}
      >
        <RegisterEnokiWallets />
        <WalletProvider autoConnect slushWallet={{ name: "Plinko PoC" }}>
          <BalanceProvider>
            <main
              className={`min-h-screen w-full overflow-hidden bg-black`}
              style={{
                backgroundImage: `url(${backgroundImage.src})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              {!!isMobile && <MobileLayout>{children}</MobileLayout>}
              {!isMobile && <LargeScreenLayout>{children}</LargeScreenLayout>}
              <Toaster
                position="bottom-center"
                toastOptions={{
                  duration: 5000,
                }}
              />
            </main>
          </BalanceProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};
