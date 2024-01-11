"use client";
import React, { useState, useEffect } from "react";
import { usePlayContext } from "../contexts/PlayContext";

const PlinkoSettings = () => {
  const { isPlaying, setPlaying } = usePlayContext();
  const [betSize, setBetSize] = useState(0.0);
  const [numberOfBalls, setNumberOfBalls] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [selectedRisk, setSelectedRisk] = useState("red");

  useEffect(() => {
    const bet = parseFloat(betSize.toString()) || 0;
    const balls = parseInt(numberOfBalls.toString(), 10) || 0;
    setCurrentBet(bet * balls);
  }, [betSize, numberOfBalls]);

  const handlePlayClick = () => {
    if (isPlaying) return;
    setPlaying(true);
    console.log("Play Clicked", isPlaying);
    console.log(
      "Current Bet:",
      currentBet.toFixed(2),
      "Risk Color:",
      selectedRisk
    );
  };

  const adjustBetSize = (delta: any) => {
    setBetSize((prev) => Math.max(0, prev + delta));
  };

  const adjustNumberOfBalls = (delta: any) => {
    setNumberOfBalls((prev) => Math.max(0, prev + delta));
  };

  const handleBetSizeChange = (e: any) => {
    const value = parseFloat(e.target.value);
    setBetSize(isNaN(value) ? 0 : value);
  };

  const handleNumberOfBallsChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfBalls(isNaN(value) ? 0 : value);
  };

  const riskButtonClass = (riskColor: any) => {
    const baseClasses =
      "px-3 py-1 text-white rounded mx-1 transition-transform duration-300";
    const colorClasses = {
      green: "bg-green-500 hover:bg-green-700",
      yellow: "bg-yellow-500 hover:bg-yellow-700",
      red: "bg-red-500 hover:bg-red-700",
    };
    const selectedClass =
      selectedRisk === riskColor ? "transform scale-110" : "";
    //@ts-ignore
    return `${baseClasses} ${colorClasses[riskColor]} ${selectedClass}`;
  };

  return (
    <div className="p-4 bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg shadow-md rounded-lg max-w-4xl mx-auto my-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Plinko Game Settings
      </h2>
      <div className="flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-10">
        {/* Bet Size & Number of Balls */}
        <div className="flex flex-row justify-around items-center space-x-4">
          {/* Bet Size */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Bet Size
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={betSize}
                onChange={handleBetSizeChange}
                className="w-16 p-2 text-center border border-gray-300 rounded-l-md"
              />
              <button
                onClick={() => adjustBetSize(-0.5)}
                className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center mx-1"
              >
                -
              </button>
              <button
                onClick={() => adjustBetSize(0.5)}
                className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Number of Balls */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Number of Balls
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={numberOfBalls}
                onChange={handleNumberOfBallsChange}
                className="w-16 p-2 text-center border border-gray-300 rounded-l-md"
              />
              <button
                onClick={() => adjustNumberOfBalls(-1)}
                className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center mx-1"
              >
                -
              </button>
              <button
                onClick={() => adjustNumberOfBalls(1)}
                className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Risk Level */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Risk Level
          </label>
          <div className="flex">
            <button
              onClick={() => setSelectedRisk("green")}
              className={riskButtonClass("green")}
            >
              Green
            </button>
            <button
              onClick={() => setSelectedRisk("yellow")}
              className={riskButtonClass("yellow")}
            >
              Yellow
            </button>
            <button
              onClick={() => setSelectedRisk("red")}
              className={riskButtonClass("red")}
            >
              Red
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handlePlayClick}
          className={`px-6 py-3 text-lg rounded-full ${
            isPlaying
              ? "bg-gray-500 hover:bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white`}
        >
          Play
        </button>
      </div>

      {/* Current Bet */}
      <div className="text-right mt-2 text-sm font-medium text-gray-700">
        Current bet: {currentBet.toFixed(2)}
      </div>
    </div>
  );
};

export default PlinkoSettings;
