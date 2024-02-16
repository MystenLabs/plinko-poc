"use client";

import { LargeScreenLayout } from "@/components/layouts/LargeScreenLayout";
import { MobileLayout } from "@/components/layouts/MobileLayout";
import { AuthenticationProvider } from "@/contexts/Authentication";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRegisterServiceWorker } from "@/hooks/useRegisterServiceWorker";
import { ChildrenProps } from "@/types/ChildrenProps";
import React from "react";
import { Toaster } from "react-hot-toast";
import backgroundImage from "../../public/Tablebackground.svg";

export const ProvidersAndLayout = ({ children }: ChildrenProps) => {
  const _ = useRegisterServiceWorker();
  const { isMobile } = useIsMobile();

  return (
    <AuthenticationProvider>
      <main
        className={`min-h-screen w-screen bg-black`}
        style={{
          // use the src property of the image object
          backgroundImage: `url(${backgroundImage.src})`,
          // other styles
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {!!isMobile && <MobileLayout>{children}</MobileLayout>}
        {!isMobile && <LargeScreenLayout>{children}</LargeScreenLayout>}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 5000,
          }}
        />
      </main>
    </AuthenticationProvider>
  );
};
