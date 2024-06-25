"use client";

import { ChildrenProps } from "@/types/ChildrenProps";
import React from "react";
import { InfoIcon } from "./InfoIcon";
import { TopNavbar } from "./navbars/TopNavbar";
import { useZkLogin } from "@mysten/enoki/react";

const NAVBAR_WIDTH = 350;

export const LargeScreenLayout = ({ children }: ChildrenProps) => {
  const { address } = useZkLogin();

  return (
    <div
      className={`relative w-full h-screen flex-col ${
        address ? "role-admin" : "role-anonymous"
      }`}
    >
      <TopNavbar/>
      {/* <div className="flex-1 p-4 bg-grey-100"> */}
      <div>{children}</div>
      {/* </div> */}
      <InfoIcon/>
    </div>
  );
};
