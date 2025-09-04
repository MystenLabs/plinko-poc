"use client";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { usePlayContext } from "@/contexts/PlayContext";
import React, { useEffect, useState } from "react";
import { set } from "zod";

const bucketColors = [
  "#FF0000", // Red
  "#FF3000", // Reddish-Orange
  "#FF6000", // Orange-Red
  "#FF9000", // Dark Orange
  "#FFC000", // Light Orange
  "#FFD800", // Yellow-Orange
  "#FFFF00", // Yellow (central color)
  "#FFD800", // Yellow-Orange
  "#FFC000", // Light Orange
  "#FF9000", // Dark Orange
  "#FF6000", // Orange-Red
  "#FF3000", // Reddish-Orange
  "#FF0000", // Red
];

const multipliersNumbers = [
  10.0, 8.0, 4.3, 2.1, 1.0, 0.6, 0.4, 0.6, 1.0, 2.1, 4.3, 8.0, 10.0,
];

const ScoreTable = () => {
  const isScrollNeeded = true;
  const {
    colors,
    addTotalWon,
    currentGameHistory,
    setCurrentGameHistory,
    historyFromPreviousGames,
  } = useGameHistory();
  const { betSize } = usePlayContext();
  // const [currentGameHistory, setCurrentGameHistory] = useState([]);

  useEffect(() => {
    setCurrentGameHistory([]);
    let data: any = [];
    // Only append new data if colors array is not empty
    if (colors.length > 0) {
      const newEntries = colors.map((color) => {
        const position = bucketColors.indexOf(color);
        const multiplier = multipliersNumbers[position];
        const earnings = `${(betSize * multiplier).toFixed(2)} SUI`;
        const earningsValue = betSize * multiplier;
        const isLost = earningsValue < betSize;
        return {
          bet: `${betSize} SUI`,
          multiplier: `${multiplier}x`,
          earnings,
          earningsValue,
          isLost,
        };
      });

      data = (prevData: any) => {
        // Reverse the array to maintain the newest entry at the top if needed
        return [...newEntries.reverse(), ...prevData];
      };

      setCurrentGameHistory(data);
    }
  }, [colors]);

  return (
    <div
      className={`w-[280px] ${
        isScrollNeeded ? "h-[394px]" : "h-[229px]"
      } p-[15px] bg-emerald-600 bg-opacity-20 rounded-[10px] shadow border border-teal-400 flex flex-col justify-start items-start gap-[15px] overflow-hidden`}
    >
      <div className="flex justify-start items-start gap-5">
        <div className="text-white text-opacity-60 text-base font-medium leading-[18.40px]">
          Bet
        </div>
        <div className="flex-grow text-white text-opacity-60 text-base font-medium leading-[18.40px]">
          Multiplier
        </div>
        <div className="text-white text-opacity-60 text-base font-medium leading-[18.40px]">
          Earnings
        </div>
      </div>
      <div className="self-stretch h-px opacity-50 bg-white bg-opacity-20"></div>
      <div
        className={`flex ${
          isScrollNeeded ? "overflow-auto" : ""
        } flex-1 w-full`}
      >
        <div className="flex flex-col gap-5 mr-5">
          {currentGameHistory.map((data: any, index: any) => (
            <div
              key={index}
              className="text-white text-base font-normal leading-[18.40px]"
            >
              {data.bet}
            </div>
          ))}
          {historyFromPreviousGames.length > 1 &&
            [...historyFromPreviousGames] // Create a shallow copy to avoid mutating the original array
              .slice(1)
              .reverse() // Reverse the copied array(
              .map((data, index) =>
                data.map((data2: any, index2: any) => (
                  <div
                    key={index2 + 1}
                    className="text-white text-opacity-40 text-base font-normal leading-[18.40px]"
                  >
                    {data2.bet}
                  </div>
                ))
              )}
        </div>
        <div className="flex flex-col gap-5 mr-10">
          {" "}
          {/* Adjust the right margin here */}
          {currentGameHistory.map((data: any, index: any) => (
            <div
              key={index}
              className={`text-white ${
                data.multiplier === "-"
                  ? "text-opacity-40"
                  : "text-base font-semibold"
              } leading-[18.40px]`}
            >
              {data.multiplier}
            </div>
          ))}
          {historyFromPreviousGames.length > 1 &&
            [...historyFromPreviousGames] // Create a shallow copy to avoid mutating the original array
              .slice(1)
              .reverse() // Reverse the copied array(
              .map((data, index) =>
                data.map((data2: any, index2: any) => (
                  <div
                    key={index + 1}
                    className="text-white text-opacity-40 text-base font-normal leading-[18.40px]"
                  >
                    {data2.multiplier}
                  </div>
                ))
              )}
        </div>
        <div className="flex flex-col gap-5 ml-4">
          {currentGameHistory.map((data: any, index: any) => {
            // Round earningsValue to two decimal places
            data.earningsValue = (
              Math.round(data.earningsValue * 100) / 100
            ).toFixed(2);
            return (
              <div
                key={index}
                className={`${
                  data.earnings.startsWith("-")
                    ? "text-orange-600"
                    : data.earnings === "-"
                    ? "text-opacity-40"
                    : "text-emerald-400"
                } text-base font-semibold leading-[18.40px] ${
                  data.isLost ? "text-red-500" : "text-green-500"
                }`}
              >
                {(Math.round(data.earningsValue * 100) / 100).toFixed(2)} SUI
              </div>
            );
          })}
          {historyFromPreviousGames.length > 1 &&
            [...historyFromPreviousGames] // Create a shallow copy to avoid mutating the original array
              .slice(1)
              .reverse() // Reverse the copied array(
              .map((data, index) =>
                data.map((data2: any, index: any) => (
                  <div
                    key={index + 1}
                    className="text-white text-opacity-40 text-base font-normal leading-[18.40px]"
                  >
                    {data2.earnings}
                  </div>
                ))
              )}
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;
