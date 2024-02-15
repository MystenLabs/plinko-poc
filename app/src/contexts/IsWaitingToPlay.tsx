"use client";
import { is } from "@mysten/sui.js";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface IPlayContext {
  isWaitingToPlay: boolean;
  setWaitingToPlay: (waiting: boolean) => void;
}

// Initialize context with a type assertion to match IPlayContext
const IsWaitingToPlay = createContext<IPlayContext | undefined>(undefined);

export const useWaitingToPlayContext = () => {
  const context = useContext(IsWaitingToPlay);
  if (context === undefined) {
    throw new Error(
      "usePlayContext must be used within a WaitingToPlayProvider"
    );
  }
  return context;
};

export const IsWaitingToPlayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);

  // Provide the context with an object that matches IPlayContext
  const value = {
    isWaitingToPlay: isPlaying,
    setWaitingToPlay: setPlaying,
  };

  return (
    <IsWaitingToPlay.Provider value={value}>
      {children}
    </IsWaitingToPlay.Provider>
  );
};
