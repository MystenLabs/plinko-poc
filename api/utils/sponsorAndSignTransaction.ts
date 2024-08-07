import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { sponsorTransaction } from "./sponsorTransaction";
import { getKeypair } from "../helpers/getKeyPair";

interface SponsorAndSignTransactionProps {
  suiClient: SuiClient;
  tx: TransactionBlock;
}

export const sponsorAndSignTransaction = async ({
  tx,
  suiClient,
}: SponsorAndSignTransactionProps) => {
  const adminKeypair = getKeypair(process.env.PLINKO_HOUSE_PRIVATE_KEY!);
  const txBytes = await tx.build({
    client: suiClient,
    onlyTransactionKind: true,
  });
  const sponsoredTransaction = await sponsorTransaction({
    txBytes,
    forceFailure: false,
  });
  if (!sponsoredTransaction) {
    throw new Error("Sponsoring transaction failed");
  }
  const signedTransaction = await adminKeypair.signTransactionBlock(
    await TransactionBlock.from(sponsoredTransaction.txBytes).build({
      client: suiClient,
    })
  );
  return {
    signedTransaction,
    sponsoredTransaction,
  };
};
