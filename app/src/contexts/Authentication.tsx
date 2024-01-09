import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthenticationContextProps, UserProps } from "@/types/Authentication";
import { createContext } from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import { EnokiFlow } from "@mysten/enoki";
import { isFollowingUserPropsSchema } from "@/helpers/isFollowingUserPropsSchema";

export const anonymousUser: UserProps = {
  firstName: "",
  lastName: "",
  role: "anonymous",
  email: "",
  picture: "",
  address: "",
};

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  return context;
};

export const AuthenticationContext = createContext<AuthenticationContextProps>({
  user: anonymousUser,
  isLoading: false,
  setIsLoading: () => {},
  handleLoginAs: () => {},
  handleLogout: () => {},
  enokiFlow: new EnokiFlow({
    apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
  }),
});

export const AuthenticationProvider = ({ children }: ChildrenProps) => {
  const router = useRouter();
  const enokiFlow = new EnokiFlow({
    apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
  });

  const [user, setUser] = useState<UserProps>(anonymousUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialUser = localStorage.getItem("user");
    if (initialUser) {
      const parsedUser = JSON.parse(initialUser);
      if (!isFollowingUserPropsSchema(parsedUser)) {
        setUser(anonymousUser);
        localStorage.setItem("user", JSON.stringify(anonymousUser));
        router.push("/");
      } else {
        setUser(JSON.parse(initialUser));
      }
    } else {
      setUser(anonymousUser);
    }
    setIsLoading(false);
  }, []);

  const handleLoginAs = (newUser: UserProps) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    router.push(`/${newUser.role}`);
  };

  const handleLogout = () => {
    enokiFlow.logout();
    setUser(anonymousUser);
    localStorage.setItem("user", JSON.stringify(anonymousUser));
    router.push("/");
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoading,
        setIsLoading,
        handleLoginAs,
        handleLogout,
        enokiFlow,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
