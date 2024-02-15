"use client";
import React, { useState, useEffect } from "react";
import { usePlayContext } from "../contexts/PlayContext";
import { useCreateCounterObject } from "@/hooks/moveTransactionCalls.ts/useCreateCounterObject";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import {
  IsWaitingToPlayProvider,
  useWaitingToPlayContext,
} from "@/contexts/IsWaitingToPlay";

import { set } from "zod";

const PlinkoSettings = () => {
  //@ts-ignore
  const { isPlaying, setPlaying, betSize, setBetSize } = usePlayContext();
  const { isWaitingToPlay, setWaitingToPlay } = useWaitingToPlayContext();
  const { handleCreateCounterObject } = useCreateCounterObject();
  const { resetHistory } = useGameHistory();

  // const [betSize, setBetSize] = useState(0.0);
  const [numberOfBalls, setNumberOfBalls] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [selectedRisk, setSelectedRisk] = useState("red");

  useEffect(() => {
    const bet = parseFloat(betSize.toString()) || 0;
    const balls = parseInt(numberOfBalls.toString(), 10) || 0;
    setCurrentBet(bet * balls);
  }, [betSize, numberOfBalls]);

  const handlePlayClick = async () => {
    if (isPlaying) return;
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
    console.log("Play Clicked", isPlaying);
    console.log(
      "Current Bet:",
      currentBet.toFixed(2),
      "Risk Color:",
      selectedRisk
    );
  };

  const adjustBetSize = (delta: any) => {
    //@ts-ignore
    setBetSize((prev) => Math.max(0, prev + delta));
  };

  const adjustNumberOfBalls = (delta: any) => {
    setNumberOfBalls((prev) => Math.max(0, prev + delta));
  };

  const handleBetSizeChange = (e: any) => {
    const value = parseFloat(e.target.value);
    setBetSize(isNaN(value) ? 0 : value);
  };

  const handleNumberOfBallsChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfBalls(isNaN(value) ? 0 : value);
  };

  const riskButtonClass = (riskColor: any) => {
    const baseClasses =
      "px-3 py-1 text-white rounded mx-1 transition-transform duration-300";
    const colorClasses = {
      green: "bg-green-500 hover:bg-green-700",
      yellow: "bg-yellow-500 hover:bg-yellow-700",
      red: "bg-red-500 hover:bg-red-700",
    };
    const selectedClass =
      selectedRisk === riskColor ? "transform scale-110" : "";
    //@ts-ignore
    return `${baseClasses} ${colorClasses[riskColor]} ${selectedClass}`;
  };

  return (
    <div className="w-[982px] max-w-full px-5 pt-5 pb-[25px] bg-emerald-950 rounded-[20px] mx-auto my-4 flex justify-start items-end gap-5">
      {/* Bid Amount (per ball) */}
      <div className="flex flex-col justify-start items-start gap-2.5">
        <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px]">
          Bid Amount (per ball)
        </div>
        <div className="flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] border border-white border-opacity-25 gap-2.5">
          <input
            type="number"
            value={betSize}
            onChange={handleBetSizeChange}
            className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
            placeholder="0"
          />
          <div className="text-white text-opacity-50 text-base font-normal leading-[18.40px]">
            SUI
          </div>
        </div>
      </div>

      {/* Number of Balls */}
      <div className="flex flex-col justify-start items-start gap-2.5">
        <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px]">
          Number of Balls
        </div>
        <div className="flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] border border-white border-opacity-25 gap-2.5">
          <input
            type="number"
            value={numberOfBalls}
            onChange={handleNumberOfBallsChange}
            className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
            placeholder="0"
          />
        </div>
      </div>

      {/* Number of Rows (New) */}
      <div className="flex flex-col justify-start items-start gap-2.5">
        <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px]">
          Number of Rows
        </div>
        <div className="flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] border border-white border-opacity-25 gap-2.5">
          <div className="text-white text-opacity-80 text-base font-normal leading-[18.40px]">
            12 {/* Adjust the hardcoded value as per your dynamic data */}
          </div>
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
          className={`h-11 px-6 py-2.5 bg-emerald-600 rounded-[999px] flex justify-center items-center gap-2 ${
            isPlaying || isWaitingToPlay ? "cursor-not-allowed opacity-50" : ""
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
