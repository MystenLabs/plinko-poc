"use client";
import React, { useState, useEffect } from "react";
import { usePlayContext } from "../contexts/PlayContext";
import { useCreateCounterObject } from "@/hooks/moveTransactionCalls.ts/useCreateCounterObject";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { useWaitingToPlayContext } from "@/contexts/IsWaitingToPlay";
import { number, set } from "zod";
import { Balance } from "./general/Balance";
import { useBalance } from "@/contexts/BalanceContext";

const PlinkoSettings = () => {
  //@ts-ignore
  const {
    isPlaying,
    setPlaying,
    betSize,
    setBetSize,
    setPopupInsufficientCoinBalanceIsVisible,
  } = usePlayContext();
  const { isWaitingToPlay, setWaitingToPlay } = useWaitingToPlayContext();
  const { handleCreateCounterObject } = useCreateCounterObject();
  const { resetHistory } = useGameHistory();
  const { balance } = useBalance();

  const [numberOfBalls, setNumberOfBalls] = useState(1);
  const [currentBet, setCurrentBet] = useState(0);

  useEffect(() => {
    const bet = parseFloat(betSize.toString()) || 0;
    const balls = parseInt(numberOfBalls.toString(), 10) || 0;
    setCurrentBet(bet * balls);
  }, [betSize, numberOfBalls]);

  const handlePlayClick = async () => {
    if (isPlaying) return;
    if (currentBet >= balance.toNumber() - 1) {
      setPopupInsufficientCoinBalanceIsVisible(true);
      return;
    }
    resetHistory();
    setWaitingToPlay(true);
    console.log("Play Clicked", isPlaying);
    console.log(currentBet);
    let currentBetSize = currentBet;
    //@ts-ignore
    let result_create_obj = await handleCreateCounterObject(
      currentBetSize,
      numberOfBalls
    );
    setWaitingToPlay(false);
    setPlaying(true);
  };
  // Function to handle focusing on the input - selects the text
  const handleInputFocus = (event: any) => {
    event.target.select();
  };

  const handleBetSizeChange = (e: any) => {
    const newBetSize = Math.max(1, Number(e.target.value));
    setBetSize(newBetSize);
  };

  const handleNumberOfBallsChange = (e: any) => {
    const newNumberOfBalls = Math.max(1, Number(e.target.value));
    setNumberOfBalls(newNumberOfBalls);
  };

  return (
    <div className="w-[950px] max-w-full px-5 pt-5 pb-[25px] bg-emerald-950 rounded-[20px] mx-auto my-4 flex justify-start items-end gap-5">
      {/* Bid Amount (per ball) */}
      <div className="flex flex-col justify-start items-start gap-2.5">
        <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px]">
          Bid Amount (per ball)
        </div>
        <div
          className={`flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] ${
            currentBet < 11 ? "border border-white" : "border-2 border-rose-500"
          } border-opacity-25 gap-2.5`}
        >
          <input
            type="number"
            value={betSize}
            onChange={handleBetSizeChange}
            onFocus={handleInputFocus} // Add this line
            className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
            placeholder="0"
          />
          <div className="text-white text-opacity-50 text-base font-normal leading-[18.40px]">
            SUI
          </div>
        </div>
      </div>

      {/* Number of Balls */}
      <div className="flex flex-col justify-start items-start gap-2.5 lg:mr-20">
        <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px]">
          Number of Balls
        </div>
        {/* <div className="flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] border border-white border-opacity-25 gap-2.5"> */}
        <div
          className={`flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] ${
            currentBet < 11 ? "border border-white" : "border-2 border-rose-500"
          } border-opacity-25 gap-2.5`}
        >
          <input
            type="number"
            value={numberOfBalls}
            onChange={handleNumberOfBallsChange}
            onFocus={handleInputFocus} // Add this line
            className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
            placeholder="0"
          />
        </div>
      </div>

      {/* Total Bid & Play Button */}
      <div className="flex flex-col justify-start items-start gap-2.5">
        <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px]">
          Total Bid: {currentBet} SUI{" "}
          {/* Adjust the hardcoded value as per your dynamic data */}
        </div>
        <button
          onClick={() => {
            handlePlayClick();
          }}
          className={`h-11 px-8 py-2.5 bg-emerald-600 rounded-[999px] flex justify-center items-center gap-2 ${
            isPlaying || isWaitingToPlay || currentBet > 10
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          <div className="text-white text-base font-bold leading-[18.40px]">
            {isPlaying || isWaitingToPlay ? "Playing..." : "Play"}
          </div>
        </button>
      </div>
    </div>
  );
};

export default PlinkoSettings;
