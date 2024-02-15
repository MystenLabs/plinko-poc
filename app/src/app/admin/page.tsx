import "server-only";

import { Paper } from "@/components/general/Paper";
import { Metadata } from "next";
import MatterSim from "../../components/MatterSim";
import PlinkoSettings from "@/components/PlinkoSettings";
import { PlayProvider } from "@/contexts/PlayContext";
import { GameHistoryProvider } from "@/contexts/GameHistoryContext";
import { TotalWon } from "@/components/totalWon";
import ScoreTable from "@/components/ScoreTable";
import EndGameCard from "@/components/EndGameCard";
import { IsWaitingToPlayProvider } from "@/contexts/IsWaitingToPlay";

export const metadata: Metadata = {
  title: "Play Plinko Game",
};

export default function Play() {
  return (
    <Paper>
      <PlayProvider>
        <GameHistoryProvider>
          <IsWaitingToPlayProvider>
            <EndGameCard />
            <div className="absolute top-12 right-0 transform scale-75 z-50 opacity-100">
              {/* <div className="absolute top-12 right-0 md:right-10p lg:right-5p transform scale-75 sm:scale-90 md:scale-100 z-50 opacity-100"> */}
              <ScoreTable />
            </div>
            <div className="flex flex-col items-center min-h-screen bg-opacity-0">
              <TotalWon />
              <div className="mb-4 mx-auto pl-8 ">
                <MatterSim />
              </div>
              <PlinkoSettings />
            </div>
          </IsWaitingToPlayProvider>
        </GameHistoryProvider>
      </PlayProvider>
    </Paper>
  );
}
