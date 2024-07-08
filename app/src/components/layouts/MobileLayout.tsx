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
      className={`static flex-col w-full h-full ${
        address ? "role-admin" : "role-anonymous"
      }`}
    >
      <TopNavbar/>
      {children}
      <div className="px-4"><InfoIcon/></div>
    </div>
  );
};
