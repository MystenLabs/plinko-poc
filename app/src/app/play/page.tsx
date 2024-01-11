import "server-only";

import { Paper } from "@/components/general/Paper";
import { Metadata } from "next";
import MatterSim from "../../components/MatterSim";
import PlinkoSettings from "@/components/PlinkoSettings";
import { PlayProvider } from "@/contexts/PlayContext";

export const metadata: Metadata = {
  title: "Play Plinko Game",
};

export default function Play() {
  console.log("play.tsx is on server:", !!process.env.IS_SERVER_SIDE);

  return (
    <Paper>
      <PlayProvider>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="mb-4">
            <MatterSim />
          </div>
          <PlinkoSettings />
        </div>
      </PlayProvider>
    </Paper>
  );
}
