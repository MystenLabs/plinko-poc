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

        let mut scenario = test_scenario::begin(PLAYER);

        {
            let ctx = scenario.ctx();
            let counter = counter_nft::mint(ctx);
            counter.transfer_to_sender(ctx);
        };

        // Check the counter initial value
        scenario.next_tx(PLAYER);
        {
            let counter_nft = scenario.take_from_sender<Counter>();
            assert!(counter_nft.count() == 0, EInvalidCounterInitialValue);
            scenario.return_to_sender(counter_nft);
        };

         scenario.end();
    }

    #[test]
    fun test_increase_counter() {

        let mut scenario = test_scenario::begin(PLAYER);

        {
            let ctx = scenario.ctx();
            let counter = counter_nft::mint(ctx);
            counter.transfer_to_sender(ctx);
        };


        {
            let ctx = scenario.ctx();
            let counter = counter_nft::mint(ctx);
            counter.transfer_to_sender(ctx);
        };

        // Increase the counter
        scenario.next_tx(PLAYER);
        {
            let mut counter_nft = scenario.take_from_sender<Counter>();
            counter_nft.get_vrf_input_and_increment(1);
            assert!(counter_nft.count() == 1, EInvalidCounterWhenIncreased);
            scenario.return_to_sender(counter_nft);
        };

         scenario.end();
    }

    #[test]
        fun test_burn_counter() {
            let mut scenario = test_scenario::begin(PLAYER);

            {
                let ctx = scenario.ctx();
                let counter = counter_nft::mint(ctx);
                counter.transfer_to_sender(ctx);
            };

            // Burn the counter
            scenario.next_tx(PLAYER);
            {
                let counter_nft = scenario.take_from_sender<Counter>();
                counter_nft.burn_for_testing();
            };

            scenario.end();
    }
}
