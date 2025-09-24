// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import fs from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

// Try a few likely locations for .env.local (and fallback to .env)
const candidates = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../.env.local"), // when running from src with tsx
  path.resolve(__dirname, "../.env"),
];

let loaded = false;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    loadEnv({ path: p });
    // eslint-disable-next-line no-console
    console.log(`[env] Loaded: ${p}`);
    loaded = true;
    break;
  }
}
if (!loaded) {
  // eslint-disable-next-line no-console
  console.warn(
    "[env] No .env(.local) file found in expected locations; relying on process env."
  );
}

function req(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v.trim();
}

export const SUI_NETWORK = req("SUI_NETWORK");
export const PACKAGE_ADDRESS = req("PACKAGE_ADDRESS");
export const HOUSE_ADDRESS = req("PLINKO_HOUSE_ADDRESS");
export const HOUSE_PRIVATE_KEY = req("PLINKO_HOUSE_PRIVATE_KEY");
export const HOUSE_CAP = req("HOUSE_ADMIN_CAP");

// eslint-disable-next-line no-console
console.log("[env] Keys present:", {
  HOUSE_ADDRESS: !!process.env.HOUSE_ADDRESS,
  HOUSE_PRIVATE_KEY: !!process.env.HOUSE_PRIVATE_KEY,
  PACKAGE_ADDRESS: !!process.env.PACKAGE_ADDRESS,
  HOUSE_ADMIN_CAP: !!process.env.HOUSE_ADMIN_CAP,
  SUI_NETWORK: !!process.env.SUI_NETWORK,
});
