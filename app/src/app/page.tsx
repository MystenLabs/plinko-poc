"use client";

import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";
// import { Metadata } from "next";
import { useZkLogin } from "@mysten/enoki/react";

// export const metadata: Metadata = {
//   title: "PoC Template",
//   description: "A NextJS app to bootstrap PoCs faster",
// };

export default function Home() {
  const { address } = useZkLogin();

  console.log("page.tsx is on server:", !!process.env.IS_SERVER_SIDE);

  return (
    <Paper className="max-w-[600px] mx-auto">
      {!address && <LoginForm />}
    </Paper>
  );
}
