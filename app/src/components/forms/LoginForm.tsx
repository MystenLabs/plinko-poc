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
    <div className="flex flex-col items-center justify-center h-screen">
      <h3 className="font-semibold text-lg text-center mb-5">Login</h3>
      {!!authURLs && (
        <div className="flex flex-col md:flex-row items-center justify-center">
          <Link
            href={authURLs[USER_ROLES.ROLE_1]}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <div>Sign In To Play</div>
          </Link>
        </div>
      )}
    </div>
  );
};
