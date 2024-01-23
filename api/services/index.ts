// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import BlsService from "./BlsService";
import PlinkoGameService from "./PlinkoGameService";


// Using this export method to maintain a shared storage between .ts files
export default {
  PlinkoGameService: new PlinkoGameService(),
  BlsService: new BlsService()
};
