"use client";
import EndGameCard from "@/components/EndGameCard";
import InsufficientCoinBalance from "@/components/InsufficientCoinBalance";
import MatterSim from "@/components/MatterSim";
import PlinkoSettings from "@/components/PlinkoSettings";
import ScoreTable from "@/components/ScoreTable";
import { Paper } from "@/components/general/Paper";
import { TotalWon } from "@/components/totalWon";
import { GameHistoryProvider } from "@/contexts/GameHistoryContext";
import { IsWaitingToPlayProvider } from "@/contexts/IsWaitingToPlay";
import { PlayProvider } from "@/contexts/PlayContext";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [scoreTableScale, setScoreTableScale] = useState(1);

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
      if (newScale > 0.8) {
        setScoreTableScale(newScale - 0.3);
      } else {
        setScoreTableScale(newScale);
      }
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
              {/* Overlay TotalWon at the top middle */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                <TotalWon />
              </div>

              {/* Overlay History at the top right with dynamic scaling */}
              <div
                className="absolute top-12 right-0 z-5"
                style={{
                  transform: `scale(${scoreTableScale})`,
                  transformOrigin: "top right", // Set the transform origin to top right
                  // maxWidth: `${500}px`, // Set maximum width
                  // maxHeight: `${20}px`, // Set maximum height
                }}
              >
                <ScoreTable />
              </div>

              {/* Existing content */}
              <div className="w-full h-3/5 flex justify-center items-center overflow-hidden ">
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
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
