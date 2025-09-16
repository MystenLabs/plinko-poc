// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";

import React from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import { TopNavbar } from "./navbars/TopNavbar";

import { InfoIcon } from "@/components/layouts/InfoIcon";
import { useCurrentAccount } from "@mysten/dapp-kit";

export const MobileLayout = ({ children }: ChildrenProps) => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address!;

  return (
    <div
      className={`static flex-col w-full h-full ${
        address ? "role-admin" : "role-anonymous"
      }`}
    >
      <TopNavbar />
      {children}
      <div className="absolute bottom-2 left-2">
        <InfoIcon />
      </div>
    </div>
  );
};
