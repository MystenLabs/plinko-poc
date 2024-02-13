"use client";
import { useGameHistory } from "@/contexts/GameHistoryContext";

export const TotalWon = () => {
  const { addColor, colors, addTotalWon, totalWon } = useGameHistory();

  return (
    <div className="w-[183px] h-[41px] px-5 py-2.5 bg-emerald-400 rounded-[40px] shadow justify-center items-center gap-2.5 inline-flex">
      <div className="text-neutral-900 text-base font-medium font-['Inter'] leading-[18.40px]">
        Total Earnings
      </div>
      <div className="text-neutral-900 text-lg font-bold font-['Inter'] leading-tight">
        {totalWon !== -1 ? parseFloat(totalWon.toString()).toFixed(2) : "0.00"}
      </div>
    </div>
  );
};
