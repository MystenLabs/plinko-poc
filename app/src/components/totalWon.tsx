// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { useWaitingToPlayContext } from "@/contexts/IsWaitingToPlay";
import { useIsMobile } from "@/hooks/useIsMobile";

export const TotalWon = () => {
  const { totalWon, currentGameHistory } = useGameHistory();
  const { isWaitingToPlay } = useWaitingToPlayContext();
  const { isMobile } = useIsMobile();
  // Extract the first earningsValue, if it exists
  const firstEarningsValue = currentGameHistory?.[0]?.earningsValue
    ? (Math.round(currentGameHistory[0].earningsValue * 100) / 100).toFixed(2)
    : "0.00"; // Fallback to "+0.00" if no earningsValue is available

  const isLost = currentGameHistory[0]?.isLost
    ? currentGameHistory[0].isLost
    : false;

  return (
    <div className="w-[205px] h-[41px] px-5 py-2.5 bg-emerald-400 rounded-full shadow flex justify-center items-center gap-2.5">
      <div className="text-black text-opacity-80 text-base font-medium leading-[18.40px] whitespace-nowrap">
        {isWaitingToPlay ? "Loading..." : "Round Earnings"}
      </div>
      {!isWaitingToPlay && (
        <div className="flex items-baseline text-black text-lg font-bold font-['Inter'] leading-tight relative">
          {" "}
          {/* Add relative here */}
          {totalWon !== -1 ? (
            <>
              {parseFloat(totalWon.toString()).toFixed(2)}
              {isMobile && firstEarningsValue != "0.00" && (
                <span
                  className={`text-sm font-normal ${
                    isLost ? "text-red-500" : "text-green-900"
                  } absolute -bottom-3 left-0`} // Positioning adjustment here
                >
                  +{firstEarningsValue}
                </span>
              )}
            </>
          ) : (
            "0.00"
          )}
        </div>
      )}
    </div>
  );
};
