// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { enokiClient } from "@/server/EnokiClient";

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  try {
    const { transactionKindBytes, sender } = await req.json();
    const sponsored = await enokiClient.createSponsoredTransaction({
      network: process.env.NEXT_PUBLIC_SUI_NETWORK_NAME as
        | "mainnet"
        | "testnet"
        | "devnet",
      transactionKindBytes,
      sender,
      allowedAddresses: [sender],
    });

    return NextResponse.json(
      { bytes: sponsored.bytes, digest: sponsored.digest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sponsorship failed:", error);
    return NextResponse.json({ error: "Sponsorship failed" }, { status: 500 });
  }
};
