// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import express, { Express } from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware";

import healthRoutes from "./routes/Health";
import gameRoutes from "./routes/Game";
import sponsorRoutes from "./routes/Sponsor";
import executeRoutes from "./routes/Execute";

const app: Express = express();
const port = Number(process.env.PORT) || 8080;

let trustedOrigins: string[] = [];
try {
  trustedOrigins = JSON.parse(String(process.env.TRUSTED_ORIGINS || "[]"));
} catch {
  console.warn("TRUSTED_ORIGINS is not valid JSON; defaulting to []");
  trustedOrigins = [];
}

// CORS
app.use(
  cors({
    origin: trustedOrigins.length ? trustedOrigins : undefined, // allow all if empty
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/health", healthRoutes);
app.use("/game", gameRoutes);
app.use("/sponsor", sponsorRoutes);
app.use("/execute", executeRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

// Start
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
