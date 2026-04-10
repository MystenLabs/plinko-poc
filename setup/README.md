# Setup

## Description

`publish.sh` is a shell script that deploys your smart contracts and populates `.env` files.

## Steps to follow

- Export your admin address by running: `export PLINKO_HOUSE_ADDRESS=your_house_address`.
- Export your admin Private Key by running: `export PLINKO_HOUSE_PRIVATE_KEY=your_house_secret_key_here`.
- After running `./publish.sh testnet`, `.env` files will be created in `setup/.env.local`, `app/.env`, and `api/.env.local`.

## Setting up House Data

To initialize the house data after deploying your smart contracts and populating `.env` files, you must run the `src/setupHouseData.ts` file. 

This script configures the necessary parameters like the `multiplier array` for the game, the `public key` of the house, the `house_cap` and the `initial house balance`.

### Steps to follow:

1. Make sure you have deployed your smart contracts and populated the `.env` files as per the previous instructions.

2. Navigate to the `setup/src` directory of your project.

3. Run the `setupHouseData.ts` script using the following command:

   ```bash
   ts-node setupHouseData.ts
