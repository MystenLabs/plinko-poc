import React from "react";
import { NavbarHeader } from "./NavbarHeader";
import { NavbarLinks } from "./NavbarLinks";
import Link from "next/link";
import { UserProfileMenu } from "@/components/general/UserProfileMenu";
import { UserAvatar } from "@/components/general/UserAvatar";
import { useAuthentication } from "@/contexts/Authentication";
import { Balance } from "@/components/general/Balance";
import { AppLogo } from "./AppLogo";

export const TopNavbar = () => {

  const { user } = useAuthentication();

  return (
    <div className="backdrop-blur-md md:backdrop-blur-none sticky top-0 flex w-full h-full bg-inherit p-5 space-x-2 md:space-x-4 justify-between items-center z-10">
      <Link href="/play" className="w-[min-content] md:w-[300px] text-2xl font-bold text-white">
        Plinko Game
      </Link>
      {/* <NavbarHeader showCloseButton={false} onClose={() => {}} /> */}
      {/* <NavbarLinks position="top" /> */}
      <div className="flex flex-1 justify-end items-center space-x-1">
        {!!user.address && (
          <div className="flex space-x-2 items-center">
            <Balance />
            <UserProfileMenu
              trigger={<UserAvatar user={user} showNameEmail={false} />}
            />
          </div>
         )} 
      </div>
    </div>
  );
};


