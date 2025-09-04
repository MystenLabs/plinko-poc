"use client";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { usePlayContext } from "@/contexts/PlayContext";
import React, { useEffect } from "react";

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
    setCurrentGameHistory,
    currentGameHistory,
    historyFromPreviousGames,
  } = useGameHistory();
  const { betSize } = usePlayContext();

  useEffect(() => {
    setCurrentGameHistory([]);
    if (colors.length > 0) {
      const newEntries = colors.map((color) => {
        const position = bucketColors.indexOf(color);
        const multiplier = multipliersNumbers[position];
        const earningsValue = betSize * multiplier;
        const earnings = `${earningsValue.toFixed(2)} SUI`;
        const isLost = earningsValue < betSize;
        return {
          bet: `${betSize} SUI`,
          multiplier: `${multiplier}x`,
          earnings,
          earningsValue,
          isLost,
        };
      });

      // prepend newest entries
      setCurrentGameHistory((prev) => [...newEntries.reverse(), ...prev]);
    }
  }, [colors, betSize, setCurrentGameHistory]);

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
        {/* Column: Bet */}
        <div className="flex flex-col gap-5 mr-5">
          {currentGameHistory.map((row: any, idx: number) => (
            <div
              key={`cur-bet-${idx}`}
              className="text-white text-base font-normal leading-[18.40px]"
            >
              {row.bet}
            </div>
          ))}

          {historyFromPreviousGames.length > 1 &&
            [...historyFromPreviousGames]
              .slice(1)
              .reverse()
              .map((game, gIdx) =>
                game.map((row: any, rIdx: number) => (
                  <div
                    key={`prev-bet-${gIdx}-${rIdx}`}
                    className="text-white text-opacity-40 text-base font-normal leading-[18.40px]"
                  >
                    {row.bet}
                  </div>
                ))
              )}
        </div>

        {/* Column: Multiplier */}
        <div className="flex flex-col gap-5 mr-10">
          {currentGameHistory.map((row: any, idx: number) => (
            <div
              key={`cur-mul-${idx}`}
              className={`text-white ${
                row.multiplier === "-"
                  ? "text-opacity-40"
                  : "text-base font-semibold"
              } leading-[18.40px]`}
            >
              {row.multiplier}
            </div>
          ))}

          {historyFromPreviousGames.length > 1 &&
            [...historyFromPreviousGames]
              .slice(1)
              .reverse()
              .map((game, gIdx) =>
                game.map((row: any, rIdx: number) => (
                  <div
                    key={`prev-mul-${gIdx}-${rIdx}`}
                    className="text-white text-opacity-40 text-base font-normal leading-[18.40px]"
                  >
                    {row.multiplier}
                  </div>
                ))
              )}
        </div>

        {/* Column: Earnings */}
        <div className="flex flex-col gap-5 ml-4">
          {currentGameHistory.map((row: any, idx: number) => {
            const rounded = Number(
              (Math.round(row.earningsValue * 100) / 100).toFixed(2)
            );
            return (
              <div
                key={`cur-earn-${idx}`}
                className={`${
                  row.earnings.startsWith("-")
                    ? "text-orange-600"
                    : row.earnings === "-"
                    ? "text-opacity-40"
                    : "text-emerald-400"
                } text-base font-semibold leading-[18.40px] ${
                  row.isLost ? "text-red-500" : "text-green-500"
                }`}
              >
                {rounded.toFixed(2)} SUI
              </div>
            );
          })}

          {historyFromPreviousGames.length > 1 &&
            [...historyFromPreviousGames]
              .slice(1)
              .reverse()
              .map((game, gIdx) =>
                game.map((row: any, rIdx: number) => (
                  <div
                    key={`prev-earn-${gIdx}-${rIdx}`}
                    className="text-white text-opacity-40 text-base font-normal leading-[18.40px]"
                  >
                    {row.earnings}
                  </div>
                ))
              )}
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;
