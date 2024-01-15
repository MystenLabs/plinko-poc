"use client";
import React, { createContext, useContext, useState } from "react";

// Define the shape of the context data
interface IPlayContext {
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
  betSize: number;
  setBetSize: (size: number) => void;
}

// Create the context
const PlayContext = createContext<IPlayContext>({
  isPlaying: false,
  setPlaying: () => {}, // Placeholder function
  betSize: 0,
  setBetSize: () => {}, // Placeholder function
});

// Export the custom hook for accessing the context
export const usePlayContext = () => useContext(PlayContext);

// Define and export the provider component
export const PlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setPlaying] = useState(false);
  const [betSize, setBetSize] = useState(0);

  return (
    <PlayContext.Provider
      value={{ isPlaying, setPlaying, betSize, setBetSize }}
    >
      {children}
    </PlayContext.Provider>
  );
};
