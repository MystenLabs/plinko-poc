import React from "react";
import Link from "next/link";
import { UserProfileMenu } from "@/components/general/UserProfileMenu";
import { Balance } from "@/components/general/Balance";
import { useZkLogin } from "@mysten/enoki/react";

export const TopNavbar = () => {
  const { address } = useZkLogin();

  return (
    <>
      <div className="sticky top-0 w-full flex justify-evenly items-center bg-white py-3 px-5 z-40">
        <span className="text-opacity-90 text-[14px] text-[#4F4F4F]">[Plinko Game] is provided for testnet purposes only and do not involve real money or the opportunity to win real money.</span>
      </div>
      <div
        className="grid grid-cols-6 mx-5 my-5">
        <Link
          href="/play"
          className="col-span-3 w-[min-content] md:w-[300px] text-2xl font-bold text-white"
        >
          Plinko Game
        </Link>
        <div className="col-span-3 flex justify-end items-center space-x-1">
          {!!address && (
            <div className="flex space-x-2 items-center">
              <Balance/>
              <UserProfileMenu/>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
