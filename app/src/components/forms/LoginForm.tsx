// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
} from "@mysten/dapp-kit";
import { isEnokiWallet, EnokiWallet, AuthProvider } from "@mysten/enoki";

export function LoginForm() {
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();

  const wallets = useWallets().filter(isEnokiWallet);

  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>()
  );

  const googleWallet = walletsByProvider.get("google");
  if (currentAccount) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-sm">Current address:</div>
        <code className="text-xs break-all">{currentAccount.address}</code>
      </div>
    );
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
          <div className="font-[700] text-[20px] text-center">
            Plinko on Sui <br />
          </div>
          <div className="text-center text-opacity-90 text-[14px] text-[#4F4F4F]">
            Sign in with your Google account to play.
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center">
            {googleWallet && (
              <button
                onClick={() => connect({ wallet: googleWallet })}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <Image src="/google.svg" alt="Google" width={20} height={20} />
                <div>Sign In</div>
              </button>
            )}
          </div>
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
}
