// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jwtDecode } from "jwt-decode";
import { CopyIcon } from "@radix-ui/react-icons";
import { formatAddress } from "@mysten/sui/utils";
import toast from "react-hot-toast";
import {
  isEnokiWallet,
  EnokiWallet,
  getSession,
  AuthProvider,
} from "@mysten/enoki";
import { useEffect, useMemo, useState } from "react";
import { formatString } from "@/helpers/formatString";
import Image from "next/image";
import {
  useCurrentAccount,
  useDisconnectWallet,
  useWallets,
} from "@mysten/dapp-kit";

type DecodedZkJwt = {
  picture?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
};

export const UserProfileMenu = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { mutate: disconnect } = useDisconnectWallet();
  const wallets = useWallets().filter(isEnokiWallet);

  const walletsByProvider = useMemo(() => {
    return wallets.reduce<Map<AuthProvider, EnokiWallet>>((map, wallet) => {
      map.set(wallet.provider, wallet);
      return map;
    }, new Map<AuthProvider, EnokiWallet>());
  }, [wallets]);

  const googleWallet = walletsByProvider.get("google");

  const [sessionJwt, setSessionJwt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!googleWallet) {
          if (active) setSessionJwt(null);
          return;
        }
        const session = await getSession(googleWallet);
        if (active) setSessionJwt(session?.jwt ?? null);
      } catch {
        if (active) setSessionJwt(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [googleWallet]);

  const decodedJWT = useMemo<DecodedZkJwt | null>(() => {
    if (!sessionJwt) return null;
    try {
      return jwtDecode<DecodedZkJwt>(sessionJwt);
    } catch {
      return null;
    }
  }, [sessionJwt]);

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {!!decodedJWT?.picture ? (
          <button>
            <Image
              src={decodedJWT.picture}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full pr-0"
            />
          </button>
        ) : (
          // Fallback trigger if there’s no picture:
          <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-semibold">ME</span>
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div>
            {decodedJWT?.given_name || decodedJWT?.family_name
              ? `${decodedJWT?.given_name ?? ""} ${
                  decodedJWT?.family_name ?? ""
                }`
              : "Google User"}
          </div>
          <div className="text-black text-opacity-60 text-xs">
            {decodedJWT?.email ? formatString(decodedJWT.email, 25) : ""}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center justify-between w-full">
            <div>{address ? formatAddress(address) : "No address"}</div>
            {address && (
              <button onClick={handleCopyAddress}>
                <CopyIcon className="w-4 h-4 text-black" />
              </button>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem
          onClick={() => disconnect()}
          className="flex items-center justify-between w-full"
        >
          <div>Log out</div>
          <LogOut className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
