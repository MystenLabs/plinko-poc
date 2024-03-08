"use client";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { useWaitingToPlayContext } from "@/contexts/IsWaitingToPlay";

export const TotalWon = () => {
  const { totalWon, currentGameHistory } = useGameHistory();
  const { isWaitingToPlay } = useWaitingToPlayContext();
  // Extract the first earningsValue, if it exists
  const firstEarningsValue = currentGameHistory?.[0]?.earningsValue
    ? (Math.round(currentGameHistory[0].earningsValue * 100) / 100).toFixed(2)
    : "0.00"; // Fallback to "+0.00" if no earningsValue is available

  return (
    <div className="w-[205px] h-[41px] px-5 py-2.5 bg-emerald-400 rounded-full shadow flex justify-center items-center gap-2.5">
      <div className="text-black text-opacity-80 text-base font-medium leading-[18.40px] whitespace-nowrap">
        {isWaitingToPlay ? "Loading..." : "Round Earnings"}
      </div>
      {!isWaitingToPlay && (
        <div className="flex items-baseline text-black text-lg font-bold font-['Inter'] leading-tight">
          {totalWon !== -1 ? (
            <>
              {parseFloat(totalWon.toString()).toFixed(2)}
              <span className="text-sm font-normal">+{firstEarningsValue}</span>
            </>
          ) : (
            "0.00"
          )}
        </div>
      )}
    </div>
  );
};
