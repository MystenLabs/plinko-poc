"use client";
import React, { createContext, useContext, useState } from "react";

interface GameHistoryContextType {
  colors: string[]; // Only storing colors now
  addColor: (color: string | undefined) => void;
  resetHistory: () => void;
}

const GameHistoryContext = createContext<GameHistoryContextType>({
  colors: [],
  addColor: () => {},
  resetHistory: () => {},
});

export const useGameHistory = () => useContext(GameHistoryContext);

export const GameHistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colors, setColors] = useState<string[]>([]);

  const addColor = (color: string | undefined) => {
    if (color !== undefined) {
      setColors((prevColors) => [...prevColors, color!]);
    }
  };

  const resetHistory = () => {
    setColors([]);
  };

  return (
    <GameHistoryContext.Provider value={{ colors, addColor, resetHistory }}>
      {children}
    </GameHistoryContext.Provider>
  );
};
