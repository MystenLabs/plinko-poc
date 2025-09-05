// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
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
      router.push("/");
    }
  }, [address]);

  if (!address) {
    return "Not allowed";
  }

  return children;
}
