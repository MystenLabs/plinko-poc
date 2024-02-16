# Plinko Game Backend API

## Description

This is a backend API built with Express that exposes an endpoint (`GET /game/plinko/end`) to be called on every game run. The endpoint triggers the `finish_game` Move call function, which calculates the trace path for the ball(s) to follow in the Plinko game and determines the amount to be returned to the user based on their stake and the number of balls they have selected.

## `finish_game` Move Function Overview

The `finish_game` Move function of the `plinko.move` completes a game, calculating the outcome and transferring winnings. Here's a breakdown of its functionality:

- Ensure that the game exists.
- Retrieve and remove the game from HouseData, preparing for outcome calculation.
- Validate the BLS signature against the VRF input.
- Extend the beacon until it has enough data for all ball outcomes.
- Calculate the stake amount per ball.
- Calculate outcome for each ball based on the extended beacon.
- Process the payout to the player, return the game outcome and trace vector for the UI balls descend.

## Run the Server - Prerequisites
You must have the following prerequisites installed to successfully use the example:

 * Node installed locally
 * Sui Client CLI (installed when you install Sui)
 * Successful execution of the `./../setup/publish.sh` [initialization script](./../setup/README.md)
 
 ## Local Execution

Follow these steps to get started with the example:

 1. Navigate to the /api folder in the repo and run `npm install`
 2. Run `npm run dev` in this folder to start a local server. This uses the `.env.local` file to configure the server.

## Docker Support

If you want to start the api in docker container, run `docker run -it -p 8080:8080 plinko-api` in the /api folder.