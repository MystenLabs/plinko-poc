// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SuiService } from "./SuiService";
import { Transaction } from "@mysten/sui/transactions";

class PlinkoGameService {
  private suiService: SuiService;

  private tx = new Transaction();

  constructor() {
    this.suiService = new SuiService();
  }

  public finishGame(
    gameId: string,
    numberofBalls: number
  ): Promise<{ trace: string; transactionDigest: string }> {
    return new Promise(async (resolve, reject) => {
      const tx = new Transaction();
      tx.moveCall({
        target: `${process.env.PACKAGE_ADDRESS}::plinko::finish_game`,
        arguments: [
          tx.pure.string(gameId),
          tx.object("0x8"),
          tx.object(String(process.env.HOUSE_DATA_ID!)),
          tx.pure.u64(numberofBalls),
        ],
      });
      // TODO: Re-evalute code-gen integration -> probably need to change to ESM
      // tx.add(
      //   plinko.finishGame({
      //     package: process.env.PACKAGE_ADDRESS!,
      //     arguments: {
      //       gameId,
      //       random: tx.object("0x8"),
      //       houseData: String(process.env.HOUSE_DATA_ID!),
      //       numBalls: numberofBalls,
      //     },
      //   })
      // );

      //TODO: Change this to Enoki Sponsorship
      // need to wait for local execution

      this.suiService
        .getClient()
        .signAndExecuteTransaction({
          transaction: tx,
          signer: this.suiService.getSigner(),
          options: {
            showObjectChanges: true,
            showEffects: true,
            showEvents: true,
          },
        })
        .then(async (res: any) => {
          const { effects, events } = res;
          const trace = events[0].parsedJson.trace;
          console.log("trace", trace);
          console.log(effects);
          const status = effects?.status?.status;
          const transactionDigest = effects?.transactionDigest!;

          if (status === "success") {
            resolve({
              trace,
              transactionDigest,
            });
          } else {
            reject({
              status: "failure",
              effects,
            });
          }
        })
        .catch((e: { message: any }) => {
          reject({
            status: "failure",
            message: e.message || "Transaction failed",
          });
        });
    });
  }
}
export default PlinkoGameService;
