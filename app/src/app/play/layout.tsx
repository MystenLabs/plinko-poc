"use client";

import { ChildrenProps } from "@/types/ChildrenProps";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRootLayout({ children }: ChildrenProps) {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address!;

  useEffect(() => {
    if (!address) {
      console.log("No address found, taking you back to '/'");
      router.push("/");
    }
  }, [address]);

  if (!address) {
    return "Not allowed";
  }

  return children;
}
