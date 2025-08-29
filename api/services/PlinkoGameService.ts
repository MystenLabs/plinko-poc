// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SuiService } from "./SuiService";
import { Transaction } from "@mysten/sui/transactions";
import { sponsorAndSignTransaction } from "../utils/sponsorAndSignTransaction";
import * as plinko from "../generated/plinko/plinko";

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
      tx.add(
        plinko.finishGame({
          package: process.env.PACKAGE_ADDRESS!,
          arguments: {
            gameId,
            random: tx.object("0x8"),
            houseData: String(process.env.HOUSE_DATA_ID!),
            numBalls: numberofBalls,
          } as any, // codegen type
        })
      );

      //TODO: Change this to Enoki Sponsorship
      const { signedTransaction, sponsoredTransaction } =
        await sponsorAndSignTransaction({
          tx,
          suiClient: this.suiService.getClient(),
        });
      this.suiService
        .getClient()
        .executeTransactionBlock({
          transactionBlock: signedTransaction.bytes,
          signature: [
            signedTransaction.signature,
            sponsoredTransaction.signature,
          ],
          requestType: "WaitForLocalExecution",
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
