import 'server-only';

import { Paper } from "@/components/general/Paper";
import { Metadata } from "next";
import MatterSim from "../../components/MatterSim"; 

export const metadata: Metadata = {
  title: "Play Plinko Game",
};

export default function Play() {
  console.log("play.tsx is on server:", !!process.env.IS_SERVER_SIDE);

  return (
    <Paper>
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
    </Paper>
  );
}
