import express, { Request, Response, Router } from "express";
import { enokiClient } from "../utils/EnokiClient";

const router: Router = express.Router();

router.post("/execute", async (req: Request, res: Response) => {
  try {
    const { digest, signature } = req.body;

    const executionResult = await enokiClient.executeSponsoredTransaction({
      digest,
      signature,
    });

    res.status(200).json({
      digest: executionResult.digest,
    });
  } catch (error) {
    console.error("Execution failed:", error);
    res.status(500).json({ error: "Execution failed" });
  }
});

export default router;
