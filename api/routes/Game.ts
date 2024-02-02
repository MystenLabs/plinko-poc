// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import express, { Router, Request, Response, NextFunction } from "express";
import {
  checkPlayGame,
  checkRegisterGame,
  checkSign,
  checkSinglePlayerEnd,
  checkVerify,
} from "../middleware";
import services from "../services/";

const GameService = services.PlinkoGameService;

const router: Router = express.Router();

router.get(
  "/details",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("GET /game/details");

    try {
      let games = GameService.getGames();
      res.status(200);
      res.json({
        games,
      });
    } catch (e) {
      console.error(`Bad things have happened while calling /game/details:`, e);
      // Forward the error to the error handler
      res.status(500);
      next(e);
    }
  }
);

router.post(
  "/register",
  checkRegisterGame,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("POST /game/register with body:", req.body);

    try {
      let registered = GameService.registerGame(req.body.gameId, req.body.txnDigest);
      res.status(200);
      res.json({
        registered,
      });
    } catch (e) {
      console.error(
        `Bad things have happened while calling /game/register with id "${req.body.gameId}":`,
        e
      );
      // Forward the error to the error handler
      res.status(500);
      next(e);
    }
  }
);

// router.post(
//   "/play",
//   checkPlayGame,
//   async (req: Request, res: Response, next: NextFunction) => {
//     const randomNumber = Math.floor(Math.random() * 60_000_000) + 1
//       const randchar = () => String.fromCharCode(Math.floor(Math.random() * 97) + 26);
//       const pid = `${randomNumber}${randchar()}${randchar()}${randchar()}${randchar()}`;
//       console.time(pid);
//       console.log(`/game/play/ID=${pid} - POST /game/play with body:`, req.body);
//     try {
//       // register, sign, and end the game
//       const { gameId, txnDigest, userRandomnessHexString } = req.body;
//       const gameIdWithRandomness = gameId!.replace("0x", "").concat(userRandomnessHexString);

//       // register
//       console.log("registering game with id:", gameId);
//       let registered = GameService.registerGame(gameId, txnDigest);

//       // sign game
//       console.log("signing game with id:", gameId);
//       const blsSig = await services.BlsService.sign(gameIdWithRandomness);
      
//       // end game
//       console.log("ending game with id:", gameId);
//       let { playerWon, transactionDigest } =
//         await GameService.finishGame(gameId!, blsSig, req.body.numberofBalls);
//         res.status(200);
//         console.timeEnd(pid);
//         return res.json({
//           playerWon,
//           transactionDigest,
//         });
//     }
//     catch (err) {
//       console.error(
//         `${pid} - Bad things have happened while calling /game/play with id "${req.body.gameId}":`,
//         err
//       );
//       // Forward the error to the error handler
//       res.status(500);
//       next(err);
//     }
//   }
// )

router.post(
  "/plinko/end",
  checkSinglePlayerEnd,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("POST /game/plinko/end with body:", req.body);

    try {
      const blsSigArray = req.body.blsSig;
      let {trace, transactionDigest } = // Assuming `trace` is now part of the return object
        await GameService.finishGame(req.body.gameId, blsSigArray, req.body.numberofBalls);
      res.status(200).json({
        trace,
        transactionDigest
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


router.post(
  "/sign",
  checkSign,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sig = await services.BlsService.sign(req?.body?.gameId);

      res.status(200);
      res.json({
        blsSig: Array.from(sig),
      });
    } catch (e) {
      console.error(
        `Error creating bls signature for gameId ${req.body.gameId}`,
        e
      );
      res.status(500);
      next(e);
    }
  }
);

router.post(
  "/verify",
  checkVerify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const valid = await services.BlsService.verify(
        req?.body?.msg,
        JSON.parse(req?.body?.sig)
      );
      res.status(200);
      res.json({
        valid,
      });
    } catch (e) {
      console.error(
        `Error verifying bls signature for msg ${req.body.msg} and sig ${req.body.sig}`,
        e
      );
      res.status(500);
      next(e);
    }
  }
);

// router.post(
//     "/start",
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const resp = await GameService.startGame(req.body.choice);
//             res.status(200);
//             res.json({
//                 gameId: resp!.gameId,
//                 txnDigest: resp!.digest,
//                 userRandomnessHexString: resp!.userRandomnessHexString,
//             });
//         } catch (e) {
//             console.error(
//                 `Failed to start game.`,
//                 e
//             );
//             res.status(500);
//             next(e);
//         }
//     }
// )

export default router;
