"use client";

import React from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import { TopNavbar } from "./navbars/TopNavbar";
import { useZkLogin } from "@mysten/enoki/react";
import { InfoIcon } from "@/components/layouts/InfoIcon";

export const MobileLayout = ({ children }: ChildrenProps) => {
  const { address } = useZkLogin();

  return (
    <div
      className={`flex flex-col w-full min-h-screen relative ${
        address ? "role-admin" : "role-anonymous"
      }`}
    >
      <div className="flex-1 flex flex-col space-y-2">
        <TopNavbar />
        <div className="p-2">{children}</div>
        <InfoIcon/>
      </div>
    </div>
  );
};
