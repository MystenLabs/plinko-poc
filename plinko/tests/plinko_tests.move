// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
#[test_only]

module plinko::plinko_tests {

    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::debug::print;
    use sui::test_scenario::{Self, Scenario};
    use plinko::house_data::{Self as hd,  HouseCap, HouseData};
    use plinko::plinko::{Self as plk};
    use sui::random::Random;
    const HOUSE: address = @0x21ba535ffa74e261a6281a205398ac9400bbbac41b49bfa967882abdf86b1486;
    const PLAYER: address = @0x4670405fc30d04de9946ad2d6ad822a2859af40a12a0a6ea4516a526884359cf;
    const SYSTEM_OBJECT: address = @0x0;
    const INITIAL_HOUSE_BALANCE: u64 = 50000000000; // 50 SUI
    const LOW_HOUSE_BALANCE: u64 = 10000000000; // 10 SUI
    const INITIAL_PLAYER_BALANCE: u64 = 20_000_000_000; // 20 SUI
    const MULTIPLIER_ARRAY: vector<u64> = vector<u64> [900, 820, 650, 380, 100, 60, 40, 60, 100, 380, 650, 820, 900];

    #[test]
    fun player_valid_selections(){
        start_game( 1, true, true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EStakeTooLow)]
    fun player_low_stake(){
        start_game( 1, false,  true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EStakeTooHigh)]
    fun player_high_stake(){
        start_game( 1, false,  true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EInsufficientHouseBalance)]
    fun insuficient_house_balance(){
        start_game( 1, true,  true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EGameDoesNotExist)]
    fun invalid_game_id(){
        start_game( 1, false,  false);
    }

    //  --- Helper functions ---

    fun start_game(num_balls: u64, low_house_balance: bool, valid_game_id: bool) {

        let mut scenario = test_scenario::begin(HOUSE);
        let init_house_balance : u64;
        let game_id : ID;
        {
            if(low_house_balance){
                init_house_balance = LOW_HOUSE_BALANCE;
            } else {
                init_house_balance = INITIAL_HOUSE_BALANCE;
            };
            fund_addresses(&mut scenario, HOUSE, PLAYER, init_house_balance, INITIAL_PLAYER_BALANCE);
        };
        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(&mut scenario, HOUSE, true);

        if (valid_game_id){
            // i am just copying the else part here for now but needs to get fixed
            let ctx = scenario.ctx();
            let temp_game_uid = sui::object::new(ctx);
            game_id = sui::object::uid_to_inner(&temp_game_uid);
            sui::object::delete(temp_game_uid);
        } else {
            let ctx = scenario.ctx();
            let temp_game_uid = sui::object::new(ctx);
            game_id = sui::object::uid_to_inner(&temp_game_uid);
            sui::object::delete(temp_game_uid);
        };
        print(&game_id);

        end_game(&mut scenario, game_id, HOUSE, num_balls);

        scenario.end();
    }

    /// Deployment & house object initialization.
    /// Variable valid_coin is used to test expected failures.
    public fun init_house(scenario: &mut Scenario, house: address, valid_coin: bool) {
        scenario.next_tx(house);
        {
            let ctx = scenario.ctx();
            hd::init_for_testing(ctx);
        };

        // House initializes the contract with PK.
        scenario.next_tx(HOUSE);
        {
            let house_cap = scenario.take_from_sender<HouseCap>();
            if (valid_coin) {
                let house_coin = scenario.take_from_sender<Coin<SUI>>();
                let ctx = scenario.ctx();
                house_cap.initialize_house_data(house_coin, MULTIPLIER_ARRAY, ctx);
            } else {
                let ctx = scenario.ctx();
                let zero_coin = coin::zero<SUI>(ctx);
                house_cap.initialize_house_data(zero_coin, MULTIPLIER_ARRAY, ctx);
            };
        };
    }



    /// Used to initialize the user and house balances.
    public fun fund_addresses(scenario: &mut Scenario, house: address, player: address, house_funds: u64, player_funds: u64) {
        let ctx = scenario.ctx();
        // Send coins to players.
        let coinA = coin::mint_for_testing<SUI>(house_funds, ctx);
        let coinB = coin::mint_for_testing<SUI>(player_funds, ctx);
        transfer::public_transfer(coinA, house);
        transfer::public_transfer(coinB, player);
    }

    public fun get_initial_house_balance(): u64 {
        INITIAL_HOUSE_BALANCE
    }

    /// House ends the game.
    /// Variable valid_sig is used to test expected failures.
    public fun end_game(scenario: &mut Scenario, game_id: ID, house: address, num_balls: u64) {
        scenario.next_tx(SYSTEM_OBJECT);
        {
            let mut house_data = scenario.take_shared<HouseData>();

            sui::random::create_for_testing(scenario.ctx());
            scenario.next_tx(SYSTEM_OBJECT);
            let random = scenario.take_shared<Random>();
            scenario.next_tx(house);
            plk::finish_game(game_id, &random, &mut house_data, num_balls, scenario.ctx());

            test_scenario::return_shared(random);
            test_scenario::return_shared(house_data);
        };
    }
}
