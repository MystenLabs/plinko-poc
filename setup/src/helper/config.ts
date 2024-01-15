import { SuiClient } from "@mysten/sui.js/client";

export const SUI_NETWORK = process.env.SUI_NETWORK!;
export const PACKAGE_ADDRESS = process.env.PACKAGE_ADDRESS!;
export const HOUSE_ADDRESS = process.env.PLINKO_HOUSE_ADDRESS;
export const HOUSE_PRIVATE_KEY = process.env.PLINKO_HOUSE_PRIVATE_KEY!;
export const HOUSE_CAP = process.env.HOUSE_ADMIN_CAP!;
export const PLAYER_PRIVATE_KEY = process.env.PLAYER_PRIVATE_KEY!;

// console.log everything in the process.env object
const keys = Object.keys(process.env);
console.log("env contains PLAYER_PRIVATE_KEY:", keys.includes("PLAYER_PRIVATE_KEY"));
console.log("env contains HOUSE_PRIVATE_KEY:", keys.includes("HOUSE_PRIVATE_KEY"));
// Create a SuiClient instance
const client = new SuiClient({
    url: SUI_NETWORK,
  });

  export const config = () => {
    return {
      SUI_NETWORK,
      client,
      PACKAGE_ADDRESS,
      HOUSE_ADDRESS,
      HOUSE_PRIVATE_KEY,
      HOUSE_CAP,
      PLAYER_PRIVATE_KEY
    };

  }

