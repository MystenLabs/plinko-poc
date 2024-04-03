"use client";

import { useBalance } from "@/contexts/BalanceContext";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { usePlayContext } from "@/contexts/PlayContext";
import React, { useState } from "react";

const PopupComponent = () => {
  const { handleRefreshBalance } = useBalance();
  const { totalWon, resetHistory } = useGameHistory(); // Assuming you store previous games' history here
  const {
    popupIsVisible,
    setPopupIsVisible,
    betSize: bid,
    txDigest,
    finalPaths,
    setFinalPaths,
  } = usePlayContext();
  const [showHistory, setShowHistory] = useState(false); // State to toggle match history visibility

  const togglePopup = () => setPopupIsVisible(!popupIsVisible);
  const toggleHistory = () => setShowHistory(!showHistory); // Function to toggle history visibility

  // Check if the player has won or lost
  const hasWon = totalWon - bid * finalPaths.length > 0;
  const suiExplorerUrl = `https://suiscan.xyz/testnet/tx/${txDigest}`;

  const handlePlayAgain = () => {
    setPopupIsVisible(false); // This will hide the popup
    setFinalPaths([[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]]); // Reset the final paths
    resetHistory(); // Reset the history
    handleRefreshBalance(); // Refresh the balance
  };

  return (
    <>
      {popupIsVisible && (
        <div
          className={`fixed inset-0 ${
            hasWon ? "" : "bg-gray-600 bg-opacity-50"
          } overflow-y-auto h-full w-full flex justify-center items-center z-20`}
          style={{
            ...(hasWon
              ? {
                  backgroundImage: "url('/general/confetti.svg')",
                  backgroundSize: "cover",
                  backgroundPositionX: "center",
                  backgroundPositionY: "top",
                }
              : {}),
          }}
        >
          <div
            className="p-5 border bg-white rounded-3xl shadow-lg"
            style={{
              width: "80%", // Use percentage for responsiveness
              maxWidth: "600px", // Maximum width
            }}
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

              <div className="self-stretch bg-white  justify-start items-center gap-2 inline-flex">
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
