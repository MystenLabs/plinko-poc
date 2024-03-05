"use client";

import { ChildrenProps } from "@/types/ChildrenProps";
import { useAuthentication } from "@/contexts/Authentication";
import { Spinner } from "@/components/general/Spinner";
import { useRouter } from "next/navigation";

export default function AdminRootLayout({ children }: ChildrenProps) {
  const { user, isLoading } = useAuthentication();
  const router = useRouter();

  if (isLoading) {
    return <Spinner />;
  }

  if (user?.role !== "admin") {
    router.push("/");
    return "Not allowed";
  }

  return children;
}
