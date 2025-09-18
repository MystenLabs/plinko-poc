// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { useState, useEffect } from "react";
import { usePlayContext } from "../contexts/PlayContext";
import { useCreateGame } from "@/hooks/moveTransactionCalls.ts/useCreateGame";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { useWaitingToPlayContext } from "@/contexts/IsWaitingToPlay";
import { useBalance } from "@/contexts/BalanceContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import Popup from "@/components/PopUpPicker";
import { MIST_PER_SUI } from "@mysten/sui/utils";

const MIN_BET_MIST = Number(process.env.NEXT_PUBLIC_MIN_BET_AMOUNT ?? "0"); // total bid minimum (in MIST)
const MAX_BET_MIST = Number(process.env.NEXT_PUBLIC_MAX_BET_AMOUNT ?? "0"); // total bid maximum (in MIST)
const MIST_PER_SUI_NUM = Number(MIST_PER_SUI || 1_000_000_000);

const PlinkoSettings = () => {
  const { isPlaying, setPlaying, betSize, setBetSize, showError } =
    usePlayContext();
  const { isWaitingToPlay, setWaitingToPlay } = useWaitingToPlayContext();
  const { handleCreateGame } = useCreateGame();
  const { resetHistory } = useGameHistory();
  const { balance } = useBalance();
  const { isMobile } = useIsMobile();

  const [numberOfBalls, setNumberOfBalls] = useState(1);
  const [currentBet, setCurrentBet] = useState(0); // total bid (SUI)
  const [showPopup, setShowPopup] = useState(false);
  const [allowShowPopup, setAllowShowPopup] = useState(true);

  useEffect(() => {
    const perBall = Number(betSize) || 0;
    const balls = Number(numberOfBalls) || 0;
    // total bet in SUI (keep 2dp)
    let total = perBall * balls;
    total = Math.round(total * 100) / 100;
    setCurrentBet(total);
  }, [betSize, numberOfBalls]);

  const handlePlayClick = async () => {
    if (isPlaying) return;

    const totalSui = Number(currentBet) || 0;
    const totalMist = Math.floor(totalSui * MIST_PER_SUI_NUM);

    if (!Number.isFinite(Number(betSize)) || Number(betSize) <= 0) {
      showError({
        title: "Invalid bet amount",
        message: "Please enter a valid per-ball bet amount greater than 0.",
      });
      return;
    }

    if (totalMist < MIN_BET_MIST) {
      const minSui = MIN_BET_MIST / MIST_PER_SUI_NUM;
      showError({
        title: "Total bid too low",
        message: `Your total bid (${totalSui.toFixed(
          2
        )} SUI) is below the minimum allowed (${minSui} SUI). Please increase your bet or number of balls.`,
      });
      return;
    }

    if (totalMist > MAX_BET_MIST) {
      const maxSui = MAX_BET_MIST / MIST_PER_SUI_NUM;
      showError({
        title: "Total bid too high",
        message: `Your total bid (${totalSui.toFixed(
          2
        )} SUI) exceeds the maximum allowed (${maxSui} SUI). Please lower your bet or number of balls.`,
      });
      return;
    }

    // Balance check (approx) TODO:Fix after coin merging is investigated
    const balanceSuiApprox = Number(balance?.c?.[0] ?? 0);
    if (totalSui > balanceSuiApprox) {
      showError({
        title: "Insufficient balance",
        message:
          "Not enough balance. Send SUI to your address or use the Request SUI button in the header.",
      });
      return;
    }
    resetHistory();
    setWaitingToPlay(true);
    try {
      await handleCreateGame(totalSui, numberOfBalls);
      setPlaying(true);
    } finally {
      setWaitingToPlay(false);
    }
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleBetSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Up to 3 digits total, allowing exactly one decimal place if present
    const isValidInput = /^(?:\d{1,3}|\d{0,2}\.\d)$/.test(value);
    if (isValidInput || value === "") {
      setBetSize(value === "" ? 0 : parseFloat(value));
    }
  };

  const handleNumberOfBallsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Integers 1–100
    const isValidInput = /^(?:[1-9][0-9]?|100)$/.test(value);
    if (isValidInput || value === "") {
      setNumberOfBalls(value === "" ? 0 : parseInt(value, 10));
    }
  };

  return (
    <div className="w-[950px] max-w-full px-5 pt-5 pb-[25px] bg-emerald-950 rounded-[20px] mx-auto my-4 ">
      <Popup
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          setAllowShowPopup(false);
          setTimeout(() => setAllowShowPopup(true), 300);
        }}
        onSubmit={(bet, balls) => {
          setBetSize(parseFloat(bet));
          setNumberOfBalls(parseInt(balls, 10));
          setShowPopup(false);
          setAllowShowPopup(false);
          setTimeout(() => setAllowShowPopup(true), 300);
        }}
      />

      <div className="flex justify-center items-center gap-5">
        {/* Bid Amount (per ball) */}
        <div className="flex flex-col justify-center gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Bid{" "}
            <span className="md:hidden">
              <br />
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
              onFocus={(event) => {
                if (isMobile) {
                  event.currentTarget.blur();
                  if (allowShowPopup) setShowPopup(true);
                } else {
                  handleInputFocus(event);
                }
              }}
              step="0.1"
              className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
              placeholder="0"
            />
            <div className="text-white text-opacity-50 text-base font-normal leading-[18.40px]">
              <img src="/general/sui.svg" alt="sui" width={12} height={12} />
            </div>
          </div>
        </div>

        {/* Number of Balls */}
        <div className="flex flex-col justify-center gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Number{" "}
            <span className="md:hidden">
              <br />
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
              onFocus={(event) => {
                if (isMobile) {
                  event.currentTarget.blur();
                  if (allowShowPopup) setShowPopup(true);
                } else {
                  handleInputFocus(event);
                }
              }}
              className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* Total Bid & Play Button */}
        <div className="flex flex-col justify-center gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Total Bid:{" "}
            <span className="md:hidden">
              <br />
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
