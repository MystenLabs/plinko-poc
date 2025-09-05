// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { EnokiClient } from "@mysten/enoki";

export const enokiClient = new EnokiClient({
  apiKey: process.env.ENOKI_SECRET_KEY!,
});
