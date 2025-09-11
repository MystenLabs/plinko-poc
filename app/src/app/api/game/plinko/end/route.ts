// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import PlinkoGameService from "@/server/PlinkoGameService";

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  try {
    const { gameId, numberofBalls } = await req.json();
    if (!gameId) {
      return NextResponse.json(
        { error: 'Parameter "gameId" is required' },
        { status: 400 }
      );
    }
    const { trace, transactionDigest } =
      await new PlinkoGameService().finishGame(gameId, numberofBalls);
    return NextResponse.json({ trace, transactionDigest }, { status: 200 });
  } catch (error) {
    console.error("Error while calling /game/plinko/end:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
};
