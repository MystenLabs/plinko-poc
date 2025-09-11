// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module plinko::house_data;
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::package;
use sui::sui::SUI;

// === Errors ===
const ECallerNotHouse: u64 = 0;
const EInsufficientBalance: u64 = 1;

// === Structs ===

/// Configuration and Treasury shared object, managed by the house.
public struct HouseData has key {
    id: UID,
    // House's balance which also contains the accrued winnings of the house.
    balance: Balance<SUI>,
    // Address of the house or the game operator.
    house: address,
    // Maximum stake amount a player can bet in a single game.
    max_stake: u64,
    // Minimum stake amount required to play the game.
    min_stake: u64,
    // The accrued fees from games played.
    fees: Balance<SUI>,
    // The default fee in basis points. 1 basis point = 0.01%.
    base_fee_in_bp: u16,
    // Multipliers used to calculate winnings based on the game outcome.
    multiplier: vector<u64>,
}

/// A one-time use capability to initialize the house data;
/// created and sent to sender in the initializer.
public struct HouseCap has key {
    id: UID,
}

/// Used as a one time witness to generate the publisher.
public struct HOUSE_DATA has drop {}

fun init(otw: HOUSE_DATA, ctx: &mut TxContext) {
    // Creating and sending the Publisher object to the sender.
    package::claim_and_keep(otw, ctx);

    // Creating and sending the HouseCap object to the sender.
    let house_cap = HouseCap {
        id: object::new(ctx),
    };

    transfer::transfer(house_cap, ctx.sender());
}

/// Initializer function that should only be called once and by the creator of the contract.
/// Initializes the house data object with the house's public key and an initial balance.
/// It also sets the max and min stake values, that can later on be updated.
/// Stores the house address and the base fee in basis points.
/// This object is involved in all games created by the same instance of this package.
public fun initialize_house_data(
    house_cap: HouseCap,
    coin: Coin<SUI>,
    multiplier: vector<u64>,
    ctx: &mut TxContext,
) {
    assert!(coin.value() > 0, EInsufficientBalance);

    let mut house_data = HouseData {
        id: object::new(ctx),
        balance: coin.into_balance(),
        house: ctx.sender(),
        max_stake: 10_000_000_000, // 10 SUI = 10^9.
        min_stake: 1_000_000_000, // 1 SUI.
        fees: balance::zero(),
        base_fee_in_bp: 100, // 1% in basis points.
        multiplier: vector[],
    };

    house_data.set_multiplier_vector(multiplier);

    let HouseCap { id } = house_cap;
    id.delete();

    transfer::share_object(house_data);
}

// === Public-Mutative Functions ===

public fun update_multiplier_vector(
    house_data: &mut HouseData,
    v: vector<u64>,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == house_data.house(), ECallerNotHouse);
    house_data.multiplier = vector[];
    house_data.set_multiplier_vector(v);
}

/// Function used to top up the house balance. Can be called by anyone.
/// House can have multiple accounts so giving the treasury balance is not limited.
public fun top_up(house_data: &mut HouseData, coin: Coin<SUI>, _: &mut TxContext) {
    coin::put(&mut house_data.balance, coin)
}

/// A function to withdraw the entire balance of the house object.
/// It can be called only by the house
public fun withdraw(house_data: &mut HouseData, ctx: &mut TxContext) {
    // Only the house address can withdraw funds.
    assert!(ctx.sender() == house_data.house(), ECallerNotHouse);

    let total_balance = house_data.balance();
    let coin = coin::take(&mut house_data.balance, total_balance, ctx);
    transfer::public_transfer(coin, house_data.house());
}

/// House can withdraw the accumulated fees of the house object.
public fun claim_fees(house_data: &mut HouseData, ctx: &mut TxContext) {
    // Only the house address can withdraw fee funds.
    assert!(ctx.sender() == house_data.house(), ECallerNotHouse);

    let total_fees = house_data.fees();
    let coin = coin::take(&mut house_data.fees, total_fees, ctx);
    transfer::public_transfer(coin, house_data.house());
}

/// House can update the max stake. This allows larger stake to be placed.
public fun update_max_stake(house_data: &mut HouseData, max_stake: u64, ctx: &mut TxContext) {
    // Only the house address can update the base fee.
    assert!(ctx.sender() == house_data.house(), ECallerNotHouse);

    house_data.max_stake = max_stake;
}

/// House can update the min stake. This allows smaller stake to be placed.
public fun update_min_stake(house_data: &mut HouseData, min_stake: u64, ctx: &mut TxContext) {
    // Only the house address can update the min stake.
    assert!(ctx.sender() == house_data.house(), ECallerNotHouse);

    house_data.min_stake = min_stake;
}

// === Public-View Functions ===

/// Returns the balance of the house.
public fun balance(house_data: &HouseData): u64 {
    house_data.balance.value()
}

/// Returns the address of the house.
public fun house(house_data: &HouseData): address {
    house_data.house
}

/// Returns the max stake of the house.
public fun max_stake(house_data: &HouseData): u64 {
    house_data.max_stake
}

/// Returns the min stake of the house.
public fun min_stake(house_data: &HouseData): u64 {
    house_data.min_stake
}

/// Returns the fees of the house.
public fun fees(house_data: &HouseData): u64 {
    house_data.fees.value()
}

/// Returns the base fee.
public fun base_fee_in_bp(house_data: &HouseData): u16 {
    house_data.base_fee_in_bp
}

/// Returns the multiplier vector
public fun multiplier(house_data: &HouseData): vector<u64> {
    house_data.multiplier
}

// === Public-Friend Functions ===

/// Returns a reference to the house id.
public(package) fun borrow(house_data: &HouseData): &UID {
    &house_data.id
}

/// Returns a mutable reference to the balance of the house.
public(package) fun borrow_balance_mut(house_data: &mut HouseData): &mut Balance<SUI> {
    &mut house_data.balance
}

/// Returns a mutable reference to the fees of the house.
public(package) fun borrow_fees_mut(house_data: &mut HouseData): &mut Balance<SUI> {
    &mut house_data.fees
}

/// Returns a mutable reference to the house id.
public(package) fun borrow_mut(house_data: &mut HouseData): &mut UID {
    &mut house_data.id
}

// === Private Functions ===

fun set_multiplier_vector(house_data: &mut HouseData, v: vector<u64>) {
    house_data.multiplier.append(v);
}

// === Test Functions ===

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(HOUSE_DATA {}, ctx);
}
