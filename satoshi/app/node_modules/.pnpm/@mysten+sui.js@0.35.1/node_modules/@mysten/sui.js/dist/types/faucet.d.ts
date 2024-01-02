import { Infer } from 'superstruct';
export declare const FaucetCoinInfo: import("superstruct").Struct<{
    id: string;
    amount: number;
    transferTxDigest: string;
}, {
    amount: import("superstruct").Struct<number, null>;
    id: import("superstruct").Struct<string, null>;
    transferTxDigest: import("superstruct").Struct<string, null>;
}>;
export type FaucetCoinInfo = Infer<typeof FaucetCoinInfo>;
export declare const FaucetResponse: import("superstruct").Struct<{
    error: string | null;
    transferredGasObjects: {
        id: string;
        amount: number;
        transferTxDigest: string;
    }[];
}, {
    transferredGasObjects: import("superstruct").Struct<{
        id: string;
        amount: number;
        transferTxDigest: string;
    }[], import("superstruct").Struct<{
        id: string;
        amount: number;
        transferTxDigest: string;
    }, {
        amount: import("superstruct").Struct<number, null>;
        id: import("superstruct").Struct<string, null>;
        transferTxDigest: import("superstruct").Struct<string, null>;
    }>>;
    error: import("superstruct").Struct<string | null, null>;
}>;
export type FaucetResponse = Infer<typeof FaucetResponse>;
