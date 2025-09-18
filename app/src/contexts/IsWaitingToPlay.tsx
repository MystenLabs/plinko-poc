// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface IWaitingContext {
  isWaitingToPlay: boolean;
  setWaitingToPlay: (waiting: boolean) => void;
}

// Initialize context with a type assertion to match IWaitingContext
const IsWaitingToPlay = createContext<IWaitingContext | undefined>(undefined);

export const useWaitingToPlayContext = () => {
  const context = useContext(IsWaitingToPlay);
  if (context === undefined) {
    throw new Error(
      "useWaitingToPlayContext must be used within a WaitingToPlayProvider"
    );
  }
  return context;
};

export const IsWaitingToPlayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);

  // Provide the context with an object that matches IWaitingContext
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
