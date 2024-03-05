"use client";

import { ChildrenProps } from "@/types/ChildrenProps";
import { useRouter } from "next/navigation";
import { useZkLogin } from "@mysten/enoki/react";
import { useEffect } from "react";

export default function AdminRootLayout({ children }: ChildrenProps) {
  const router = useRouter();
  const { address } = useZkLogin();

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
