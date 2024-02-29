"use client";

import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";
// import { Metadata } from "next";
import { useAuthentication } from "@/contexts/Authentication";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// export const metadata: Metadata = {
//   title: "PoC Template",
//   description: "A NextJS app to bootstrap PoCs faster",
// };

export default function Home() {
  const router = useRouter();
  const { user } = useAuthentication();

  useEffect(() => {
    if (user.address) {
      router.push("/play");
    }
  }, [user.address]);

  console.log("page.tsx is on server:", !!process.env.IS_SERVER_SIDE);

  return (
    <Paper className="max-w-[600px] mx-auto">
      {!user.address && <LoginForm />}
    </Paper>
  );
}
