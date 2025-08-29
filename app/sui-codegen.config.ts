import type { SuiCodegenConfig } from "@mysten/codegen";

const config: SuiCodegenConfig = {
  output: "./src/generated",
  generateSummaries: true,
  prune: true,
  packages: [
    {
      package: "@local-pkg/plinko",
      path: "../plinko",
    },
  ],
};

export default config;
