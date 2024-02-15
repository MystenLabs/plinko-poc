"use client";
import { is } from "@mysten/sui.js";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface IPlayContext {
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
  betSize: number;
  setBetSize: (size: number) => void;
  finalPaths: number[][];
  setFinalPaths: (paths: number[][]) => void;
  popupIsVisible: boolean; // Add this line
  setPopupIsVisible: (isVisible: boolean) => void; // And this line
}

// Initialize context with a type assertion to match IPlayContext
const PlayContext = createContext<IPlayContext | undefined>(undefined);

export const usePlayContext = () => {
  const context = useContext(PlayContext);
  if (context === undefined) {
    throw new Error("usePlayContext must be used within a PlayProvider");
  }
  return context;
};

export const PlayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [isWaitingToPlay, setWaitingToPlay] = useState<boolean>(false);
  const [betSize, setBetSize] = useState<number>(0);
  const [finalPaths, setFinalPaths] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [popupIsVisible, setPopupIsVisible] = useState<boolean>(false);

  // Provide the context with an object that matches IPlayContext
  const value = {
    isPlaying,
    setPlaying,
    betSize,
    setBetSize,
    finalPaths,
    setFinalPaths,
    popupIsVisible, // And this line
    setPopupIsVisible, // And this one
  };

  return <PlayContext.Provider value={value}>{children}</PlayContext.Provider>;
};
