# Plinko Game on Sui Blockchain
This project showcases a Plinko game implementation on the Sui blockchain. You can explore the game mechanics and interact with the smart contracts in our development environment.

## About the Plinko Game
Plinko, inspired by the popular game show, is a game of chance where balls are dropped from the top of a pegged board, and the outcome is determined by the path they take. Our Sui blockchain implementation offers a unique twist by integrating cryptographic techniques to ensure fairness and transparency.

### Game Mechanics
The Plinko game consists of 3 Sui Modules:

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

## Prerequisites
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
