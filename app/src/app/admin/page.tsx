import "server-only";

import { Paper } from "@/components/general/Paper";
import { Metadata } from "next";
import MatterSim from "../../components/MatterSim";
import PlinkoSettings from "@/components/PlinkoSettings";
import { PlayProvider } from "@/contexts/PlayContext";
import { GameHistoryProvider } from "@/contexts/GameHistoryContext";
import { TotalWon } from "@/components/totalWon";
import ScoreTable from "@/components/ScoreTable";

export const metadata: Metadata = {
  title: "Play Plinko Game",
};

export default function Play() {
  console.log("play.tsx is on server:", !!process.env.IS_SERVER_SIDE);

  return (
    <Paper>
      <PlayProvider>
        <GameHistoryProvider>
          <div className="absolute top-12 right-0 transform scale-75 z-50 opacity-100">
            <ScoreTable />
          </div>
          <div className="flex flex-col items-center min-h-screen bg-opacity-0">
            <TotalWon />
            <div className="mb-4 scale-50 sm:scale-70 md:scale-100">
              <MatterSim />
            </div>
            <PlinkoSettings />
          </div>
        </GameHistoryProvider>
      </PlayProvider>
    </Paper>
  );
}
