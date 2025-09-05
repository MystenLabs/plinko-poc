// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
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
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scoreTableScale, setScoreTableScale] = useState(1);
  const { isMobile } = useIsMobile();

  useEffect(() => {
    const calculateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const matterSimWidth = 800; // Replace with MatterSim's actual width
      const matterSimHeight = 600; // Replace with MatterSim's actual height

      const scaleX = containerWidth / matterSimWidth;
      const scaleY = containerHeight / matterSimHeight;

      const deviceScale = isMobile ? 0.8 : 1;
      const newScale = Math.min(scaleX, scaleY) * deviceScale;

      setScale(newScale + 0.2 > 1 ? newScale : newScale + 0.2);
      setScoreTableScale(newScale > 0.8 ? newScale - 0.3 : newScale);
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
            <div className="relative flex flex-col items-center">
              <TotalWon />
              <div className="flex justify-center w-full">
                <div ref={containerRef} className="relative max-w-full">
                  <div
                    className="w-full flex justify-center items-center overflow-hidden"
                    style={{ height: 600 * scale }}
                  >
                    <div
                      style={{
                        transform: `scale(${scale}) translateX(22px)`,
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
                    transformOrigin: "top right",
                  }}
                >
                  <ScoreTable />
                </div>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <PlinkoSettings />
            </div>
          </IsWaitingToPlayProvider>
        </GameHistoryProvider>
      </PlayProvider>
    </Paper>
  );
}
