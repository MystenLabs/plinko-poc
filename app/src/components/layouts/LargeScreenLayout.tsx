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
    <>
      <div
        className={`static w-full h-full flex-col items-center justify-center ${
          address ? "role-admin" : "role-anonymous"
        }`}
      >
        <TopNavbar/>
        <div>{children}</div>
        <div className="absolute bottom-0 left-0 p-8"><InfoIcon/></div>
      </div>
    </>
  );
};
