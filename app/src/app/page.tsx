"use client";

import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useZkLogin } from "@mysten/enoki/react";

export default function Home() {
  const router = useRouter();
  const { address } = useZkLogin();

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
