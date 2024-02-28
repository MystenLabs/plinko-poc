import React from "react";
import { NavbarHeader } from "./NavbarHeader";
import { NavbarLinks } from "./NavbarLinks";
import { UserProfileMenu } from "@/components/general/UserProfileMenu";
import { UserAvatar } from "@/components/general/UserAvatar";
import { useAuthentication } from "@/contexts/Authentication";
import { USER_ROLES } from "@/constants/USER_ROLES";
import { useZkLogin } from "@mysten/enoki/react";
import { Balance } from "@/components/general/Balance";

export const TopNavbar = () => {
  const { address } = useZkLogin();
  const { user } = useAuthentication();
  
  console.log(" ----------------------- >", address);

  return (
    <div className="sticky top-0 flex w-full h-full bg-opacity-0 p-5 space-x-4 justify-between items-center ">
      <NavbarHeader showCloseButton={false} onClose={() => {}} />
      <NavbarLinks position="top" />
      <div className="flex flex-1 justify-end items-center space-x-1">
        {/* {!!address && ( */}
          <div className="flex space-x-2 items-center">
            <Balance />
            <UserProfileMenu
              trigger={<UserAvatar user={user} showNameEmail={false} />}
            />
          </div>
        {/* )} */}
      </div>
    </div>
  );
};


