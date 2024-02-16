"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface IPlayContext {
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
  betSize: number;
  setBetSize: (size: number) => void;
  finalPaths: number[][];
  setFinalPaths: (paths: number[][]) => void;
  popupIsVisible: boolean;
  setPopupIsVisible: (isVisible: boolean) => void;
  txDigest: string;
  setTxDigest: (digest: string) => void;
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
  const [txDigest, setTxDigest] = useState<string>("");

  // Provide the context with an object that matches IPlayContext
  const value = {
    isPlaying,
    setPlaying,
    betSize,
    setBetSize,
    finalPaths,
    setFinalPaths,
    popupIsVisible,
    setPopupIsVisible,
    txDigest,
    setTxDigest,
  };

  return <PlayContext.Provider value={value}>{children}</PlayContext.Provider>;
};
