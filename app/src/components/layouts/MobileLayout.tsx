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
      <div className="px-4">
        <InfoIcon />
      </div>
    </div>
  );
};
