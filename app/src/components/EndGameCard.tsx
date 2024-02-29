"use client";

import { useGameHistory } from "@/contexts/GameHistoryContext";
import { usePlayContext } from "@/contexts/PlayContext";
import React, { useState } from "react";

const PopupComponent = () => {
  const { totalWon, historyFromPreviousGames, resetHistory } = useGameHistory(); // Assuming you store previous games' history here
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
  const suiExplorerUrl = `https://suiexplorer.com/txblock/${txDigest}?network=testnet`;
  console.log("suiExplorerUrl = ", txDigest);

  const handlePlayAgain = () => {
    setPopupIsVisible(false); // This will hide the popup
    setFinalPaths([[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]]); // Reset the final paths
    resetHistory(); // Reset the history
  };

  return (
    <>
      {popupIsVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10">
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
                    <div className="w-[380px] opacity-90 text-center text-black text-2xl font-semibold">
                      Congratulations, You Won!
                    </div>
                    <div className="text-center text-emerald-600 text-[56px] font-bold">
                      {Number(totalWon).toFixed(2)} SUI
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

              {/* <div className="w-[480px] h-auto min-h-[50px] p-4 rounded-lg border border-zinc-300 flex flex-col justify-center gap-6">
                <div className="flex justify-between items-center">
                  <div className="text-black text-base font-bold font-['Inter']">
                    Game History
                  </div>
                  <button
                    onClick={toggleHistory}
                    className="flex justify-center items-center gap-2"
                  >
                    <div className="text-neutral-900 text-sm font-semibold font-['Inter']">
                      {showHistory ? "Hide" : "Show"}
                    </div>
                    <div className="w-4 h-4 relative">
                      
                    </div>
                  </button>
                </div>
                {showHistory && (
                  <div className="w-full overflow-auto">
                    {historyFromPreviousGames.length > 1 &&
                      [...historyFromPreviousGames] // Create a shallow copy to avoid mutating the original array
                        .slice(2)
                        .reverse() // Reverse the copied array
                        .map((data, index) => (
                          <React.Fragment key={index}>
                            <div className="text-neutral-900 text-lg font-semibold">

                              Game #
                              {historyFromPreviousGames.length - 1 - index - 1}
                            </div>

                            {
                              // @ts-ignore
                              data.map((data2, index2) => (
                                <div
                                  key={index2}
                                  className="text-neutral-900 text-sm"
                                >

                                  Ball {index2 + 1}: bet: {data2.bet} ,
                                  multiplier: {data2.multiplier}, earnings:{" "}
                                  {data2.earnings}
                                </div>
                              ))
                            }
                          </React.Fragment>
                        ))}
                  </div>
                )}
              </div> */}
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
