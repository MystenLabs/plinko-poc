// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useBalance } from "@/contexts/BalanceContext";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { usePlayContext } from "@/contexts/PlayContext";
import React, { useEffect, useState } from "react";

const EndGameCard = () => {
  const { handleRefreshBalance } = useBalance();
  const { totalWon, resetHistory } = useGameHistory();
  const {
    popupIsVisible,
    setPopupIsVisible,
    betSize: bid,
    txDigest,
    finalPaths,
    setFinalPaths,
  } = usePlayContext();

  const [showHistory, setShowHistory] = useState(false);

  const togglePopup = () => setPopupIsVisible(!popupIsVisible);
  const toggleHistory = () => setShowHistory((v) => !v);

  // Player won if net > 0
  const hasWon = totalWon - bid * finalPaths.length > 0;
  const suiExplorerUrl = `https://suiscan.xyz/testnet/tx/${txDigest}`;

  const handlePlayAgain = () => {
    setPopupIsVisible(false);
    setFinalPaths([[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]]);
    resetHistory();
    handleRefreshBalance();
  };

  return (
    <>
      {popupIsVisible && (
        <div
          className={`fixed inset-0 overflow-y-auto h-full w-full flex justify-center items-center z-20 ${
            hasWon ? "" : "bg-gray-600 bg-opacity-50"
          }`}
          onClick={togglePopup}
        >
          <div
            className="p-5 border bg-white rounded-3xl shadow-lg relative z-40"
            style={{ width: "80%", maxWidth: "600px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col justify-center items-center gap-10">
              <div className="flex flex-col justify-center items-center gap-1.5">
                {hasWon ? (
                  <>
                    <div className="w-[310px] opacity-90 text-center text-black text-2xl font-semibold">
                      Congratulations, You Won!
                    </div>
                    <div className="text-center text-emerald-600 text-[56px] font-bold">
                      {Number(totalWon).toFixed(2)} SUI
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[380px] opacity-90 text-center text-black text-2xl font-semibold">
                      Better luck next time
                    </div>
                    <div className="text-center text-black text-[56px] font-bold">
                      {Number(totalWon).toFixed(2)} SUI
                    </div>
                  </>
                )}

                <div className="opacity-70 text-right text-neutral-900 text-base font-medium">
                  You Bid: {Math.round(bid * finalPaths.length * 100) / 100} SUI
                </div>
              </div>

              <div className="self-stretch bg-white justify-start items-center gap-2 inline-flex">
                <button
                  onClick={handlePlayAgain}
                  className="grow shrink basis-0 self-stretch px-5 py-4 bg-black rounded-[38px] justify-center items-center gap-2 flex hover:bg-neutral-900 transition-colors"
                >
                  <div className="text-white text-base font-bold">
                    Play again
                  </div>
                </button>
              </div>

              <div className="justify-center items-center gap-2 inline-flex">
                <a
                  href={suiExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-900 text-base font-semibold underline-offset-2 hover:underline"
                >
                  Verify on Sui Explorer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EndGameCard;
