import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jwtDecode } from "jwt-decode";
import { CopyIcon } from "@radix-ui/react-icons";
import { formatAddress } from "@mysten/sui/utils";
import toast from "react-hot-toast";
import { useEnokiFlow, useZkLoginSession } from "@mysten/enoki/react";
import { useMemo } from "react";
import { formatString } from "@/helpers/formatString";
import Image from "next/image";
import { useCurrentAccount } from "@mysten/dapp-kit";

export const UserProfileMenu = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address!;
  // const enokiFlow = useEnokiFlow();
  // const zkLoginSession = useZkLoginSession();

  // const decodedJWT = useMemo(() => {
  //   if (!zkLoginSession?.jwt) return null;
  //   const decoded: any = jwtDecode(zkLoginSession?.jwt!);
  //   return decoded;
  // }, [zkLoginSession?.jwt]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address!);
    toast.success("Address copied to clipboard");
  };

  return (
    <DropdownMenu>
      {/* <DropdownMenuTrigger asChild>
        {!!decodedJWT?.picture && (
          <button>
            <Image
              src={decodedJWT?.picture}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full pr-0"
            />
          </button>
        )}
      </DropdownMenuTrigger> */}
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuLabel>
          <div>
            {decodedJWT?.given_name} {decodedJWT?.family_name}
          </div>
          <div className="text-black text-opacity-60 text-xs">
            {decodedJWT?.email ? formatString(decodedJWT?.email, 25) : ""}
          </div>
        </DropdownMenuLabel> */}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center justify-between w-full">
            <div>{formatAddress(address!)}</div>
            <button onClick={handleCopyAddress}>
              <CopyIcon className="w-4 h-4 text-black" />
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuItem
          onClick={() => enokiFlow.logout()}
          className="flex items-center justify-between w-full"
        >
          <div>Log out</div>
          <LogOut className="h-4 w-4" />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
