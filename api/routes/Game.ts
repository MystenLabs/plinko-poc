// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import express, { Router, Request, Response, NextFunction } from "express";
import { checkSinglePlayerEnd } from "../middleware";
import services from "../services/";

const GameService = services.PlinkoGameService;

const router: Router = express.Router();

// Endpoint to get the result of the game
router.post(
  "/plinko/end",
  checkSinglePlayerEnd,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("POST /game/plinko/end with body:", req.body);
    try {
      let { trace, transactionDigest } = await GameService.finishGame(
        req.body.gameId,
        req.body.numberofBalls
      );
      res.status(200).json({
        trace,
        transactionDigest,
      });
    } catch (e) {
      console.error(
        `Error while calling /plinko/end with id ${req.body.gameId}:`,
        e
      );
      res.status(500).send("An error occurred while processing your request.");
    }
  }
);

export default router;
