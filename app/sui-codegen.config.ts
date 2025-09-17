// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import type { SuiCodegenConfig } from "@mysten/codegen";

const config: SuiCodegenConfig = {
  output: "./src/generated",
  generateSummaries: true,
  prune: true,
  packages: [
    {
      package: "@local-pkg/plinko",
      path: "../plinko",
      packageName: "plinko",
    },
  ],
};

export default config;
