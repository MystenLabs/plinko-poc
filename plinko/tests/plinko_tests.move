// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
#[test_only]

module plinko::plinko_tests;
use plinko::house_data::{Self as hd, HouseCap, HouseData};
use plinko::plinko as plk;
use sui::coin::{Self, Coin};
use sui::random::Random;
use sui::sui::SUI;
use sui::test_scenario::{Self, Scenario};
const HOUSE: address = @0x21ba535ffa74e261a6281a205398ac9400bbbac41b49bfa967882abdf86b1486;
const PLAYER: address = @0x4670405fc30d04de9946ad2d6ad822a2859af40a12a0a6ea4516a526884359cf;
const SYSTEM_OBJECT: address = @0x0;
const VALID_STAKE: u64 = 1_000_000_000; //1 SUI
const TOO_LOW: u64 = 100_000_000; // 0.1 SUI
const TOO_HIGH: u64 = 20_000_000_000; // 20 SUI
const INITIAL_HOUSE_BALANCE: u64 = 50000000000; // 50 SUI
const LOW_HOUSE_BALANCE: u64 = 10000000000; // 10 SUI
const INITIAL_PLAYER_BALANCE: u64 = 20_000_000_000; // 20 SUI
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

#[test]
fun player_valid_selections() {
    start_game(1, true, true);
}

#[test, expected_failure(abort_code = plk::EStakeTooLow)]
fun player_low_stake() {
    let mut scenario = test_scenario::begin(HOUSE);
    fund_addresses(&mut scenario, HOUSE, PLAYER, INITIAL_HOUSE_BALANCE, INITIAL_PLAYER_BALANCE);
    init_house(&mut scenario, HOUSE, true);
    try_start_only(&mut scenario, TOO_LOW);
    scenario.end();
}

#[test, expected_failure(abort_code = plk::EStakeTooHigh)]
fun player_high_stake() {
    let mut scenario = test_scenario::begin(HOUSE);
    fund_addresses(&mut scenario, HOUSE, PLAYER, INITIAL_HOUSE_BALANCE, INITIAL_PLAYER_BALANCE);
    init_house(&mut scenario, HOUSE, true);
    try_start_only(&mut scenario, TOO_HIGH);

    scenario.end();
}
#[test, expected_failure(abort_code = plk::EInsufficientHouseBalance)]
fun insuficient_house_balance() {
    let mut scenario = test_scenario::begin(HOUSE);

    // House has only 3 SUI, less than the 4 SUI minimum payout for a 10 SUI stake.
    let tiny_house_funds: u64 = 3_000_000_000; // 3 SUI
    let player_funds: u64 = 12_000_000_000; // 12 SUI, enough to stake 10 SUI

    fund_addresses(
        &mut scenario,
        HOUSE,
        PLAYER,
        tiny_house_funds,
        player_funds,
    );
    init_house(&mut scenario, HOUSE, true);

    // Stake exactly 10 SUI (max_stake)
    let game_id = begin_game_and_get_id(
        &mut scenario,
        10_000_000_000,
    );

    // With only 3 SUI in the house and a minimum payout of 4 SUI,
    // finish_game will abort with EInsufficientHouseBalance.
    end_game(&mut scenario, game_id, 1);

    scenario.end();
}
#[test, expected_failure(abort_code = plk::EGameDoesNotExist)]
fun invalid_game_id() {
    start_game(1, false, false);
}

//  --- Helper functions ---

/// Start a real game and return its ID.
fun begin_game_and_get_id(scenario: &mut Scenario, stake_amount: u64): ID {
    scenario.next_tx(HOUSE);
    let mut house_data = scenario.take_shared<HouseData>();

    // Player provides the stake
    scenario.next_tx(PLAYER);
    let mut player_coin = scenario.take_from_sender<Coin<SUI>>();
    let stake_coin = coin::split(&mut player_coin, stake_amount, scenario.ctx());
    transfer::public_transfer(player_coin, PLAYER);

    let game_id = plk::start_game(stake_coin, &mut house_data, scenario.ctx());

    scenario.next_tx(HOUSE);
    test_scenario::return_shared(house_data);

    game_id
}

/// Only attempt to start a game (used for stake-boundary tests).
fun try_start_only(scenario: &mut Scenario, stake_amount: u64) {
    scenario.next_tx(HOUSE);
    let mut house_data = scenario.take_shared<HouseData>();

    // Player provides the stake
    scenario.next_tx(PLAYER);
    let mut player_coin = scenario.take_from_sender<Coin<SUI>>();
    let stake_coin = coin::split(&mut player_coin, stake_amount, scenario.ctx());
    transfer::public_transfer(player_coin, PLAYER);

    let _ = plk::start_game(stake_coin, &mut house_data, scenario.ctx());

    scenario.next_tx(HOUSE);
    test_scenario::return_shared(house_data);
}

fun start_game(num_balls: u64, low_house_balance: bool, valid_game_id: bool) {
    let mut scenario = test_scenario::begin(HOUSE);
    let init_house_balance = if (low_house_balance) { LOW_HOUSE_BALANCE } else {
        INITIAL_HOUSE_BALANCE
    };
    fund_addresses(&mut scenario, HOUSE, PLAYER, init_house_balance, INITIAL_PLAYER_BALANCE);
    init_house(&mut scenario, HOUSE, true);

    let game_id: ID = if (valid_game_id) {
        begin_game_and_get_id(&mut scenario, VALID_STAKE)
    } else {
        let ctx = scenario.ctx();
        let tmp_uid = sui::object::new(ctx);
        let faulty = sui::object::uid_to_inner(&tmp_uid);
        sui::object::delete(tmp_uid);
        faulty
    };

    end_game(&mut scenario, game_id, num_balls);
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
public fun fund_addresses(
    scenario: &mut Scenario,
    house: address,
    player: address,
    house_funds: u64,
    player_funds: u64,
) {
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
public fun end_game(scenario: &mut Scenario, game_id: ID, num_balls: u64) {
    scenario.next_tx(SYSTEM_OBJECT);
    sui::random::create_for_testing(scenario.ctx());
    scenario.next_tx(SYSTEM_OBJECT);
    let random = scenario.take_shared<Random>();
    scenario.next_tx(HOUSE);
    let mut house_data = scenario.take_shared<HouseData>();
    plk::finish_game(game_id, &random, &mut house_data, num_balls, scenario.ctx());

    test_scenario::return_shared(house_data);
    scenario.next_tx(SYSTEM_OBJECT);
    test_scenario::return_shared(random);
}
