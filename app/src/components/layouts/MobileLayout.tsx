// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";

import React from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import { TopNavbar } from "./navbars/TopNavbar";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Footer from "@/components/Footer";

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
      <div className="w-full mt-6 px-2">
        <Footer />
      </div>
    </div>
  );
};
