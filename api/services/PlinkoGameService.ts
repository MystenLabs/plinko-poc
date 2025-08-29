// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SuiService } from "./SuiService";
import { Transaction } from "@mysten/sui/transactions";
import * as bls from "@noble/bls12-381";
import { getBLSSecretKey } from "../helpers/getBLSSecretKey";
import { sponsorAndSignTransaction } from "../utils/sponsorAndSignTransaction";

class PlinkoGameService {
  private suiService: SuiService;

  private tx = new Transaction();

  constructor() {
    this.suiService = new SuiService();
  }

  public finishGame(
    gameId: string,
    vrfInputArray: Uint8Array,
    numberofBalls: number
  ): Promise<{ trace: string; transactionDigest: string }> {
    return new Promise(async (resolve, reject) => {
      let blsHouseSignedInput = await bls.sign(
        new Uint8Array(vrfInputArray),
        getBLSSecretKey(process.env.PLINKO_HOUSE_PRIVATE_KEY!)
      );
      console.log("houseSignedInput=", blsHouseSignedInput);
      console.log("GameID: ", gameId);
      console.log("numberofBalls: ", numberofBalls);
      console.log("HOUSE DATA ID: ", String(process.env.HOUSE_DATA_ID!));
      console.log("PACKAGE_ADDRESS: ", process.env.PACKAGE_ADDRESS);

      const tx = new Transaction();
      tx.moveCall({
        target: `${process.env.PACKAGE_ADDRESS}::plinko::finish_game`,
        arguments: [
          tx.pure.string(gameId),
          tx.pure.vector("u8", Array.from(blsHouseSignedInput)),
          tx.object(String(process.env.HOUSE_DATA_ID!)),
          tx.pure.u64(numberofBalls),
        ],
      });

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
