"use client";

import { useGameHistory } from "@/contexts/GameHistoryContext";
import { usePlayContext } from "@/contexts/PlayContext";
import React, { useState } from "react";

const PopupComponent = () => {
  const { totalWon } = useGameHistory(); // Assuming bid is also stored in your context
  const {
    popupIsVisible,
    setPopupIsVisible,
    betSize: bid,
    txDigest,
    finalPaths,
    setFinalPaths,
  } = usePlayContext();

  const togglePopup = () => setPopupIsVisible(!popupIsVisible);

  // Check if the player has won or lost
  const hasWon = totalWon - bid * finalPaths.length > 0;
  const suiExplorerUrl = `https://suiexplorer.com/txblock/${txDigest}?network=testnet`;
  console.log("suiExplorerUrl = ", txDigest);

  const handlePlayAgain = () => {
    setPopupIsVisible(false); // This will hide the popup
    setFinalPaths([[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]]); // Reset the final paths
  };

  return (
    <>
      {popupIsVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10 ">
          <div
            className="p-5 border w-[600px] bg-white rounded-3xl shadow-lg "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col justify-center items-center gap-10">
              <div className="flex flex-col justify-center items-center gap-1.5">
                {hasWon ? (
                  <>
                    <div className="w-[380px] opacity-90 text-center text-black text-2xl font-semibold">
                      Congratulations, You Won!
                    </div>
                    <div className="text-center text-emerald-600 text-[56px] font-bold">
                      {totalWon} SUI
                    </div>
                  </>
                ) : (
                  <div className="w-[380px] opacity-90 text-center text-black text-2xl font-semibold">
                    Better luck next time
                  </div>
                )}
                <div className="opacity-70 text-right text-neutral-900 text-base font-medium">
                  You Bid: {bid * finalPaths.length} SUI
                </div>
              </div>
              <div className="self-stretch bg-white border-t-2 justify-start items-center gap-2 inline-flex">
                <button
                  onClick={handlePlayAgain}
                  className="grow shrink basis-0 self-stretch px-5 py-4 bg-black rounded-[38px] justify-center items-center gap-2 flex"
                >
                  <div className="text-white text-base font-bold">
                    Play again
                  </div>
                </button>
              </div>
              <div className="justify-center items-center gap-2 inline-flex">
                <div className="text-neutral-900 text-base font-semibold">
                  <a
                    href={suiExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 text-base font-semibold"
                  >
                    Verify on Sui Explorer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupComponent;
