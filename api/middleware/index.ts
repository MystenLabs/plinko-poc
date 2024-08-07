// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { NextFunction, Request, Response } from "express";

const errorCode = 400;

// Handles errors related to non existing endpoints
function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error("Not Found: " + req.originalUrl);
  next(error);
}

// Handles generic errors that can happen during execution of the services
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res
    .status(res.statusCode || 500)
    .send({ message: err.message || err, stack: err.stack || "N/A", originalError: err});
  console.error("Error Handler:", err);
}

// Check if all paramaters are present in the request body.
function checkSinglePlayerEnd(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req?.body?.gameId) throw new Error('Parameter "gameId" is required');
    if (!req?.body?.vrfInput) throw new Error('Parameter "blsSig" is required');
  } catch (error) {
    res.status(errorCode);
    next(error);
  }
  next();
}

export {
  notFound,
  errorHandler,
  checkSinglePlayerEnd,
};
