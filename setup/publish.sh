#!/bin/bash

# check dependencies are available.
for i in jq curl sui; do
  if ! command -V ${i} 2>/dev/null; then
    echo "${i} is not installed"
    exit 1
  fi
done

NETWORK=http://localhost:9000
BACKEND_API=http://localhost:3000
FAUCET=https://localhost:9000/gas

MOVE_PACKAGE_PATH=../plinko

if [ $# -ne 0 ]; then
  if [ $1 = "testnet" ]; then
    NETWORK="https://rpc.testnet.sui.io:443"
    FAUCET="https://faucet.testnet.sui.io/gas"
    BACKEND_API="https://api-testnet.suifrens.sui.io"
  fi
  if [ $1 = "devnet" ]; then
    NETWORK="https://rpc.devnet.sui.io:443"
    FAUCET="https://faucet.devnet.sui.io/gas"
    BACKEND_API="https://api-devnet.suifrens.sui.io"
  fi
fi

echo "- Admin Address is: ${PLINKO_HOME_ADDRESS}"

import_address=$(sui keytool import "$PLINKO_HOME_ADDRESS" ed25519)

switch_res=$(sui client switch --address ${PLINKO_HOME_ADDRESS})

#faucet_res=$(curl --location --request POST "$FAUCET" --header 'Content-Type: application/json' --data-raw '{"FixedAmountRequest": { "recipient": '$PLINKO_HOUSE_ADDRESS'}}')

publish_res=$(sui client publish --skip-fetch-latest-git-deps --gas-budget 2000000000 --json ${MOVE_PACKAGE_PATH})

echo ${publish_res} >.publish.res.json

# Check if the command succeeded (exit status 0)
if [[ "$publish_res" =~ "error" ]]; then
  # If yes, print the error message and exit the script
  echo "Error during move contract publishing.  Details : $publish_res"
  exit 1
fi

publishedObjs=$(echo "$publish_res" | jq -r '.objectChanges[] | select(.type == "published")')

PACKAGE_ID=$(echo "$publishedObjs" | jq -r '.packageId')

newObjs=$(echo "$publish_res" | jq -r '.objectChanges[] | select(.type == "created")')

HOUSE_CAP=$(echo "$newObjs" | jq -r 'select (.objectType | contains("house_data::HouseCap")).objectId')

# PUBLISHER_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("package::Publisher")).objectId')


suffix=""
if [ $# -eq 0 ]; then
  suffix=".localnet"
fi

cat >.env.local<<-API_ENV
SUI_NETWORK=$NETWORK
BACKEND_API=$BACKEND_API
PACKAGE_ADDRESS=$PACKAGE_ID
HOUSE_ADMIN_CAP=$HOUSE_CAP
PLINKO_HOUSE_ADDRESS=$PLINKO_HOME_ADDRESS
PLINKO_HOUSE_PRIVATE_KEY=$PLINKO_HOME_PRIVATE_KEY
API_ENV

cat >../app/.env$suffix<<-VITE_API_ENV
NEXT_PUBLIC_SUI_NETWORK=$NETWORK
NEXT_PUBLIC_PACKAGE=$PACKAGE_ID
NEXT_PUBLIC_BACKEND_API=$BACKEND_API
VITE_API_ENV

# commented out as the POC template does not have an api directory

# cat >../api/.env$suffix<<-BACKEND_API_ENV
# SUI_NETWORK=$NETWORK
# BACKEND_API=$BACKEND_API
# PACKAGE_ADDRESS=$PACKAGE_ID
# ADMIN_ADDRESS=$ADMIN_ADDRESS
# BACKEND_API_ENV

echo "Contract Deployment finished!"
