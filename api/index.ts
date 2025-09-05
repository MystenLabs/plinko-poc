// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import express, { Express } from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware";
import * as dotenv from "dotenv";
dotenv.config();

import healthRoutes from "./routes/Health";
import gameRoutes from "./routes/Game";

// Initializing port and express instance
const app: Express = express();
const port = process.env.PORT;

// Initializing CORS
const trustedOrigins = JSON.parse(String(process.env.TRUSTED_ORIGINS));

app.use(
  cors({
    origin: trustedOrigins,
  })
);

// For accepting body in JSON format
app.use(express.json());

// Accepted body of requests in x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

// --------- Routes "/health" ---------
app.use("/health", healthRoutes);

// --------- Routes "/game" ---------
app.use("/game", gameRoutes);

// --------- Error handling middleware ---------
app.use(notFound);
app.use(errorHandler);

// --------- Starts the API ---------
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
