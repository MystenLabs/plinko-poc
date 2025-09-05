"use client";

import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function Home() {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address!;

  useEffect(() => {
    if (address) {
      router.push("/play");
    }
  }, [address]);

  return (
    <Paper className="max-w-[600px] mx-auto">{!address && <LoginForm />}</Paper>
  );
}
