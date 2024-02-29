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
      router.push(`/play`);
    }
  }, [user, isAuthLoading]);

  if (isAuthLoading || user.role !== USER_ROLES.ROLE_4) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col items-center space-y-[20px]">
      <div className="bg-white flex flex-col p-[60px] max-w-[480px] mx-auto rounded-[24px] items-center space-y-[60px]">
        <Image
          src="/general/mysten-logo-red.svg"
          alt="Mysten Labs"
          width={160}
          height={20}
        />
        <div className="flex flex-col space-y-[30px] items-center">
          <div className="flex flex-col space-y-[20px] items-center">
            <div className="font-[700] text-[20px] text-center">
              Plinko on Sui Blockchain <br /> 
            </div>
            <div className="text-center text-opacity-90 text-[14px] text-[#4F4F4F]">
              Welcome to Mysten Labs version of the Plinko game. Plinko is a game of chance where balls are dropped from 
              the top of a pegged board, and the outcome is determined by the path they take. 
              Our Sui blockchain implementation offers a unique experience by integrating cryptographic 
              techniques to ensure fairness and transparency.
              You can test the Plinko game on testnet. <p>Sign in with you google account to play.</p>
            </div>
          </div>
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
      </div>
      <div className="flex flex-col items-center text-white text-[12px]">
        <div className="text-center">Learn more about Mysten Labs at</div>
        <Link
          href="https://mystenlabs.com"
          target="_blank"
          rel="noopenner noreferrer"
          className="underline"
        >
          mystenlabs.com
        </Link>
      </div>
    </div>
  );

};