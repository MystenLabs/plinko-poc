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
import { useIsMobile } from "@/hooks/useIsMobile";
import { is } from "@mysten/sui.js";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [scoreTableScale, setScoreTableScale] = useState(1);
  const { isMobile } = useIsMobile();

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
      let scale = 0;
      if (!!isMobile) {
        scale = 0.8;
      } else {
        scale = 1;
      }
      const newScale = Math.min(scaleX, scaleY) * scale;

      if (newScale + 0.2 > 1) {
        setScale(newScale);
      } else {
        setScale(newScale + 0.2);
      }
      if (newScale > 0.8) {
        setScoreTableScale(newScale - 0.3);
      } else {
        setScoreTableScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [isMobile]);

  return (
    <Paper>
      <PlayProvider>
        <GameHistoryProvider>
          <IsWaitingToPlayProvider>
            <EndGameCard />
            <InsufficientCoinBalance />
            <div className="relative flex flex-col space-y-[10px] items-center bg-green-300 ">
              <TotalWon />
              <div className="flex justify-center bg-red-300 w-full">
                <div ref={containerRef} className="relative max-w-full">
                  {/* Existing content */}
                  <div
                    className="w-full flex justify-center items-center overflow-hidden"
                    style={{ height: 600 * scale }}
                  >
                    <div
                      style={{
                        transform: `scale(${scale}) translateX(22px)`, // Adjust scale based on screen width
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
              </div>
              <div className="hidden md:block absolute top-0 right-0">
                <div
                  className="absolute top-12 right-0 z-10"
                  style={{
                    transform: `scale(${scoreTableScale})`,
                    transformOrigin: "top right", // Set the transform origin to top right
                  }}
                >
                  <ScoreTable />
                </div>
              </div>
            </div>
            <PlinkoSettings />
          </IsWaitingToPlayProvider>
        </GameHistoryProvider>
      </PlayProvider>
    </Paper>
  );
}
