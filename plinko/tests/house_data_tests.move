// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module plinko::house_data_tests;
use plinko::house_data::{Self as hd, HouseData, HouseCap};
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::test_scenario::{Self, Scenario};

const HOUSE: address = @0xCAFE;
const PLAYER: address = @0x1234;

const INITIAL_HOUSE_BALANCE: u64 = 5_000_000_000; // 1 SUI

const MULTIPLIER_ARRAY: vector<u64> = vector<u64>[
    900,
    820,
    650,
    380,
    100,
    60,
    40,
    60,
    100,
    380,
    650,
    820,
    900,
];
const UPDATED_MULTIPLIER_ARRAY: vector<u64> = vector<u64>[
    90,
    82,
    65,
    38,
    10,
    6,
    4,
    6,
    10,
    38,
    65,
    82,
    90,
];

// Initialize the house data
public fun init_house(scenario: &mut Scenario, house: address) {
    scenario.next_tx(house);
    {
        let ctx = scenario.ctx();
        hd::init_for_testing(ctx);
    };
    scenario.next_tx(house);
    {
        let house_cap = scenario.take_from_sender<HouseCap>();
        let house_coins = scenario.take_from_sender<Coin<SUI>>();
        let ctx = scenario.ctx();

        house_cap.initialize_house_data(house_coins, MULTIPLIER_ARRAY, ctx);
    };
}

/// Used to initialize the user and house balances.
public fun fund_house_address(scenario: &mut Scenario, house: address, house_funds: u64) {
    let ctx = scenario.ctx();
    let coinA = coin::mint_for_testing<SUI>(house_funds, ctx);
    transfer::public_transfer(coinA, house);
}

#[test]
fun update_multiplier_vector() {
    let mut scenario = test_scenario::begin(HOUSE);
    {
        fund_house_address(&mut scenario, HOUSE, INITIAL_HOUSE_BALANCE);
    };
    // Call init function, transfer HouseCap to the house.
    // House initializes the contract with PK.
    init_house(&mut scenario, HOUSE);

    // House updates multiplier vector
    scenario.next_tx(HOUSE);
    {
        let mut house_data = scenario.take_shared<HouseData>();
        house_data.update_multiplier_vector(UPDATED_MULTIPLIER_ARRAY, scenario.ctx());
        test_scenario::return_shared(house_data);
    };

    scenario.end();
}

#[test]
fun top_up() {
    let mut scenario = test_scenario::begin(HOUSE);
    {
        fund_house_address(&mut scenario, HOUSE, INITIAL_HOUSE_BALANCE);
    };

    // Call init function, transfer HouseCap to the house.
    // House initializes the contract with PK.
    init_house(&mut scenario, HOUSE);

    // House tops up the contract
    scenario.next_tx(HOUSE);
    {
        let mut house_data = scenario.take_shared<HouseData>();
        let ctx = scenario.ctx();
        let coin_top_up = coin::mint_for_testing<SUI>(5000000000, ctx);
        house_data.top_up(coin_top_up, ctx);
        test_scenario::return_shared(house_data);
    };
    scenario.end();
}

#[test]
fun withdraw() {
    let mut scenario = test_scenario::begin(HOUSE);
    {
        fund_house_address(&mut scenario, HOUSE, INITIAL_HOUSE_BALANCE);
    };

    // Call init function, transfer HouseCap to the house.
    // House initializes the contract with PK.
    init_house(&mut scenario, HOUSE);

    // House withdraws from the contract
    scenario.next_tx(HOUSE);
    {
        let mut house_data = scenario.take_shared<HouseData>();
        let ctx = scenario.ctx();
        house_data.withdraw(ctx);
        test_scenario::return_shared(house_data);
    };
    scenario.end();
}

#[test, expected_failure(abort_code = hd::ECallerNotHouse)]
fun invalid_withdraw() {
    let mut scenario = test_scenario::begin(HOUSE);
    {
        fund_house_address(&mut scenario, HOUSE, INITIAL_HOUSE_BALANCE);
    };

    // Call init function, transfer HouseCap to the house.
    // House initializes the contract with PK.
    init_house(&mut scenario, HOUSE);

    // A player tries to withdraw from the contract
    scenario.next_tx(PLAYER);

    let mut house_data = scenario.take_shared<HouseData>();
    let ctx = scenario.ctx();
    house_data.withdraw(ctx);
    abort
}

#[test]
fun claim_fees() {
    let mut scenario = test_scenario::begin(HOUSE);
    {
        fund_house_address(&mut scenario, HOUSE, INITIAL_HOUSE_BALANCE);
    };

    // Call init function, transfer HouseCap to the house.
    // House initializes the contract with PK.
    init_house(&mut scenario, HOUSE);

    // House claims fees from the contract
    scenario.next_tx(HOUSE);
    {
        let mut house_data = scenario.take_shared<HouseData>();
        let ctx = scenario.ctx();
        house_data.claim_fees(ctx);
        test_scenario::return_shared(house_data);
    };
    scenario.end();
}

#[test, expected_failure(abort_code = hd::ECallerNotHouse)]
fun invalid_claim_fees() {
    let mut scenario = test_scenario::begin(HOUSE);
    {
        fund_house_address(&mut scenario, HOUSE, INITIAL_HOUSE_BALANCE);
    };

    // Call init function, transfer HouseCap to the house.
    // House initializes the contract with PK.
    init_house(&mut scenario, HOUSE);

    // House claims fees from the contract
    scenario.next_tx(PLAYER);

    let mut house_data = scenario.take_shared<HouseData>();
    let ctx = scenario.ctx();
    house_data.claim_fees(ctx);
    abort
}

#[test]
fun update_min_stake() {
    let mut scenario = test_scenario::begin(HOUSE);
    {
        fund_house_address(&mut scenario, HOUSE, INITIAL_HOUSE_BALANCE);
    };

    // Call init function, transfer HouseCap to the house.
    // House initializes the contract with PK.
    init_house(&mut scenario, HOUSE);

    // House updates the minimum stake
    scenario.next_tx(HOUSE);
    {
        let mut house_data = scenario.take_shared<HouseData>();
        let ctx = scenario.ctx();
        house_data.update_min_stake(5000000000, ctx);
        test_scenario::return_shared(house_data);
    };
    scenario.end();
}

#[test]
fun update_max_stake() {
    let mut scenario = test_scenario::begin(HOUSE);
    {
        fund_house_address(&mut scenario, HOUSE, INITIAL_HOUSE_BALANCE);
    };

    // Call init function, transfer HouseCap to the house.
    // House initializes the contract with PK.
    init_house(&mut scenario, HOUSE);

    // House updates the minimum stake
    scenario.next_tx(HOUSE);
    {
        let mut house_data = scenario.take_shared<HouseData>();
        let ctx = scenario.ctx();
        house_data.update_max_stake(60000000000, ctx);
        test_scenario::return_shared(house_data);
    };
    scenario.end();
}
