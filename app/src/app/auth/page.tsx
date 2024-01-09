"use client";

import { useAuthentication } from "@/contexts/Authentication";
import { fromB64 } from "@mysten/sui.js/utils";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// bad practice but is not exported from @mysten/enoki
import { ZkLoginSession } from "@mysten/enoki/dist/cjs/EnokiFlow";
import { Spinner } from "@/components/general/Spinner";
import { UserRole } from "@/types/Authentication";

const AuthPage = () => {
  const { enokiFlow, handleLoginAs, setIsLoading } = useAuthentication();

  useEffect(() => {
    setIsLoading(true);
    const hash = window.location.hash;
    enokiFlow
      .handleAuthCallback(hash)
      .then(async (res) => {
        console.log({ res });
        const session = await enokiFlow.getSession();
        const keypair = session?.ephemeralKeyPair!;
        let privateKeyArray = Uint8Array.from(Array.from(fromB64(keypair!)));
        const address = Ed25519Keypair.fromSecretKey(privateKeyArray)
          .getPublicKey()
          .toSuiAddress();
        const jwt = session?.jwt;
        const decodedJwt: any = jwtDecode(jwt!);
        const userRole = res as UserRole;
        handleLoginAs({
          firstName: decodedJwt["given_name"],
          lastName: decodedJwt["family_name"],
          role: userRole,
          email: decodedJwt["email"],
          picture: decodedJwt["picture"],
          address,
          zkLoginSession: session as ZkLoginSession,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        setIsLoading(false);
      });
  }, [enokiFlow]);

  return <Spinner />;
};

export default AuthPage;
