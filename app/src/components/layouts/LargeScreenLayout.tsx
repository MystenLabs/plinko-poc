"use client";

import { ChildrenProps } from "@/types/ChildrenProps";
import React from "react";
import { InfoIcon } from "./InfoIcon";
import { TopNavbar } from "./navbars/TopNavbar";
import { useCurrentAccount } from "@mysten/dapp-kit";

const NAVBAR_WIDTH = 350;

export const LargeScreenLayout = ({ children }: ChildrenProps) => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address!;

  return (
    <>
      <div
        className={`static w-full h-full flex-col items-center justify-center ${
          address ? "role-admin" : "role-anonymous"
        }`}
      >
        <TopNavbar />
        <div>{children}</div>
        <div className="absolute bottom-0 left-0 p-8">
          <InfoIcon />
        </div>
      </div>
    </>
  );
};
