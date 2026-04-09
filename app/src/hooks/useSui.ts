// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { useCurrentClient } from "@mysten/dapp-kit-react";

export const useSui = () => {
  const suiClient = useCurrentClient();
  return { suiClient };
};
