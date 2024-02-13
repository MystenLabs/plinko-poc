import React from "react";
import { NavbarHeader } from "./NavbarHeader";
import { NavbarLinks } from "./NavbarLinks";
import { UserProfileMenu } from "@/components/general/UserProfileMenu";
import { UserAvatar } from "@/components/general/UserAvatar";
import { useAuthentication } from "@/contexts/Authentication";
import { USER_ROLES } from "@/constants/USER_ROLES";
import BalanceDisplay from "@/components/layouts/navbars/BalanceDisplay";

export const TopNavbar = () => {
  const { user } = useAuthentication();

  return (
    <div className="sticky top-0 flex w-full h-full bg-opacity-0 p-5 space-x-4 justify-between items-center ">
      <NavbarHeader showCloseButton={false} onClose={() => {}} />
      <NavbarLinks position="top" />
      <div className="flex items-center space-x-2">
        {" "}
        {user?.role !== USER_ROLES.ROLE_4 &&
          process.env.NEXT_PUBLIC_USE_TOP_NAVBAR_IN_LARGE_SCREEN === "1" && (
            <UserProfileMenu
              trigger={<UserAvatar user={user} showNameEmail={false} />}
            />
          )}
      </div>
    </div>
  );
};
