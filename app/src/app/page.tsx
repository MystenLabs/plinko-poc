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
      console.log(address);
      router.push("/play");
    }
  }, [address]);

  console.log("page.tsx is on server:", !!process.env.IS_SERVER_SIDE);

  return (
    <Paper className="max-w-[600px] mx-auto">{!address && <LoginForm />}</Paper>
  );
}
