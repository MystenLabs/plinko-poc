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
      const res = tx.moveCall({
        target: `${process.env.PACKAGE_ADDRESS}::plinko::finish_game`,
        arguments: [
          tx.pure.address(gameId),
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

      // inside your service method
      try {
        const res = await this.suiService
          .getClient()
          .signAndExecuteTransaction({
            transaction: tx,
            signer: this.suiService.getSigner(),
            options: {
              showObjectChanges: true,
              showEffects: true,
              showEvents: true,
            },
            // requestType: 'WaitForEffectsCert', // optional; default behavior fits this since you're asking for effects/events
          });

        const { effects, events } = res;

        // Prefer res.digest when available; effects.transactionDigest also works.
        const digest = res.digest ?? effects?.transactionDigest;
        const status = effects?.status?.status;

        // Extract your trace (defensively)

        // Extract your trace (defensively, no ts-ignore)
        type Evt = { parsedJson?: unknown };

        const traceEvt = (events as Evt[] | undefined)?.find(
          (e) =>
            typeof e?.parsedJson === "object" &&
            e.parsedJson !== null &&
            "trace" in (e.parsedJson as Record<string, unknown>)
        ) as { parsedJson: { trace: string } } | undefined;

        const trace =
          traceEvt?.parsedJson.trace ??
          (typeof events?.[0]?.parsedJson === "object" &&
          events?.[0]?.parsedJson !== null &&
          "trace" in (events![0].parsedJson as Record<string, unknown>)
            ? (events![0].parsedJson as { trace: string }).trace
            : undefined);

        if (status === "success") {
          return resolve({
            trace: trace!,
            transactionDigest: digest!,
          });
        } else {
          return reject({
            status: "failure",
            effects,
          });
        }
      } catch (e: any) {
        return reject({
          status: "failure",
          message: e?.message ?? "Transaction failed",
        });
      }
    });
  }
}
export default PlinkoGameService;
