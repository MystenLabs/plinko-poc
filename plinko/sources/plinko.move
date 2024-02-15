// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module plinko::plinko {
    // === Imports ===
    use std::vector;
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::bls12381::bls12381_min_pk_verify;
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event::emit;
    use sui::hash::{blake2b256};
    use sui::dynamic_object_field::{Self as dof};

    // Counter library
    use plinko::counter_nft::{Self, Counter};

    // HouseData library
    use plinko::house_data::{Self as hd, HouseData};

    // === Errors ===
    const EStakeTooLow: u64 = 0;
    const EStakeTooHigh: u64 = 1;
    const EInvalidBlsSig: u64 = 2;
    const EInsufficientHouseBalance: u64 = 5;
    const EGameDoesNotExist: u64 = 6;

    // === Constants ===
    const GAME_RETURN: u8 = 2;

    // === Structs ===

    /// Represents a game and holds the acrued stake.
    /// The guess field could have also been represented as a u8 or boolean, but we chose to use "H" and "T" strings for readability and safety.
    /// Makes it easier for the user to assess if a selection they made on a DApp matches with the txn they are signing on their wallet.
    struct Game has key, store {
        id: UID,
        game_start_epoch: u64,
        stake: Balance<SUI>,
        player: address,
        vrf_input: vector<u8>,
        fee_bp: u16
    }

    // === Events ===

    /// Emitted when a new game has started.
    struct NewGame has copy, drop {
        game_id: ID,
        player: address,
        vrf_input: vector<u8>,
        user_stake: u64,
        fee_bp: u16
        // is it worth it to save the multiplier vector
    }

    /// Emitted when a game has finished.
    struct Outcome has copy, drop {
        game_id: ID,
        result: u64,
        player: address,
        trace: vector<u8>
    }

    // === Public Functions ===

    /// Function used to create a new game. The player must provide a guess and a Counter NFT.
    /// Stake is taken from the player's coin and added to the game's stake. The house's stake is also added to the game's stake.
    public fun start_game(counter: &mut Counter, num_balls: u64, coin: Coin<SUI>, house_data: &mut HouseData, ctx: &mut TxContext): ID {
        let fee_bp = hd::base_fee_in_bp(house_data);
        let (id, new_game) = internal_start_game(counter, num_balls, coin, house_data, fee_bp, ctx);

        dof::add(hd::borrow_mut(house_data), id, new_game);
        id
    }

    /// Completes a game, calculating the outcome and transferring winnings.
    public fun finish_game(game_id: ID, bls_sig: vector<u8>, house_data: &mut HouseData, num_balls: u64, ctx: &mut TxContext): (u64, address, vector<u8>) {
        // Ensure that the game exists.
        assert!(game_exists(house_data, game_id), EGameDoesNotExist);

        // Retrieves and removes the game from HouseData, preparing for outcome calculation.
        let Game {
            id,
            game_start_epoch: _,
            stake,
            player,
            vrf_input,
            fee_bp: _
        } = dof::remove<ID, Game>(hd::borrow_mut(house_data), game_id);

        object::delete(id);

        // Validates the BLS signature against the VRF input.
        let is_sig_valid = bls12381_min_pk_verify(&bls_sig, &hd::public_key(house_data), &vrf_input);
        assert!(is_sig_valid, EInvalidBlsSig);

        // Initialize the extended beacon vector and a counter for hashing.
        let extended_beacon = vector::empty<u8>();
        let counter: u8 = 0;

        // Extends the beacon until it has enough data for all ball outcomes.
        while (vector::length(&extended_beacon) < (num_balls * 12)) {
            // Create a new vector combining the original BLS signature with the current counter value.
            let hash_input = vector::empty<u8>();
            vector::append(&mut hash_input, bls_sig);
            vector::append(&mut hash_input, vector::singleton(counter));
            // Generate a new hash block from the unique hash input.
            let block = blake2b256(&hash_input);
            // Append the generated hash block to the extended beacon.
            vector::append(&mut extended_beacon, block);
            // Increment the counter for the next iteration to ensure a new unique hash input.
            counter = counter + 1;
        };

        // Initializes variables for calculating game outcome.
        let trace = vector::empty<u8>();
        // Calculate the stake amount per ball
        let stake_per_ball = balance::value<SUI>(&stake) / num_balls;
        let total_funds_amount: u64 = 0;

        // Calculates outcome for each ball based on the extended beacon.
        let ball_index = 0;
        while (ball_index < num_balls) {
            let state: u64 = 0;
            let i = 0;
            while (i < 12) {
                let byte_index = (ball_index * 12) + i;
                let byte = *vector::borrow(&extended_beacon, byte_index);
                // Add the byte to the trace vector
                vector::push_back<u8>(&mut trace, byte);
                // Count the number of even bytes
                // If even, add 1 to the state
                // Odd byte -> 0, Even byte -> 1
                state = if (byte % 2 == 0) { state + 1 } else { state };
                i = i + 1;
            };

        // Calculate multiplier index based on state
        let multiplier_index = state % vector::length(&hd::multiplier(house_data));
        let result = *vector::borrow(&hd::multiplier(house_data), multiplier_index);
        
        // Calculate funds amount for this particular ball
        // Divide by 100 to adjust for multiplier scale and SUI units
        let funds_amount_per_ball = (result * stake_per_ball)/100; 
        total_funds_amount = total_funds_amount + funds_amount_per_ball;
        ball_index = ball_index + 1;
    };

    // Processes the payout to the player and returns the game outcome.
    let payout_balance_mut = hd::borrow_balance_mut(house_data);
    let payout_coin = coin::take(payout_balance_mut, total_funds_amount, ctx);

    balance::join(payout_balance_mut, stake);

    // transfer the payout coins to the player
    transfer::public_transfer(payout_coin, player);

    emit(Outcome {
        game_id,
        result: total_funds_amount,
        player,
        trace
    });

    // return the total amount to be sent to the player, (and the player address) the transaction will happen by a PTB
    (total_funds_amount, player, trace)
}

    // === Public-View Functions ===

    /// Returns the epoch in which the gane started.
    public fun game_start_epoch(game: &Game): u64 {
        game.game_start_epoch
    }

    /// Returns the total stake.
    public fun stake(game: &Game): u64 {
        balance::value(&game.stake) // TODO: update this
    }

    /// Returns the player's address.
    public fun player(game: &Game): address {
        game.player
    }

    /// Returns the player's vrf_input bytes.
    public fun vrf_input(game: &Game): vector<u8> {
        game.vrf_input
    }

    /// Returns the fee of the game.
    public fun fee_in_bp(game: &Game): u16 {
        game.fee_bp
    }

    // === Admin Functions ===

    /// Helper function to calculate the amount of fees to be paid.
    /// Fees are only applied on the player's stake.
    public fun fee_amount(game_stake: u64, fee_in_bp: u16): u64 {
        ((((game_stake / (GAME_RETURN as u64)) as u128) * (fee_in_bp as u128) / 10_000) as u64)
    }

    /// Helper function to check if a game exists.
    public fun game_exists(house_data: &HouseData, game_id: ID): bool {
        dof::exists_(hd::borrow(house_data), game_id)
    }

    /// Helper function to check that a game exists and return a reference to the game Object.
    /// Can be used in combination with any accessor to retrieve the desired game field.
    public fun borrow_game(game_id: ID, house_data: &HouseData): &Game {
        assert!(game_exists(house_data, game_id), EGameDoesNotExist);
        dof::borrow(hd::borrow(house_data), game_id)
    }

    // === Private Functions ===

    /// Internal helper function ussed to create a new game. 
    /// The player must provide a guess and a Counter NFT.
    /// Stake is taken from the player's coin and added to the game's stake. 
    /// The house's stake is also added to the game's stake.
    fun internal_start_game(counter: &mut Counter, num_balls: u64, coin: Coin<SUI>, house_data: &HouseData, fee_bp: u16, ctx: &mut TxContext): (ID, Game) {
        // Ensure guess is valid.
        // map_guess(guess);
        let user_stake = coin::value(&coin);
        // Ensure that the stake is not higher than the max stake.
        assert!(user_stake <= hd::max_stake(house_data), EStakeTooHigh);
        // Ensure that the stake is not lower than the min stake.
        assert!(user_stake >= hd::min_stake(house_data), EStakeTooLow);
        // Ensure that the house has enough balance to play for this game.
        assert!(hd::balance(house_data) >= (user_stake*(*vector::borrow(&hd::multiplier(house_data), 0)))/100, EInsufficientHouseBalance);

        let vrf_input = counter_nft::get_vrf_input_and_increment(counter, num_balls);

        let id = object::new(ctx);
        let game_id = object::uid_to_inner(&id);

        let new_game = Game {
            id,
            game_start_epoch: tx_context::epoch(ctx),
            stake: coin::into_balance<SUI>(coin),
            player: tx_context::sender(ctx),
            vrf_input,
            fee_bp
        };
        emit(NewGame {
            game_id,
            player: tx_context::sender(ctx),
            vrf_input,
            user_stake,
            fee_bp
        });

        (game_id, new_game)
    }

}