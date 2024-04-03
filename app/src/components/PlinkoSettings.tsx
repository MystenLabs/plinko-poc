"use client";
import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { usePlayContext } from "../contexts/PlayContext";
import { useCreateCounterObject } from "@/hooks/moveTransactionCalls.ts/useCreateCounterObject";
import { useGameHistory } from "@/contexts/GameHistoryContext";
import { useWaitingToPlayContext } from "@/contexts/IsWaitingToPlay";
import { useBalance } from "@/contexts/BalanceContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import Picker, { PickerValue } from "react-mobile-picker";

const PlinkoSettings = () => {
  //@ts-ignore
  const {
    isPlaying,
    setPlaying,
    betSize,
    setBetSize,
    setPopupInsufficientCoinBalanceIsVisible,
  } = usePlayContext();
  const { isWaitingToPlay, setWaitingToPlay } = useWaitingToPlayContext();
  const { handleCreateCounterObject } = useCreateCounterObject();
  const { resetHistory } = useGameHistory();
  const { balance } = useBalance();
  const { isMobile } = useIsMobile();

  const [numberOfBalls, setNumberOfBalls] = useState(1);
  const [currentBet, setCurrentBet] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [allowShowPopup, setAllowShowPopup] = useState(true);

  const [pickerValue, setPickerValue] = useState<PickerValue>({
    bet: "0.1", // Initial bet
    balls: "1", // Initial number of balls
  });

  const handlePickerChange = useCallback((newValue: PickerValue) => {
    setPickerValue(newValue);
    setBetSize(parseFloat(newValue.bet));
    setNumberOfBalls(parseInt(newValue.balls, 10));
  }, []);

  // Generate arrays for bets and balls
  const getBetsArray = () =>
    Array.from({ length: 100 }, (_, i) => (0.1 * (i + 1)).toFixed(1));
  const getBallsArray = () =>
    Array.from({ length: 100 }, (_, i) => String(i + 1));
  //

  useEffect(() => {
    const bet = parseFloat(betSize.toString()) || 0;
    const balls = parseInt(numberOfBalls.toString(), 10) || 0;
    // i want to keep only 2 decimal places and if the last was 9, i want to round it up
    let totalBet = bet * balls;
    totalBet = Math.round(totalBet * 100) / 100;
    setCurrentBet(totalBet);
  }, [betSize, numberOfBalls]);

  const handlePlayClick = async () => {
    if (isPlaying) return;
    //@ts-ignore
    if (currentBet >= balance.c[0] + 0.9) {
      setPopupInsufficientCoinBalanceIsVisible(true);
      return;
    }
    resetHistory();
    setWaitingToPlay(true);
    let currentBetSize = currentBet;
    //@ts-ignore
    let result_create_obj = await handleCreateCounterObject(
      currentBetSize,
      numberOfBalls
    );
    setWaitingToPlay(false);
    setPlaying(true);
  };
  // Function to handle focusing on the input - selects the text
  const handleInputFocus = (event: any) => {
    event.target.select();
  };

  const handleBetSizeChange = (e: any) => {
    const value = e.target.value;

    // Regular expression to match up to 3 digits in total, allowing for 0 or 1 decimal places
    const isValidInput = /^(?:\d{1,3}|\d{0,2}\.\d)$/.test(value);

    if (isValidInput || value === "") {
      // Allows empty value for backspace functionality
      setBetSize(value);
    }
  };

  const handleNumberOfBallsChange = (e: any) => {
    const value = e.target.value;
    //Regular expression to match integers only from 1 to 100
    const isValidInput = /^(?:[1-9][0-9]?|100)$/.test(value);
    if (isValidInput || value === "") {
      setNumberOfBalls(value);
    }
  };

  const handleSubmit = () => {
    // your submission logic here
    setShowPopup(false); // Close the popup
    setAllowShowPopup(false); // Prevent reopening
    setTimeout(() => setAllowShowPopup(true), 300); // Re-enable after 300ms
  };

  // Similarly, for the cancel or close action
  const handleClose = () => {
    setShowPopup(false); // Close the popup
    setAllowShowPopup(false); // Prevent reopening
    setTimeout(() => setAllowShowPopup(true), 300); // Re-enable after 300ms
  };

  return (
    <div className="w-[950px] max-w-full px-5 pt-5 pb-[25px] bg-emerald-950 rounded-[20px] mx-auto my-4 ">
      {/* {showPopup && ( */}
      <Transition appear show={showPopup} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 "
          onClose={() => setShowPopup(false)}
          onSubmit={() => setShowPopup(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-emerald-900 p-6 text-left align-middle shadow-xl transition-all ">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  ></Dialog.Title>
                  <div className="mt-2">
                    {/* Titles for Bet and Balls */}
                    <div className="flex justify-between">
                      <div className="text-center text-white w-1/2">Bet</div>
                      <div className="text-center text-white w-1/2">Balls</div>
                    </div>
                    <Picker
                      value={pickerValue}
                      onChange={handlePickerChange}
                      wheelMode="natural"
                    >
                      <Picker.Column name="bet">
                        {getBetsArray().map((bet) => (
                          <Picker.Item key={bet} value={bet}>
                            {({ selected }) => (
                              <div
                                className={
                                  selected
                                    ? "font-semibold text-white"
                                    : "text-neutral-400"
                                }
                              >
                                {bet}
                              </div>
                            )}
                          </Picker.Item>
                        ))}
                      </Picker.Column>
                      <Picker.Column name="balls">
                        {getBallsArray().map((balls) => (
                          <Picker.Item key={balls} value={balls}>
                            {({ selected }) => (
                              <div
                                className={
                                  selected
                                    ? "font-semibold text-white"
                                    : "text-neutral-400"
                                }
                              >
                                {balls}
                              </div>
                            )}
                          </Picker.Item>
                        ))}
                      </Picker.Column>
                    </Picker>
                  </div>
                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      type="button"
                      className="h-11 px-8 py-2.5 bg-gray-200 rounded-[999px] flex justify-center items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => handleClose()}
                    >
                      <div className="text-base leading-[18.40px]">Cancel</div>
                    </button>
                    <button
                      type="button"
                      className="h-11 px-8 py-2.5 bg-emerald-600 rounded-[999px] flex justify-center items-center gap-2 text-sm font-bold text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => handleSubmit()}
                    >
                      <div className="text-base leading-[18.40px]">Submit</div>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* )} */}
      <div className="flex justify-center items-center gap-5">
        {/* Bid Amount (per ball) */}
        <div className="flex flex-col justify-center  gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Bid{" "}
            <span className="md:hidden">
              {" "}
              <br />{" "}
            </span>{" "}
            (Per Ball)
          </div>
          <div
            className={`flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] ${
              currentBet < 11
                ? "border border-white"
                : "border-2 border-rose-500"
            } border-opacity-25 gap-2.5`}
          >
            <input
              type="number"
              value={betSize}
              onChange={handleBetSizeChange}
              onFocus={(event) => {
                if (isMobile) {
                  event.target.blur(); // Remove focus from the input
                  if (allowShowPopup) {
                    setShowPopup(true); // Show the popup only if allowed
                  }
                } else {
                  handleInputFocus(event); // Optionally, handle focus for desktop
                }
              }}
              step="0.1"
              className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
              placeholder="0"
            />
            <div className="text-white text-opacity-50 text-base font-normal leading-[18.40px]">
              <img src="/general/sui.svg" alt="plus" width={12} height={12} />
            </div>
          </div>
        </div>
        {/* Number of Balls */}
        <div className="flex flex-col justify-center gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Number{" "}
            <span className="md:hidden">
              {" "}
              <br />{" "}
            </span>{" "}
            of Balls
          </div>
          <div
            className={`flex items-center h-11 p-5 bg-emerald-950 rounded-[40px] ${
              currentBet < 11
                ? "border border-white"
                : "border-2 border-rose-500"
            } border-opacity-25 gap-2.5`}
          >
            <input
              type="number"
              value={numberOfBalls}
              onChange={handleNumberOfBallsChange}
              onFocus={(event) => {
                if (isMobile) {
                  event.target.blur(); // Remove focus from the input
                  if (allowShowPopup) {
                    setShowPopup(true); // Show the popup only if allowed
                  }
                } else {
                  handleInputFocus(event); // Optionally, handle focus for desktop
                }
              }}
              className="bg-transparent text-white text-opacity-50 text-base font-normal leading-[18.40px] w-full outline-none"
              placeholder="0"
            />
          </div>
        </div>
        {/* Total Bid & Play Button */}
        <div className="flex flex-col justify-center  gap-2.5">
          <div className="text-white text-opacity-80 text-base font-medium leading-[18.40px] ml-4">
            Total Bid:{" "}
            <span className="md:hidden">
              {" "}
              <br />{" "}
            </span>{" "}
            {currentBet.toFixed(1)} SUI
          </div>
          <button
            onClick={() => {
              if (!isPlaying && !isWaitingToPlay && currentBet <= 10) {
                handlePlayClick();
              }
            }}
            className={`h-11 px-8 py-2.5 bg-emerald-600 rounded-[999px] flex justify-center items-center gap-2 ${
              isPlaying || isWaitingToPlay || currentBet > 10
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            <div className="text-white text-base font-bold leading-[18.40px]">
              Play
            </div>
          </button>
        </div>
      </div>
      {currentBet > 10 && (
        <div className="text-rose-500 text-sm font-medium text-center mt-4">
          *Total bid needs to be under 10 SUI
        </div>
      )}
    </div>
  );
};

export default PlinkoSettings;
