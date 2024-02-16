# Plinko Game on Sui Blockchain (Testnet)
This project showcases a Plinko game implementation on the Sui blockchain. You can explore the game mechanics and interact with the smart contracts in our development environment.

You can test the Plinko game on testnet. Log in with your preferred OAuth provider, verify that you have at least 2 Sui in your wallet (1 for the minimum bet and 1 Sui, a portion of which will be used for paying gas).

## About the Plinko Game
Plinko, inspired by the popular game show, is a game of chance where balls are dropped from the top of a pegged board, and the outcome is determined by the path they take. Our Sui blockchain implementation offers a unique experience by integrating cryptographic techniques to ensure fairness and transparency.

# Plinko Game Mechanics and Cryptography

## Overview
The Plinko game on Sui Blockchain incorporates advanced cryptographic techniques to ensure fairness and transparency. Players drop balls into a pegged board, where they randomly fall into slots representing different multipliers. 

## Game Mechanics
- **Starting a Game**: Players initiate a game by specifying the number of balls and staking a certain amount of SUI tokens. Each ball's path through the pegged board determines the final multiplier affecting the player's stake.
- **Finishing a Game**: Upon completion, the game calculates the total payout based on the paths of all balls and multipliers they hit. The smart contract then transfers the winnings back to the player's account.

## Cryptographic Features
### Verifiable Random Function (VRF)
- **Purpose**: Ensures that the path each ball takes is provably random and tamper-proof.
- **Implementation**: Utilizes the BLS signature scheme. The game's outcome is based on the hash of a unique input, which includes the BLS signature, an incrementing counter and the number of balls the user has selected.

### Signature Verification
- **Mechanism**: The game verifies the authenticity and integrity of the VRF input using the house's public key. This step ensures that the randomness source is legitimate and unaltered.
- **Process**: The `bls12381_min_pk_verify` function checks the BLS signature against the house's public key and the VRF input. If the verification fails, the game aborts with `EInvalidBlsSig` to prevent manipulation.

## Calculating Trace Paths
The trace path of each ball is determined by extending the beacon generated from the BLS signature. The extended beacon provides a sufficient random byte sequence to calculate the path for each ball.

- **Extended Beacon Generation**: For each ball, the game generates a unique hash input by concatenating the BLS signature with a counter. The hash of this input is added to the extended beacon, ensuring a large enough sequence for all balls.
- **Path Calculation**: The game iterates through the extended beacon, using 12 bytes for each ball to determine its path based on the pegs it encounters. Each byte influences the ball's direction, simulating the physical behavior of a Plinko board.

## Multiplier Calculation
- **Dynamic Multipliers**: The game uses a predefined array of multipliers corresponding to the slots at the bottom of the Plinko board.
- **Outcome Determination**: The final position of each ball, derived from its trace path, maps to a specific multiplier. The total payout is the cumulative result of applying these multipliers to the player's stake.

## Security and Fairness
- **Immutable Smart Contracts**: The game logic is deployed as immutable smart contracts on the Sui Blockchain, ensuring transparency and tamper-resistance.
- **Public Verification**: All transactions, including game starts, outcomes, and payouts, are recorded on the blockchain. This allows anyone to verify the fairness and randomness of each game.

The Plinko game consists of 3 Sui Move Modules:

- **Counter NFT:** A non-transferable NFT that acts as a unique input for each Plinko round, ensuring randomness and fairness.
- **House Data:** Manages the game's configuration, including stakes, fees, and game restrictions.
- **Plinko Game Contract:** Orchestrates the gameplay, handling the start and finish of each game round, stake management, and outcome determination.

### Smart Contract Flow
- The `counter_nft` module creates a unique Counter NFT for each game round.
- The `house_data` module sets up the game's parameters and manages the house's treasury.
- The `plinko` module handles the gameplay, including starting a game, calculating outcomes, and distributing rewards.

## Project Structure
The project is structured into three main directories:

- `app/`: Contains the front-end code of the Plinko game.
- `api/`: Houses the backend server code that interacts with the Sui blockchain.
- `plinko/`: Includes the smart contracts written in Sui Move for the Plinko game.

## Prerequisites for testing Plinko locally on your machine with Testnet | Devnet Deployment
To get started with the Plinko game, you need:

- A Sui address with SUI coins.
- Sui Client CLI configured to connect to the Sui Testnet.
- A Sui-compatible wallet (like Sui Wallet).
- npm and Node.js installed on your machine.

## Using the Plinko Game
Follow these steps to set up and interact locally with the Plinko game:

### Testnet | Devnet Deployment
1. Switch to the desired environment with `sui client switch --env testnet|devnet`.
2. Ensure your active Sui address has sufficient SUI coins.
3. Export your admin address by running: `export PLINKO_HOUSE_ADDRESS=your_house_address`.
4. Export your admin Private Key by running: `export PLINKO_HOUSE_PRIVATE_KEY=your_house_secret_key_here`.
5. Move to the `setup/` directory and follow the detailed instructions from the README file 
6. Deploy the contract and setup the enviro with `./publish testnet | devnet`.

The `publish` script deploys the contract and initializes the game environment. For more details, refer to the `publish` README.

### API Setup
1. Move to the `api/` directory and run `npm install`.
2. Start the server locally with `npm run dev`. It will run at `localhost:8080`.
3. You can follow the api/README.md file for more information
   
### UI Interaction
1. Navigate to the `app/` directory.
2. Run `npm install`, followed by `npm run dev` for local testing.
3. Access the UI at `localhost:3000` and enjoy the Plinko game.
4. You can follow the app/README.md file for more information

## Fairness and Transparency
Our Plinko game leverages the Sui blockchain's capabilities to ensure a fair and transparent gaming experience. All transactions and outcomes are verifiable on the chain, upholding the integrity of the game.

---

This project is powered by Mysten Labs and the Sui blockchain technology.
