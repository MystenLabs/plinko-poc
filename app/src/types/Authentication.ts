import { EnokiFlow } from "@mysten/enoki";
// bad practice but not exported from @mysten/enoki
import { ZkLoginSession } from "@mysten/enoki/dist/cjs/EnokiFlow";

export type UserRole = "admin" | "moderator" | "member" | "anonymous";

export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  picture: string;
  address: string;
  zkLoginSession?: ZkLoginSession;
}

export interface AuthenticationContextProps {
  user: UserProps;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  handleLoginAs: (user: UserProps) => void;
  handleLogout: () => void;
  enokiFlow: EnokiFlow;
}
