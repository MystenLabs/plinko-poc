// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module plinko::counter_nft_tests {
    use sui::test_scenario;

    use plinko::counter_nft::{Self, Counter};

    // Test addresses.
    const PLAYER: address = @0xAAA;

    // Test errors.
    const EInvalidCounterInitialValue: u64 = 1;
    const EInvalidCounterWhenIncreased: u64 = 2;

    #[test]
    fun test_create_counter() {

        let scenario_val = test_scenario::begin(PLAYER);
        let scenario = &mut scenario_val;   

        {
            let ctx = test_scenario::ctx(scenario);
            let counter = counter_nft::mint(ctx);
            counter_nft::transfer_to_sender(counter, ctx);
        };

        // Check the counter initial value
        test_scenario::next_tx(scenario, PLAYER);
        {
            let counter_nft = test_scenario::take_from_sender<Counter>(scenario);
            assert!(counter_nft::count(&counter_nft) == 0, EInvalidCounterInitialValue);
            test_scenario::return_to_sender(scenario, counter_nft);
        };

         test_scenario::end(scenario_val);
    }

    #[test]
    fun test_increase_counter() {

        let scenario_val = test_scenario::begin(PLAYER);
        let scenario = &mut scenario_val;   

        {
            let ctx = test_scenario::ctx(scenario);
            let counter = counter_nft::mint(ctx);
            counter_nft::transfer_to_sender(counter, ctx);
        };


        {
            let ctx = test_scenario::ctx(scenario);
            let counter = counter_nft::mint(ctx);
            counter_nft::transfer_to_sender(counter, ctx);
        };

        // Increase the counter
        test_scenario::next_tx(scenario, PLAYER);
        {
            let counter_nft = test_scenario::take_from_sender<Counter>(scenario);
            counter_nft::get_vrf_input_and_increment(&mut counter_nft, 1);
            assert!(counter_nft::count(&counter_nft) == 1, EInvalidCounterWhenIncreased);
            test_scenario::return_to_sender(scenario, counter_nft);
        };

         test_scenario::end(scenario_val);
    }

    #[test]
        fun test_burn_counter() {
            let scenario_val = test_scenario::begin(PLAYER);
            let scenario = &mut scenario_val;   

            {
                let ctx = test_scenario::ctx(scenario);
                let counter = counter_nft::mint(ctx);
                counter_nft::transfer_to_sender(counter, ctx);
            };

            // Burn the counter
            test_scenario::next_tx(scenario, PLAYER);
            {
                let counter_nft = test_scenario::take_from_sender<Counter>(scenario);
                counter_nft::burn_for_testing(counter_nft);
            };

            test_scenario::end(scenario_val);
    }
}