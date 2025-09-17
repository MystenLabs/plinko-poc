// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { ChildrenProps } from "@/types/ChildrenProps";
import React from "react";
import { TopNavbar } from "./navbars/TopNavbar";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { InfoIcon } from "./InfoIcon";

export const LargeScreenLayout = ({ children }: ChildrenProps) => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address!;

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden ${
        address ? "role-admin" : "role-anonymous"
      }`}
    >
      <TopNavbar />
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto px-4">{children}</div>
      </main>

      <div className="absolute bottom-4 left-4">
        <InfoIcon />
      </div>
    </div>
  );
};
