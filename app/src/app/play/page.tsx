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
import InsufficientCoinBalance from "@/components/InsufficientCoinBalance";

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
            <InsufficientCoinBalance />
            <div className="absolute top-15 right-0 transform scale-75 z-50 opacity-100">
              <ScoreTable />
            </div>
            <div className="flex flex-col items-center min-h-screen bg-opacity-0 mt-12 px-4">
              <div className="mb-12 mt-6">
                <TotalWon />
              </div>
              <div className="scale-125 mb-4 mx-auto pl-10">
                <MatterSim />
              </div>
              <div className="flex-grow flex flex-col items-center justify-center">
                <PlinkoSettings />
              </div>
            </div>
          </IsWaitingToPlayProvider>
        </GameHistoryProvider>
      </PlayProvider>
    </Paper>
  );
}
