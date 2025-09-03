import React from "react";
import Link from "next/link";
import { UserProfileMenu } from "@/components/general/UserProfileMenu";
import { Balance } from "@/components/general/Balance";

import useScroll from "@/lib/hooks/use-scroll";
import { useCurrentAccount } from "@mysten/dapp-kit";

export const TopNavbar = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const scrolled = useScroll(10);

  return (
    <>
      <div
        className={`sticky top-0 flex flex-col w-full justify-evenly z-50 ${
          scrolled
            ? "border-b border-gray-200 bg-transparent/50 backdrop-blur-xl"
            : "bg-white/0"
        }`}
      >
        <span className="w-full text-opacity-90 text-[14px] text-[#4F4F4F] bg-white py-3 px-5 text-center">
          [Plinko Game] is provided for testnet purposes only and does not
          involve real money or the opportunity to win real money.
        </span>
        <div className="grid grid-cols-6 mx-5 my-5">
          <Link
            href="/play"
            className="col-span-3 w-[min-content] md:w-[300px] text-2xl font-bold text-white"
          >
            Plinko Game
          </Link>
          <div className="col-span-3 flex justify-end items-center space-x-1">
            {!!address && (
              <div className="flex space-x-2 items-center">
                <Balance />
                <UserProfileMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
