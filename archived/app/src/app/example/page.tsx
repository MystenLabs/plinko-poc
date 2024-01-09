"use client";
// import React, { useState } from "react";
import MatterSim from "../components/MatterSim"; // Update the path if necessary
import "../globals.css";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

const HomePage: React.FC = () => {
  // const [betAmount, setBetAmount] = useState("");
  // const [ballCount, setBallCount] = useState("");

  // const handlePlay = () => {
  //   // Logic to handle the play action
  //   console.log(`Bet Amount: ${betAmount}, Ball Count: ${ballCount}`);
  //   // You can call functions to start the game here
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-4">
        <MatterSim />
      </div>
      <form className="flex flex-col items-center space-y-4">
        <input
          type="number"
          placeholder="Enter Bet Amount (SUI)"
          className="px-4 py-2 border rounded-md"
          // value={betAmount}
          // onChange={(e) => setBetAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of Balls"
          className="px-4 py-2 border rounded-md"
          // value={ballCount}
          // onChange={(e) => setBallCount(e.target.value)}
        />
        <button
          type="button"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          // onClick={handlePlay}
        >
          PLAY
        </button>
      </form>
    </div>
  );
};

export default HomePage;
