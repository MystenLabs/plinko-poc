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
  9.0, 8.2, 6.5, 3.8, 1.0, 0.6, 0.4, 0.6, 1.0, 3.8, 6.5, 8.2, 9.0,
];

const ScoreTable = () => {
  const isScrollNeeded = true;
  const { colors, addTotalWon } = useGameHistory();
  const { betSize } = usePlayContext();
  const [dynamicMockData, setDynamicMockData] = useState([]);

  useEffect(() => {
    setDynamicMockData([]);
    let data: any = [];
    // Only append new data if colors array is not empty
    if (colors.length > 0) {
      const newEntries = colors.map((color) => {
        const position = bucketColors.indexOf(color);
        const multiplier = multipliersNumbers[position];
        const earnings = `${betSize * multiplier} SUI`;
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
      //@ts-ignore
      data = (prevData) => {
        // Reverse the array to maintain the newest entry at the top if needed
        return [...newEntries.reverse(), ...prevData];
      };

      setDynamicMockData(data);
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
          {dynamicMockData.map((data, index) => (
            <div
              key={index}
              className="text-white text-base font-normal leading-[18.40px]"
            >
              {
                //@ts-ignore
                data.bet
              }
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5 mr-10">
          {" "}
          {/* Adjust the right margin here */}
          {dynamicMockData.map((data, index) => (
            <div
              key={index}
              className={`text-white ${
                //@ts-ignore
                data.multiplier === "-"
                  ? "text-opacity-40"
                  : "text-base font-semibold"
              } leading-[18.40px]`}
            >
              {
                //@ts-ignore
                data.multiplier
              }
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5 ml-4">
          {dynamicMockData.map((data, index) => (
            <div
              key={index}
              className={`${
                //@ts-ignore
                data.earnings.startsWith("-")
                  ? "text-orange-600"
                  : //@ts-ignore
                  data.earnings === "-"
                  ? "text-opacity-40"
                  : "text-emerald-400"
              } text-base font-semibold leading-[18.40px] ${
                //@ts-ignore
                data.isLost ? "text-red-500" : "text-green-500"
              }`}
            >
              {
                //@ts-ignore
                data.earningsValue
              }{" "}
              SUI
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;
