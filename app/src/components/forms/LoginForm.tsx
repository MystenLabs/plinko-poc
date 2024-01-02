"use client";

import { USER_ROLES } from "@/constants/USER_ROLES";
import React, { useEffect } from "react";
import { useAuthentication } from "@/contexts/Authentication";
import { useRouter } from "next/navigation";
import { Spinner } from "../general/Spinner";
import Link from "next/link";
import Image from "next/image";

interface AuthURLByUserRole {
  [key: string]: string;
}

export const LoginForm = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, enokiFlow } = useAuthentication();

  const [authURLs, setAuthURLs] = React.useState<AuthURLByUserRole | null>();

  useEffect(() => {
    generateAuthURLs();
  }, [enokiFlow]);

  const generateAuthURLs = async () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const customRedirectUri = `${protocol}//${host}/auth`;
    const authURL = await enokiFlow.createAuthorizationURL({
      provider: "google",
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirectUrl: customRedirectUri,
      extraParams: {
        scope: ["openid", "email", "profile"],
      },
    });
    const authURLs: AuthURLByUserRole = {
      [USER_ROLES.ROLE_1]: authURL.concat(`&state=${USER_ROLES.ROLE_1}`),
      [USER_ROLES.ROLE_2]: authURL.concat(`&state=${USER_ROLES.ROLE_2}`),
      [USER_ROLES.ROLE_3]: authURL.concat(`&state=${USER_ROLES.ROLE_3}`),
    };
    setAuthURLs(authURLs);
    return authURLs;
  };

  useEffect(() => {
    if (user.role !== USER_ROLES.ROLE_4 && !isAuthLoading) {
      router.push(`/${user.role}`);
    }
  }, [user, isAuthLoading]);

  if (isAuthLoading || user.role !== USER_ROLES.ROLE_4) {
    return <Spinner />;
  }

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-lg text-center">Login</h3>
      {!!authURLs && (
        <div className="flex flex-col md:flex-row space-x-3 items-center">
          <Link
            href={authURLs[USER_ROLES.ROLE_1]}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-black w-[210px] rounded-lg"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <div>Admin Sign In</div>
          </Link>
          <Link
            href={authURLs[USER_ROLES.ROLE_2]}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-black w-[230px] rounded-lg"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <div>Moderator Sign In</div>
          </Link>
          <Link
            href={authURLs[USER_ROLES.ROLE_3]}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-black w-[210px] rounded-lg"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <div>Member Sign In</div>
          </Link>
        </div>
      )}
    </div>
  );
};
