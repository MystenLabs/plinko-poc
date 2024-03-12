"use client";
import React, { useState, useEffect } from "react";
import { usePlayContext } from "../contexts/PlayContext";
import { useCreateCounterObject } from "@/hooks/moveTransactionCalls.ts/useCreateCounterObject";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { useWaitingToPlayContext } from "@/contexts/IsWaitingToPlay";
import { number, set } from "zod";
import { Balance } from "./general/Balance";
import { useBalance } from "@/contexts/BalanceContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import Popup from "./PopUpPicker";

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
  const { isMobile } = useIsMobile();

  const [numberOfBalls, setNumberOfBalls] = useState(1);
  const [currentBet, setCurrentBet] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  // Handle changes from the Popup component
  const handlePopupSubmit = (newBetSize: string, newNumberOfBalls: string) => {
    setBetSize(parseFloat(newBetSize));
    setNumberOfBalls(parseInt(newNumberOfBalls, 10));
    setShowPopup(false);
  };

  useEffect(() => {
    const bet = parseFloat(betSize.toString()) || 0;
    const balls = parseInt(numberOfBalls.toString(), 10) || 0;
    // i want to keep only 2 decimal places and if the last was 9, i want to round it up
    let totalBet = bet * balls;
    totalBet = Math.round(totalBet * 100) / 100;
    setCurrentBet(totalBet);
  }, [betSize, numberOfBalls]);

  const handlePlayClick = async () => {
    if (isPlaying) return;
    //@ts-ignore
    if (currentBet >= balance.c[0] + 0.9) {
      setPopupInsufficientCoinBalanceIsVisible(true);
      return;
    }
    resetHistory();
    setWaitingToPlay(true);
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
    const value = e.target.value;

    // Regular expression to match up to 3 digits in total, allowing for 0 or 1 decimal places
    const isValidInput = /^(?:\d{1,3}|\d{0,2}\.\d)$/.test(value);

    if (isValidInput || value === "") {
      // Allows empty value for backspace functionality
      setBetSize(value);
    }
  };

  const handleNumberOfBallsChange = (e: any) => {
    const value = e.target.value;
    //Regular expression to match integers only from 1 to 100
    const isValidInput = /^(?:[1-9][0-9]?|100)$/.test(value);
    if (isValidInput || value === "") {
      setNumberOfBalls(value);
    }
  };

  return (
    <div className="w-[950px] max-w-full px-5 pt-5 pb-[25px] bg-emerald-950 rounded-[20px] mx-auto my-4 ">
      {showPopup && (
        <Popup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          onSubmit={handlePopupSubmit}
        />
      )}
      <div className="flex justify-center items-center gap-5">
        {/* Bid Amount (per ball) */}
        <div className="flex flex-col justify-center  gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Bid{" "}
            <span className="md:hidden">
              {" "}
              <br />{" "}
            </span>{" "}
            (Per Ball)
          </div>
          <div
            className={`flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] ${
              currentBet < 11
                ? "border border-white"
                : "border-2 border-rose-500"
            } border-opacity-25 gap-2.5`}
          >
            <input
              type="number"
              value={betSize}
              onChange={handleBetSizeChange}
              onFocus={() => {
                if (isMobile) setShowPopup(true);
                else handleInputFocus;
              }}
              step="0.1"
              className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
              placeholder="0"
            />
            <div className="text-white text-opacity-50 text-base font-normal leading-[18.40px]">
              <img src="/general/sui.svg" alt="plus" width={12} height={12} />
            </div>
          </div>
        </div>
        {/* Number of Balls */}
        <div className="flex flex-col justify-center gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Number{" "}
            <span className="md:hidden">
              {" "}
              <br />{" "}
            </span>{" "}
            of Balls
          </div>
          <div
            className={`flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] ${
              currentBet < 11
                ? "border border-white"
                : "border-2 border-rose-500"
            } border-opacity-25 gap-2.5`}
          >
            <input
              type="number"
              value={numberOfBalls}
              onChange={handleNumberOfBallsChange}
              onFocus={() => {
                if (isMobile) setShowPopup(true);
                else handleInputFocus;
              }}
              className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
              placeholder="0"
            />
          </div>
        </div>
        {/* Total Bid & Play Button */}
        <div className="flex flex-col justify-center  gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Total Bid:{" "}
            <span className="md:hidden">
              {" "}
              <br />{" "}
            </span>{" "}
            {currentBet.toFixed(1)} SUI
          </div>
          <button
            onClick={() => {
              if (!isPlaying && !isWaitingToPlay && currentBet <= 10) {
                handlePlayClick();
              }
            }}
            className={`h-11 px-8 py-2.5 bg-emerald-600 rounded-[999px] flex justify-center items-center gap-2 ${
              isPlaying || isWaitingToPlay || currentBet > 10
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            <div className="text-white text-base font-bold leading-[18.40px]">
              Play
            </div>
          </button>
        </div>
      </div>
      {currentBet > 10 && (
        <div className="text-rose-500 text-sm font-medium text-center mt-4">
          *Total bid needs to be under 10 SUI
        </div>
      )}
    </div>
  );
};

export default PlinkoSettings;
