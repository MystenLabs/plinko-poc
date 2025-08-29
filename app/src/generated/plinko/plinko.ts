/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
import * as object from './deps/sui/object.js';
import * as balance from './deps/sui/balance.js';
const $moduleName = '@local-pkg/plinko::plinko';
export const Game = new MoveStruct({ name: `${$moduleName}::Game`, fields: {
        id: object.UID,
        game_start_epoch: bcs.u64(),
        stake: balance.Balance,
        player: bcs.Address,
        fee_bp: bcs.u16()
    } });
export const NewGame = new MoveStruct({ name: `${$moduleName}::NewGame`, fields: {
        game_id: bcs.Address,
        player: bcs.Address,
        user_stake: bcs.u64(),
        fee_bp: bcs.u16()
    } });
export const Outcome = new MoveStruct({ name: `${$moduleName}::Outcome`, fields: {
        game_id: bcs.Address,
        result: bcs.u64(),
        player: bcs.Address,
        trace: bcs.vector(bcs.u8())
    } });
export interface StartGameArguments {
    numBalls: RawTransactionArgument<number | bigint>;
    coin: RawTransactionArgument<string>;
    houseData: RawTransactionArgument<string>;
}
export interface StartGameOptions {
    package?: string;
    arguments: StartGameArguments | [
        numBalls: RawTransactionArgument<number | bigint>,
        coin: RawTransactionArgument<string>,
        houseData: RawTransactionArgument<string>
    ];
}
/**
 * Function used to create a new game. The player must provide a Counter NFT and
 * the number of balls.
 */
export function startGame(options: StartGameOptions) {
    const packageAddress = options.package ?? '@local-pkg/plinko';
    const argumentsTypes = [
        'u64',
        '0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>',
        `${packageAddress}::house_data::HouseData`
    ] satisfies string[];
    const parameterNames = ["numBalls", "coin", "houseData"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'plinko',
        function: 'start_game',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GameStartEpochArguments {
    game: RawTransactionArgument<string>;
}
export interface GameStartEpochOptions {
    package?: string;
    arguments: GameStartEpochArguments | [
        game: RawTransactionArgument<string>
    ];
}
/** Returns the epoch in which the game started. */
export function gameStartEpoch(options: GameStartEpochOptions) {
    const packageAddress = options.package ?? '@local-pkg/plinko';
    const argumentsTypes = [
        `${packageAddress}::plinko::Game`
    ] satisfies string[];
    const parameterNames = ["game"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'plinko',
        function: 'game_start_epoch',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StakeArguments {
    game: RawTransactionArgument<string>;
}
export interface StakeOptions {
    package?: string;
    arguments: StakeArguments | [
        game: RawTransactionArgument<string>
    ];
}
/** Returns the total stake. */
export function stake(options: StakeOptions) {
    const packageAddress = options.package ?? '@local-pkg/plinko';
    const argumentsTypes = [
        `${packageAddress}::plinko::Game`
    ] satisfies string[];
    const parameterNames = ["game"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'plinko',
        function: 'stake',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface PlayerArguments {
    game: RawTransactionArgument<string>;
}
export interface PlayerOptions {
    package?: string;
    arguments: PlayerArguments | [
        game: RawTransactionArgument<string>
    ];
}
/** Returns the player's address. */
export function player(options: PlayerOptions) {
    const packageAddress = options.package ?? '@local-pkg/plinko';
    const argumentsTypes = [
        `${packageAddress}::plinko::Game`
    ] satisfies string[];
    const parameterNames = ["game"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'plinko',
        function: 'player',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FeeInBpArguments {
    game: RawTransactionArgument<string>;
}
export interface FeeInBpOptions {
    package?: string;
    arguments: FeeInBpArguments | [
        game: RawTransactionArgument<string>
    ];
}
/** Returns the fee of the game. */
export function feeInBp(options: FeeInBpOptions) {
    const packageAddress = options.package ?? '@local-pkg/plinko';
    const argumentsTypes = [
        `${packageAddress}::plinko::Game`
    ] satisfies string[];
    const parameterNames = ["game"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'plinko',
        function: 'fee_in_bp',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GameExistsArguments {
    houseData: RawTransactionArgument<string>;
    gameId: RawTransactionArgument<string>;
}
export interface GameExistsOptions {
    package?: string;
    arguments: GameExistsArguments | [
        houseData: RawTransactionArgument<string>,
        gameId: RawTransactionArgument<string>
    ];
}
/** Helper function to check if a game exists. */
export function gameExists(options: GameExistsOptions) {
    const packageAddress = options.package ?? '@local-pkg/plinko';
    const argumentsTypes = [
        `${packageAddress}::house_data::HouseData`,
        '0x0000000000000000000000000000000000000000000000000000000000000002::object::ID'
    ] satisfies string[];
    const parameterNames = ["houseData", "gameId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'plinko',
        function: 'game_exists',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface BorrowGameArguments {
    gameId: RawTransactionArgument<string>;
    houseData: RawTransactionArgument<string>;
}
export interface BorrowGameOptions {
    package?: string;
    arguments: BorrowGameArguments | [
        gameId: RawTransactionArgument<string>,
        houseData: RawTransactionArgument<string>
    ];
}
/**
 * Helper function to check that a game exists and return a reference to the game
 * Object. Can be used in combination with any accessor to retrieve the desired
 * game field.
 */
export function borrowGame(options: BorrowGameOptions) {
    const packageAddress = options.package ?? '@local-pkg/plinko';
    const argumentsTypes = [
        '0x0000000000000000000000000000000000000000000000000000000000000002::object::ID',
        `${packageAddress}::house_data::HouseData`
    ] satisfies string[];
    const parameterNames = ["gameId", "houseData"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'plinko',
        function: 'borrow_game',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}