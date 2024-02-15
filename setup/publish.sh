#!/bin/bash

# check dependencies are available.
for i in jq curl sui; do
  if ! command -V ${i} 2>/dev/null; then
    echo "${i} is not installed"
    exit 1
  fi
done

NETWORK=http://localhost:3000
BACKEND_API=http://localhost:8080
FAUCET=https://localhost:3000/gas

MOVE_PACKAGE_PATH=../plinko

if [ $# -ne 0 ]; then
  if [ $1 = "testnet" ]; then
    NETWORK="https://rpc.testnet.sui.io:443"
    FAUCET="https://faucet.testnet.sui.io/gas"
    BACKEND_API="https://plinko-poc-api.vercel.app"
  fi
  if [ $1 = "devnet" ]; then
    NETWORK="https://rpc.devnet.sui.io:443"
    FAUCET="https://faucet.devnet.sui.io/gas"
    BACKEND_API="https://plinko-poc-api.vercel.app"
  fi
fi

echo "- Admin Address is: ${PLINKO_HOUSE_ADDRESS}"

import_address=$(sui keytool import "$PLINKO_HOUSE_ADDRESS" ed25519)

switch_res=$(sui client switch --address ${PLINKO_HOUSE_ADDRESS})

publish_res=$(sui client publish --gas-budget 2000000000 --json ${MOVE_PACKAGE_PATH})

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

suffix=""
if [ $# -eq 0 ]; then
  suffix=".localnet"
fi

cat >.env.local<<-API_ENV
SUI_NETWORK=$NETWORK
BACKEND_API=$BACKEND_API
PACKAGE_ADDRESS=$PACKAGE_ID
HOUSE_ADMIN_CAP=$HOUSE_CAP
PLINKO_HOUSE_ADDRESS=$PLINKO_HOUSE_ADDRESS
PLINKO_HOUSE_PRIVATE_KEY=$PLINKO_HOUSE_PRIVATE_KEY
API_ENV

cat >../api/.env.local<<-API_ENV
SUI_NETWORK=$NETWORK
BACKEND_API=$BACKEND_API
PORT=8080
TRUSTED_ORIGINS=["http://localhost:3000", "https://plinko-poc.vercel.app/admin"]
PACKAGE_ADDRESS=$PACKAGE_ID
PLINKO_HOUSE_ADDRESS=$PLINKO_HOUSE_ADDRESS
PLINKO_HOUSE_PRIVATE_KEY=$PLINKO_HOUSE_PRIVATE_KEY
API_ENV

cat >../app/.env$suffix<<-VITE_API_ENV
NEXT_PUBLIC_SUI_NETWORK=$NETWORK
NEXT_PUBLIC_PACKAGE_ADDRESS=$PACKAGE_ID
NEXT_PUBLIC_BACKEND_API=$BACKEND_API
NEXT_PUBLIC_USE_TOP_NAVBAR_IN_LARGE_SCREEN=1
# used for logging purposes inside the UI components
# on purpose not starting with NEXT_PUBLIC_ to avoid exposing it to the client side
# if !!process.env.IS_SERVER_SIDE => we are on the server side
# else => we are on the client side
IS_SERVER_SIDE=1
NEXT_PUBLIC_ENOKI_API_KEY=enoki_apikey_77f611f1f19ea68960734dc0085579dc
NEXT_PUBLIC_GOOGLE_CLIENT_ID=312094986673-jqjjob1oubf36jkfvnnv2qm68cpcgk31.apps.googleusercontent.com
VITE_API_ENV

echo "Contract Deployment finished!"