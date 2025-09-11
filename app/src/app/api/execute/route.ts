// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { enokiClient } from "@/server/EnokiClient";

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  try {
    const { digest, signature } = await req.json();
    const executionResult = await enokiClient.executeSponsoredTransaction({
      digest,
      signature,
    });
    return NextResponse.json(
      { digest: executionResult.digest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Execution failed:", error);
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
};
