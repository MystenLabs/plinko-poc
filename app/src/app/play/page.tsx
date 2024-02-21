"use client";
import EndGameCard from "@/components/EndGameCard";
import InsufficientCoinBalance from "@/components/InsufficientCoinBalance";
import MatterSim from "@/components/MatterSim";
import PlinkoSettings from "@/components/PlinkoSettings";
import { Paper } from "@/components/general/Paper";
import { GameHistoryProvider } from "@/contexts/GameHistoryContext";
import { IsWaitingToPlayProvider } from "@/contexts/IsWaitingToPlay";
import { PlayProvider } from "@/contexts/PlayContext";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      //@ts-ignore
      const containerWidth = container.offsetWidth;
      //@ts-ignore
      const containerHeight = container.offsetHeight;

      const matterSimWidth = 800; // Replace with MatterSim's actual width
      const matterSimHeight = 600; // Replace with MatterSim's actual height

      const scaleX = containerWidth / matterSimWidth;
      const scaleY = containerHeight / matterSimHeight;
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return (
    <Paper>
      <PlayProvider>
        <GameHistoryProvider>
          <IsWaitingToPlayProvider>
            <EndGameCard />
            <InsufficientCoinBalance />
            <div
              ref={containerRef}
              className="relative max-w-full max-h-full overflow-hidden"
            >
              {/* Adjust this div to take 60% of the height of its parent */}
              <div className="w-full h-3/5 flex justify-center items-center overflow-hidden bg-slate-600">
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                    display: "flex", // Ensures the div is a flex container
                    justifyContent: "center", // Centers horizontally in the flex container
                    alignItems: "center", // Centers vertically in the flex container
                    width: "100%", // Ensures it tries to fill the container before scaling
                    // Removed height: "100%" to respect the parent's adjusted height
                  }}
                >
                  <MatterSim />
                </div>
              </div>
            </div>
            <div>
              <PlinkoSettings />
            </div>
          </IsWaitingToPlayProvider>
        </GameHistoryProvider>
      </PlayProvider>
    </Paper>
  );
}
