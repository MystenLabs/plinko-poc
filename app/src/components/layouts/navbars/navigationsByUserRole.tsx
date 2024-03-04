import React from "react";
import {
  BackpackIcon,
  CheckCircledIcon,
  CodeIcon,
  CountdownTimerIcon,
  HomeIcon,
  LightningBoltIcon,
  PaperPlaneIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { NavigationLink } from "@/types/NavigationLink";
import { USER_ROLES } from "@/constants/USER_ROLES";

const authenticatedNavigations: NavigationLink[] = [];

const globalNavigations: NavigationLink[] = [];

export const navigationsByUserRole = {
  anonymous: [
    {
      title: "Home",
      href: "/",
      icon: <HomeIcon />,
    },
    ...globalNavigations,
  ],
  member: [
    {
      title: "Home",
      href: `/${USER_ROLES.ROLE_3}`,
      icon: <HomeIcon />,
    },
    ...authenticatedNavigations,
    ...globalNavigations,
  ],
  moderator: [
    {
      title: "Home",
      href: `/${USER_ROLES.ROLE_2}`,
      icon: <HomeIcon />,
    },
    ...authenticatedNavigations,
    ...globalNavigations,
  ],
  admin: [
    {
      title: "Home",
      href: `/${USER_ROLES.ROLE_1}`,
      icon: <HomeIcon />,
    },
    ...authenticatedNavigations,
    ...globalNavigations,
  ],
};
