// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This module implements a simple, non transferable counter NFT.
/// Creates a counter object that can be incremented and burned.
/// Utilized as a unique VRF input for each Plinko round.
module plinko::counter_nft {
    // === Imports ===
    use sui::bcs::{Self};

    // === Structs ===

    /// A Counter object serves as a unique, NFT
    /// that increments with each use. It's designed to provide a unique
    /// Verifiable Random Function (VRF) input for each round of the game,
    /// ensuring the randomness and fairness of game outcomes.
    public struct Counter has key {
        id: UID,
        // A numerical value that increments with each use of the Counter.
        // This incrementing behavior is critical for ensuring that each game round
        // receives a fresh, unique input for randomness generation.
        count: u64,
    }

    /// Deletes a counter object.
    entry fun burn(self: Counter) {
        let Counter { id, count: _ } = self;
        object::delete(id);
    }

    /// Creates a new counter object. Used in combination with the transfer_to_sender method to provide the same
    /// UX when creating a Counter NFT for the first time.
    public fun mint(ctx: &mut TxContext): Counter {
        Counter {
            id: object::new(ctx),
            count: 0
        }
    }

    /// Transfers a counter object to the sender.
    public fun transfer_to_sender(counter: Counter, ctx: &mut TxContext) {
        transfer::transfer(counter, ctx.sender());
    }

    /// Generates a unique VRF input by concatenating the Counter's ID, its current count, and the number of balls
    /// selected by the player. This composite input ensures each game round has a distinct random seed.
    /// The count is incremented after use to maintain uniqueness for subsequent rounds.
    public fun get_vrf_input_and_increment(self: &mut Counter, num_balls: u64): vector<u8> {
        let mut vrf_input = object::id_bytes(self);
        let count_to_bytes = bcs::to_bytes(&self.count());
        let num_balls_to_bytes = bcs::to_bytes(&num_balls);
        vrf_input.append(count_to_bytes);
        vrf_input.append(num_balls_to_bytes);
        self.increment();
        vrf_input
    }

    /// Returns the current count of the counter object.
    public fun count(self: &Counter): u64 {
        self.count
    }

    /// Internal function to increment the counter by 1.
    fun increment(self: &mut Counter) {
        self.count = self.count + 1;
    }

    // === Test Functions ===

    #[test_only]
    public fun burn_for_testing(self: Counter) {
        self.burn();
    }

    #[test_only]
    public fun get_vrf_input_for_testing(self: &mut Counter): vector<u8> {
        let vrf_input: vector<u8> = self.get_vrf_input_and_increment(1);
        vrf_input
    }

}
