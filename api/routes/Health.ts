// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(200);
  res.json({
    message: "OK",
    PACKAGE_ADDRESS: process.env.PACKAGE_ADDRESS,
  });
});

export default router;
