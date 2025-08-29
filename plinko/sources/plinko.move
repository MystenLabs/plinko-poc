// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module plinko::plinko;
use plinko::house_data::HouseData;
use sui::balance::Balance;
use sui::coin::{Self, Coin};
use sui::dynamic_object_field as dof;
use sui::event::emit;
use sui::random::Random;
use sui::sui::SUI;

// === Errors ===
const EStakeTooLow: u64 = 0;
const EStakeTooHigh: u64 = 1;
const EInsufficientHouseBalance: u64 = 5;
const EGameDoesNotExist: u64 = 6;

// === Structs ===

/// Represents a game and holds the accrued stake.
public struct Game has key, store {
    id: UID,
    game_start_epoch: u64,
    stake: Balance<SUI>,
    player: address,
    fee_bp: u16,
}

// === Events ===

/// Emitted when a new game has started.
public struct NewGame has copy, drop {
    game_id: ID,
    player: address,
    user_stake: u64,
    fee_bp: u16,
}

/// Emitted when a game has finished.
public struct Outcome has copy, drop {
    game_id: ID,
    result: u64,
    player: address,
    // The trace path of the extended beacon
    trace: vector<u8>,
}

// === Public Functions ===

/// Function used to create a new game. The player must provide a Counter NFT and the number of balls.
public fun start_game(
    coin: Coin<SUI>,
    house_data: &mut HouseData,
    ctx: &mut TxContext,
): ID {
    let fee_bp = house_data.base_fee_in_bp();
    let (id, new_game) = internal_start_game( coin, house_data, fee_bp, ctx);
    dof::add(house_data.borrow_mut(), id, new_game);
    id
}

/// finish_game Completes the game by calculating the outcome and transferring the funds to the player.
/// It emits an Outcome event with the game result and the trace path of the extended beacon.
#[allow(lint(public_random))]
public fun finish_game(
    game_id: ID,
    random: &Random,
    house_data: &mut HouseData,
    num_balls: u64,
    ctx: &mut TxContext,
): (u64, address, vector<u8>) {
    // Ensure that the game exists.
    assert!(game_exists(house_data, game_id), EGameDoesNotExist);

    // Retrieves and removes the game from HouseData, preparing for outcome calculation.
    let Game {
        id,
        game_start_epoch: _,
        stake,
        player,
        fee_bp: _,
    } = dof::remove<ID, Game>(house_data.borrow_mut(), game_id);

    object::delete(id);

    // Initialize random generator and variables
    let mut random_generator = random.new_generator(ctx);
    let mut trace = vector[];

    // Calculate the stake amount per ball
    let stake_per_ball = stake.value<SUI>() / num_balls;
    let mut total_funds_amount: u64 = 0;

    // Calculate outcome for each ball using native randomness
    let mut ball_index = 0;
    while (ball_index < num_balls) {
        let mut state: u64 = 0;

        // Generate 12 random bytes for this ball and process them directly
        let mut i = 0;
        while (i < 12) {
            let byte = random_generator.generate_u8_in_range(0, 255);
            // Add the byte to the trace vector
            trace.push_back<u8>(byte);
            // Count the number of even bytes
            // If even, add 1 to the state
            // Odd byte -> 0, Even byte -> 1
            // The state is used to calculate the multiplier index
            state = if (byte % 2 == 0) { state + 1 } else { state };
            i = i + 1;
        };

        // Calculate multiplier index based on state
        let multiplier_index = state % house_data.multiplier().length();
        // Retrieve the multiplier from the house data
        let result = house_data.multiplier()[multiplier_index];

        // Calculate funds amount for this particular ball
        // Divide by 100 to adjust for multiplier scale and SUI units
        let funds_amount_per_ball = (result * stake_per_ball) / 100;
        // Add the funds amount to the total funds amount
        total_funds_amount = total_funds_amount + funds_amount_per_ball;
        ball_index = ball_index + 1;
    };

    // Processes the payout to the player and returns the game outcome.
    let payout_balance_mut = house_data.borrow_balance_mut();
    let payout_coin: Coin<SUI> = coin::take(payout_balance_mut, total_funds_amount, ctx);

    payout_balance_mut.join(stake);

    // transfer the payout coins to the player
    transfer::public_transfer(payout_coin, player);
    // Emit the Outcome event
    emit(Outcome {
        game_id,
        result: total_funds_amount,
        player,
        trace,
    });

    // return the total amount to be sent to the player, (and the player address)
    (total_funds_amount, player, trace)
}

// === Public-View Functions ===

/// Returns the epoch in which the game started.
public fun game_start_epoch(game: &Game): u64 {
    game.game_start_epoch
}

/// Returns the total stake.
public fun stake(game: &Game): u64 {
    game.stake.value()
}

/// Returns the player's address.
public fun player(game: &Game): address {
    game.player
}

/// Returns the fee of the game.
public fun fee_in_bp(game: &Game): u16 {
    game.fee_bp
}

// === Admin Functions ===

/// Helper function to check if a game exists.
public fun game_exists(house_data: &HouseData, game_id: ID): bool {
    dof::exists_(house_data.borrow(), game_id)
}

/// Helper function to check that a game exists and return a reference to the game Object.
/// Can be used in combination with any accessor to retrieve the desired game field.
public fun borrow_game(game_id: ID, house_data: &HouseData): &Game {
    assert!(game_exists(house_data, game_id), EGameDoesNotExist);
    dof::borrow(house_data.borrow(), game_id)
}

// === Private Functions ===

/// Internal helper function used to create a new game.
/// The player must provide a guess and a Counter NFT.
/// Stake is taken from the player's coin and added to the game's stake.
fun internal_start_game(
    coin: Coin<SUI>,
    house_data: &HouseData,
    fee_bp: u16,
    ctx: &mut TxContext,
): (ID, Game) {
    let user_stake = coin.value();
    // Ensure that the stake is not higher than the max stake.
    assert!(user_stake <= house_data.max_stake(), EStakeTooHigh);
    // Ensure that the stake is not lower than the min stake.
    assert!(user_stake >= house_data.min_stake(), EStakeTooLow);
    // Ensure that the house has enough balance to play for this game.
    assert!(
        house_data.balance() >= (user_stake * (house_data.multiplier()[0])) / 100,
        EInsufficientHouseBalance,
    );

    let id = object::new(ctx);
    let game_id = object::uid_to_inner(&id);

    // Create a new game object and emit a NewGame event.
    let new_game = Game {
        id,
        game_start_epoch: ctx.epoch(),
        stake: coin.into_balance<SUI>(),
        player: ctx.sender(),
        fee_bp,
    };
    // Emit a NewGame event
    emit(NewGame {
        game_id,
        player: ctx.sender(),
        user_stake,
        fee_bp,
    });

    (game_id, new_game)
}