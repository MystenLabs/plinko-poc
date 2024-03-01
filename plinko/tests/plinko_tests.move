#[test_only]

module plinko::plinko_tests {

    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use std::debug::print;
    use sui::object::ID;
    use sui::bls12381::bls12381_min_pk_verify;
    use sui::test_scenario::{Self, Scenario};
    use plinko::house_data::{Self as hd,  HouseCap, HouseData};
    use plinko::counter_nft::{Self, Counter};
    use plinko::plinko::{Self as plk};

    const HOUSE: address = @0x21ba535ffa74e261a6281a205398ac9400bbbac41b49bfa967882abdf86b1486;
    const PLAYER: address = @0x4670405fc30d04de9946ad2d6ad822a2859af40a12a0a6ea4516a526884359cf;
    const INITIAL_HOUSE_BALANCE: u64 = 50000000000; // 50 SUI
    const LOW_HOUSE_BALANCE: u64 = 10000000000; // 10 SUI   
    const INITIAL_PLAYER_BALANCE: u64 = 20_000_000_000; // 20 SUI
   

    // House's public key.
    const PK: vector<u8> = vector<u8> [
        138, 151,  85,  75, 187, 115,  84, 101, 165,
        216,  98, 179,  20,  76, 234, 137, 195, 124,
        137, 232, 255, 144, 254,  58, 101, 172,  37,
        191,  55, 212,   5, 149,  73, 106, 173, 220,
        81, 173,  59,  52,  31,  57, 147, 190, 183,
        183,  59, 156
    ];

    const VRF_INPUT: vector<u8> = vector<u8> [
        117, 195, 54, 14, 177, 159, 210, 194, 15, 187, 165, 226, 218, 140, 241, 163,
        156, 219, 30, 233, 19, 175, 56, 2, 186, 51, 11, 133, 46, 69, 158, 5,
        0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0
    ];

    const MULTIPLIER_ARRAY: vector<u64> = vector<u64> [900, 820, 650, 380, 100, 60, 40, 60, 100, 380, 650, 820, 900];

    // Signed counter id 0x75c3360eb19fd2c20fbba5e2da8cf1a39cdb1ee913af3802ba330b852e459e05 + starting count = 0000000000000000 (represented as u64)
    // + number of balls = 1 with house's private key.
    const BLS_SIG: vector<u8> = vector<u8> [
        136, 210,  48,  88, 168,  60,  54,  19,  43, 187, 235, 193,
        7,  40, 240,  86, 136, 176,  74, 161,  15,  74,  46,  43,
        48, 244,  88, 159,  12, 246,  37, 130, 244, 252, 167,  23,
        249,  86, 151,  72,  25, 130,  51, 156,  98, 227, 227, 104,
        21,  41,  15, 180, 115,   3, 154, 131, 148, 244,  29,  70,
        138,  57, 129,  24, 239, 140,  56, 105, 233, 202, 231, 211,
        26,  53,  71,  88, 138,  89, 176, 212, 193, 165, 148,  19,
        178,  23, 104,   8, 110, 105,  18, 194,  38, 129, 248, 189
    ];

    const INVALID_BLS_SIG: vector<u8> = vector<u8> [
        136, 210,  48,  88, 168,  60,  54,  19,  43, 187, 235, 193,
        7,  40, 240,  86, 136, 176,  74, 161,  15,  74,  46,  43,
        48, 244,  88, 159,  12, 246,  37, 130, 244, 252, 167,  23,
        249,  86, 151,  72,  25, 130,  51, 156,  98, 227, 227, 104,
        21,  41,  15, 180, 115,   3, 154, 131, 148, 244,  29,  70,
        138,  57, 129,  24, 239, 140,  56, 105, 233, 202, 231, 211,
        26,  53,  71,  88, 138,  89, 176, 212, 193, 165, 148,  19,
        178,  23, 104,   8, 110, 105,  18, 194,  38, 129, 248, 188
    ];

    #[test]
    fun test_bls_signature() {
        let bls_sig = BLS_SIG;
        let house_public_key = PK;
        let vrf_input = VRF_INPUT;
        let is_sig_valid = bls12381_min_pk_verify(
            &bls_sig,
            &house_public_key,
            &vrf_input
        );
        assert!(is_sig_valid, 1);
    }

    #[test]
    fun player_valid_selections(){
        start_game(1000000000, 1, true, true, true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EStakeTooLow)]
    fun player_low_stake(){
        start_game(0, 1, false, true, true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EStakeTooHigh)]
    fun player_high_stake(){
        start_game(11000000000, 1, false, true, true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EInsufficientHouseBalance)]
    fun insuficient_house_balance(){
        start_game(10000000000, 1, true, true, true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EInvalidBlsSig)]
    fun invalid_bls_sig(){
        start_game(1000000000, 1, false, false, true);
    }

    #[test]
    #[expected_failure(abort_code = plk::EGameDoesNotExist)]
    fun invalid_game_id(){
        start_game(1000000000, 1, false, true, false);
    }

    //  --- Helper functions ---

    fun start_game(player_stake: u64, num_balls: u64, low_house_balance: bool, valid_bls_sig: bool, valid_game_id: bool){

        let scenario_val = test_scenario::begin(HOUSE);
        let scenario = &mut scenario_val;
        let init_house_balance : u64;
        let game_id : ID;
        {
            if(low_house_balance){
                init_house_balance = LOW_HOUSE_BALANCE;
            } else {
                init_house_balance = INITIAL_HOUSE_BALANCE;
            };
            fund_addresses(scenario, HOUSE, PLAYER, init_house_balance, INITIAL_PLAYER_BALANCE);
        };
        // Call init function, transfer HouseCap to the house.
        // House initializes the contract with PK.
        init_house(scenario, HOUSE, true);

        if (valid_game_id){
            game_id = create_counter_nft_and_start_game(scenario, PLAYER, player_stake, num_balls);
            print(&game_id);
        } else {
            let ctx = test_scenario::ctx(scenario);
            let temp_game_uid = sui::object::new(ctx); 
            game_id = sui::object::uid_to_inner(&temp_game_uid);
            sui::object::delete(temp_game_uid);
        };
        // print(&game_id);

        end_game(scenario, game_id, HOUSE, num_balls, valid_bls_sig);

        test_scenario::end(scenario_val);
    }

    /// Deployment & house object initialization.
    /// Variable valid_coin is used to test expected failures.
    public fun init_house(scenario: &mut Scenario, house: address, valid_coin: bool) {
        test_scenario::next_tx(scenario, house);
        {
            let ctx = test_scenario::ctx(scenario);
            hd::init_for_testing(ctx);
        };

        // House initializes the contract with PK.
        test_scenario::next_tx(scenario, HOUSE);
        {
            let house_cap = test_scenario::take_from_sender<HouseCap>(scenario);
            if (valid_coin) {
                let house_coin = test_scenario::take_from_sender<Coin<SUI>>(scenario);
                let ctx = test_scenario::ctx(scenario);
                hd::initialize_house_data(house_cap, house_coin, PK, MULTIPLIER_ARRAY, ctx);
            } else {
                let ctx = test_scenario::ctx(scenario);
                let zero_coin = coin::zero<SUI>(ctx);
                hd::initialize_house_data(house_cap, zero_coin, PK, MULTIPLIER_ARRAY, ctx);
            };
        };
    }

    /// Used to create a counter nft and a game for the player.
    /// Variables house_wins and valid_guess are used to test different outcomes and expected failures.
    public fun create_counter_nft_and_start_game(scenario: &mut Scenario, player: address, stake: u64, num_balls: u64): ID {
        // Player creates Counter NFT
        create_counter_nft(scenario, player);

        test_scenario::next_tx(scenario, player);
        let player_coin = test_scenario::take_from_sender<Coin<SUI>>(scenario);
        let player_counter = test_scenario::take_from_sender<Counter>(scenario);
        let house_data = test_scenario::take_shared<HouseData>(scenario);
        let ctx = test_scenario::ctx(scenario);
        let stake_coin = coin::split(&mut player_coin, stake, ctx);
        let game_id = plk::start_game(&mut player_counter, num_balls, stake_coin, &mut house_data, ctx);
        let game = plk::borrow_game(game_id, &house_data);
        let game_start_epoch: u64 = plk::game_start_epoch(game);
        let game_stake: u64 = plk::stake(game);
        let game_player: address = plk::player(game);
        let game_vrf_input: vector<u8> = plk::vrf_input(game);
        let game_gee_in_bp: u16 = plk::fee_in_bp(game);
        print(&game_start_epoch);
        print(&game_stake);
        print(&game_player);
        print(&game_vrf_input);
        print(&game_gee_in_bp);
        test_scenario::return_shared(house_data);
        test_scenario::return_to_sender(scenario, player_counter);
        test_scenario::return_to_sender(scenario, player_coin);
        game_id
    }

    /// Create a Counter NFT for the player.
    fun create_counter_nft(scenario: &mut Scenario, player: address) {
        test_scenario::next_tx(scenario, player);
        {
            let ctx = test_scenario::ctx(scenario);
            let counter = counter_nft::mint(ctx);
            // print(&counter);
            counter_nft::transfer_to_sender(counter, ctx);
        };
    }

    /// Used to initialize the user and house balances.
    public fun fund_addresses(scenario: &mut Scenario, house: address, player: address, house_funds: u64, player_funds: u64) {
        let ctx = test_scenario::ctx(scenario);
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
    public fun end_game(scenario: &mut Scenario, game_id: ID, house: address, num_balls: u64, valid_bls_sig: bool) {
        test_scenario::next_tx(scenario, house);
        {
            let house_data = test_scenario::take_shared<HouseData>(scenario);
            // print(&house_data);
            let ctx = test_scenario::ctx(scenario);
            let sig: vector<u8>;
            if (valid_bls_sig) {
                 sig = BLS_SIG; 
            } else {
                 sig = INVALID_BLS_SIG; 
            };
            plk::finish_game(game_id, sig, &mut house_data, num_balls, ctx);
            
            test_scenario::return_shared(house_data);
        };
    }
}