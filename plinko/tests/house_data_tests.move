// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module plinko::house_data_tests {
    use std::debug::print;
    use sui::test_scenario::{Self, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;

    use plinko::house_data::{Self as hd, HouseData, HouseCap};

    const HOUSE: address = @0xCAFE;
    const PLAYER: address = @0x1234;

    // House's public key.
    const PK: vector<u8> = vector<u8> [
        138, 151,  85,  75, 187, 115,  84, 101, 165,
        216,  98, 179,  20,  76, 234, 137, 195, 124,
        137, 232, 255, 144, 254,  58, 101, 172,  37,
        191,  55, 212,   5, 149,  73, 106, 173, 220,
        81, 173,  59,  52,  31,  57, 147, 190, 183,
        183,  59, 156
    ];

    const INITIAL_HOUSE_BALANCE: u64 = 5_000_000_000; // 1 SUI
    
    const MULTIPLIER_ARRAY: vector<u64> = vector<u64> [900, 820, 650, 380, 100, 60, 40, 60, 100, 380, 650, 820, 900];
    const UPDATED_MULTIPLIER_ARRAY: vector<u64> = vector<u64> [90, 82, 65, 38, 10, 6, 4, 6, 10, 38, 65, 82, 90];

    // Initialize the house data
    public fun init_house(scenario: &mut Scenario, house: address ) {
        test_scenario::next_tx(scenario, house);
        {
            let ctx = test_scenario::ctx(scenario);
            hd::init_for_testing(ctx);
        };
        test_scenario::next_tx(scenario, house);
        {
            let house_cap = test_scenario::take_from_sender<HouseCap>(scenario);
            let house_coins = test_scenario::take_from_sender<Coin<SUI>>(scenario);
            let ctx = test_scenario::ctx(scenario);

            hd::initialize_house_data(house_cap, house_coins, PK, MULTIPLIER_ARRAY, ctx);

        };
    }

     /// Used to initialize the user and house balances.
    public fun fund_house_address(scenario: &mut Scenario, house: address, house_funds: u64) {
        let ctx = test_scenario::ctx(scenario);
        let coinA = coin::mint_for_testing<SUI>(house_funds, ctx);
        transfer::public_transfer(coinA, house);
    }

    #[test]
    fun test_update_multiplier_vector(){
   
        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        {
            fund_house_address(scenario, HOUSE, INITIAL_HOUSE_BALANCE);
        };
        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE);

        // House updates multiplier vector
        test_scenario::next_tx(scenario, HOUSE);
        {
           let house_data = test_scenario::take_shared<HouseData>(scenario);
           hd::update_multiplier_vector(&mut house_data, UPDATED_MULTIPLIER_ARRAY);
           print(&house_data);
           test_scenario::return_shared(house_data);
        };

        test_scenario::end(scenario_val);

    }

    #[test]
    fun test_top_up (){

        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        {
            fund_house_address(scenario, HOUSE, INITIAL_HOUSE_BALANCE);
        };

        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE);

        // House tops up the contract
        test_scenario::next_tx(scenario, HOUSE);
        {
            let house_data = test_scenario::take_shared<HouseData>(scenario);
            let ctx = test_scenario::ctx(scenario);
            let coin_top_up = coin::mint_for_testing<SUI>(5000000000, ctx);
                hd::top_up(&mut house_data, coin_top_up, ctx);
                print(&house_data);
                test_scenario::return_shared(house_data);
            };
        test_scenario::end(scenario_val);    
    }
    
    #[test]
    fun test_withdraw(){
        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        {
            fund_house_address(scenario, HOUSE, INITIAL_HOUSE_BALANCE);
        };

        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE);

        // House withdraws from the contract
        test_scenario::next_tx(scenario, HOUSE);
        {
            let house_data = test_scenario::take_shared<HouseData>(scenario);
            let ctx = test_scenario::ctx(scenario);
                hd::withdraw(&mut house_data, ctx);
                print(&house_data);
                test_scenario::return_shared(house_data);
            };
        test_scenario::end(scenario_val);
    }

    #[test]
    #[expected_failure(abort_code = hd::ECallerNotHouse)]
    fun test_invalid_withdraw(){
        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        {
            fund_house_address(scenario, HOUSE, INITIAL_HOUSE_BALANCE);
        };

        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE);

        // A player tries to withdraw from the contract
        test_scenario::next_tx(scenario, PLAYER);
        {
            let house_data = test_scenario::take_shared<HouseData>(scenario);
            let ctx = test_scenario::ctx(scenario);
                hd::withdraw(&mut house_data, ctx);
                print(&house_data);
                test_scenario::return_shared(house_data);
            };
        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_claim_fees(){
        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        {
            fund_house_address(scenario, HOUSE, INITIAL_HOUSE_BALANCE);
        };

        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE);

        // House claims fees from the contract
        test_scenario::next_tx(scenario, HOUSE);
        {
            let house_data = test_scenario::take_shared<HouseData>(scenario);
            let ctx = test_scenario::ctx(scenario);
                hd::claim_fees(&mut house_data, ctx);
                print(&house_data);
                test_scenario::return_shared(house_data);
            };
        test_scenario::end(scenario_val);
    }

    #[test]
    #[expected_failure(abort_code = hd::ECallerNotHouse)]
    fun test_invalid_claim_fees(){
        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        {
            fund_house_address(scenario, HOUSE, INITIAL_HOUSE_BALANCE);
        };

        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE);

        // House claims fees from the contract
        test_scenario::next_tx(scenario, PLAYER);
        {
            let house_data = test_scenario::take_shared<HouseData>(scenario);
            let ctx = test_scenario::ctx(scenario);
                hd::claim_fees(&mut house_data, ctx);
                print(&house_data);
                test_scenario::return_shared(house_data);
            };
        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_update_min_stake(){
        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        {
            fund_house_address(scenario, HOUSE, INITIAL_HOUSE_BALANCE);
        };

        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE);

        // House updates the minimum stake
        test_scenario::next_tx(scenario, HOUSE);
        {
            let house_data = test_scenario::take_shared<HouseData>(scenario);
            let ctx = test_scenario::ctx(scenario);
                hd::update_min_stake(&mut house_data, 5000000000, ctx);
                print(&house_data);
                test_scenario::return_shared(house_data);
            };
        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_update_max_stake(){
        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        {
            fund_house_address(scenario, HOUSE, INITIAL_HOUSE_BALANCE);
        };

        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE);

        // House updates the minimum stake
        test_scenario::next_tx(scenario, HOUSE);
        {
            let house_data = test_scenario::take_shared<HouseData>(scenario);
            let ctx = test_scenario::ctx(scenario);
                hd::update_max_stake(&mut house_data, 60000000000, ctx);
                print(&house_data);
                test_scenario::return_shared(house_data);
            };
        test_scenario::end(scenario_val);
    }
}
