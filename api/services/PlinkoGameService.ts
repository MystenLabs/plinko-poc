// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// import { SuiService, SuiServiceInterface } from "./SuiService";
import { SuiService } from "./SuiService";
import { TransactionBlock } from "@mysten/sui.js/transactions";
class PlinkoGameService {
  // private suiService: SuiServiceInterface;
  private suiService: SuiService;
  private gameIdMap: Map<
    String,
    {
      txn_digest: string;
      date_created: String;
      game_ended: boolean;
      player_won: boolean | null;
      date_ended: String | null;
    }
  > = new Map<
    String,
    {
      txn_digest: string;
      date_created: String;
      game_ended: boolean;
      player_won: boolean | null;
      date_ended: String | null;
    }
  >();

  private tx = new TransactionBlock();

  constructor() {
    this.suiService = new SuiService();
  }

  public getGames() {
    let games: Object[] = [];
    for (let key of this.gameIdMap.keys()) {
      games.push({ gameId: key, details: this.gameIdMap.get(key) });
    }
    return games;
  }

  public registerGame(gameId: string, txn_digest: string) {
    try {
      this.gameIdMap.set(gameId, {
        txn_digest,
        date_created: new Date().toUTCString(),
        game_ended: false,
        player_won: null,
        date_ended: null,
      });
      return true;
    } catch (e) {
      console.error("Encountered error while registering game", e);
      return false;
    }
  }

  // end-game for single player satoshi
  public finishGame(
    gameId: string,
    blsSig: Uint8Array
  ): Promise<{ playerWon: boolean; transactionDigest: string }> {
    return new Promise(async (resolve, reject) => {
      // Limiting the use of endGame call to only gameIds created within the scope of the application
      // if (!this.gameIdMap.has(gameId)) {
      //   reject("Given gameId does not exist");
      //   return;
      // //

      let txnDigest = this.gameIdMap.get(gameId)?.txn_digest;
      let numberofBalls = 2;
      // console.log(`Waiting for create game txn with digest ${txnDigest} to sync...`);
      // let hasSynced = await this.suiService.hasBlockSynced(txnDigest!);
      // console.log('Has synced', !!hasSynced);

      // if (!hasSynced) {
      //   return reject({
      //     status: "failure",
      //     message: "Timeout expired while waiting for full nodes to sync on the created game",
      //   });
      // }

      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${process.env.PACKAGE_ADDRESS}::plinko::finish_game`,
        arguments: [
          tx.object(gameId),
          tx.pure(Array.from(blsSig), "vector<u8>"),
          tx.object(String(process.env.HOUSE_DATA_ID)),
          tx.pure(numberofBalls, "u64")
        ],
      });

      this.suiService
        .getClient()
        .signAndExecuteTransactionBlock({
          transactionBlock: tx,
          requestType: "WaitForLocalExecution",
          signer: this.suiService.getSigner(),
          options: {
            showObjectChanges: true,
            showEffects: true,
          },
        })
        .then(async (res: any) => {
          const {
            effects,
            objectChanges,
            balanceChanges
          } = res;

          const status = effects?.status?.status;
          const transactionDigest = effects?.transactionDigest!;

          if (status === "success") {
            console.log(JSON.stringify(balanceChanges, null, 2));
            const outcomeObjId = (
              objectChanges?.find(({ objectType }: any) =>
                objectType.includes("::Outcome")
              ) as any
            )?.objectId;
            const outcomeObj: any = await this.suiService.getObject(
              outcomeObjId
            );
            const fields = outcomeObj?.data?.content?.fields;
            const gameResult = {
              game_ended: true,
              player_won: fields?.player_won,
              guess: fields?.guess,
              date_ended: new Date().toUTCString(),
              date_created: this.gameIdMap.get(gameId)?.date_created || "N/A",
              txn_digest: txnDigest!
            };
            console.log({ won: fields?.player_won });
            this.gameIdMap.set(gameId, gameResult);
            resolve({
              playerWon: fields?.player_won,
              transactionDigest,
            });
          } else {
            reject({
              status: "failure",
              effects,
            });
          }
        })
        .catch((e: { message: any; }) => {
          reject({
            status: "failure",
            message: e.message || "Transaction failed",
          });
        });
    });
  }
}

export default PlinkoGameService;