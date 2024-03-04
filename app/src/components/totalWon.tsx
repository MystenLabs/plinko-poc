"use client";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { useWaitingToPlayContext } from "@/contexts/IsWaitingToPlay";

export const TotalWon = () => {
  const { totalWon } = useGameHistory();
  const { isWaitingToPlay } = useWaitingToPlayContext();

  return (
    <div className="w-[183px] h-[41px] px-5 py-2.5 bg-emerald-400 rounded-full shadow flex justify-center items-center gap-2.5">
      <div className="text-black text-opacity-80 text-base font-medium leading-[18.40px] whitespace-nowrap">
        {isWaitingToPlay ? "Loading..." : "Round Earnings"}
      </div>
      {!isWaitingToPlay && (
        <div className="text-black text-lg font-bold font-['Inter'] leading-tight">
          {totalWon !== -1
            ? parseFloat(totalWon.toString()).toFixed(2)
            : "0.00"}
        </div>
      )}
    </div>
  );
};
