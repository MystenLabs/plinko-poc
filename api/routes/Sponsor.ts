// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import express, { Request, Response, Router } from "express";
import { enokiClient } from "../utils/EnokiClient";

const router: Router = express.Router();

router.post("/sponsor", async (req: Request, res: Response) => {
  try {
    const { transactionKindBytes, sender } = req.body;

    const sponsored = await enokiClient.createSponsoredTransaction({
      network: process.env.NEXT_PUBLIC_SUI_NETWORK_NAME as
        | "mainnet"
        | "testnet"
        | "devnet",
      transactionKindBytes,
      sender,
      allowedAddresses: [sender],
    });

    res.status(200).json({
      bytes: sponsored.bytes,
      digest: sponsored.digest,
    });
  } catch (error) {
    console.error("Sponsorship failed:", error);
    res.status(500).json({ error: "Sponsorship failed" });
  }
});

export default router;
