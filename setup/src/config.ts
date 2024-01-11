import { config } from "dotenv";

config({});
export const SUI_NETWORK = process.env.SUI_NETWORK!;
export const PACKAGE_ADDRESS = process.env.PACKAGE_ADDRESS!;
export const HOUSE_ADDRESS = process.env.PLINKO_HOUSE_ADDRESS;
export const HOUSE_PRIVATE_KEY = process.env.PLINKO_HOUSE_PRIVATE_KEY!;
export const HOUSE_CAP = process.env.HOUSE_ADMIN_CAP!;

// console.log everything in the process.env object
const keys = Object.keys(process.env);
