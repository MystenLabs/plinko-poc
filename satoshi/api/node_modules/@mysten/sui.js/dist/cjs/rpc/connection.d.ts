interface ConnectionOptions {
    fullnode: string;
    websocket?: string;
    /** @deprecated Use the new faucet APIs from `@mysten/sui.js/faucet` instead. */
    faucet?: string;
}
export declare class Connection {
    #private;
    constructor(options: ConnectionOptions);
    get fullnode(): string;
    get websocket(): string;
    /** @deprecated Use the new faucet APIs from `@mysten/sui.js/faucet` instead. */
    get faucet(): string | undefined;
}
export declare const localnetConnection: Connection;
export declare const devnetConnection: Connection;
export declare const testnetConnection: Connection;
export declare const mainnetConnection: Connection;
export {};
