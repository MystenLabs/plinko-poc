"use client";
import React, { createContext, useContext, useState } from "react";

// Define the shape of the context data
interface IPlayContext {
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
  betSize: number;
  setBetSize: (size: number) => void;
  traceVector: string; // Add this line
  setTraceVector: (trace: string) => void; // And this line
}

// Create the context
const PlayContext = createContext<IPlayContext>({
  isPlaying: false,
  setPlaying: () => {},
  betSize: 0,
  setBetSize: () => {},
  traceVector: "", // Default empty string
  setTraceVector: () => {}, // Placeholder function
});

// Export the custom hook for accessing the context
export const usePlayContext = () => useContext(PlayContext);

// Define and export the provider component
export const PlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setPlaying] = useState(false);
  const [betSize, setBetSize] = useState(0);
  const [traceVector, setTraceVector] = useState(""); // State for traceVector

  return (
    <PlayContext.Provider
      value={{
        isPlaying,
        setPlaying,
        betSize,
        setBetSize,
        traceVector, // Provide traceVector
        setTraceVector, // And its setter
      }}
    >
      {children}
    </PlayContext.Provider>
  );
};

