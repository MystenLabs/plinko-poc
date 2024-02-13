"use client";
import React, { createContext, useContext, useState } from "react";
import { set } from "zod";

interface GameHistoryContextType {
  colors: string[]; // Only storing colors now
  totalWon: number;
  addTotalWon: (amount: number, lastColorIndex: number) => void;
  addColor: (color: string | undefined) => void;
  resetHistory: () => void;
}

const GameHistoryContext = createContext<GameHistoryContextType>({
  colors: [],
  totalWon: 0,
  addTotalWon: () => {},
  addColor: () => {},
  resetHistory: () => {},
});

export const useGameHistory = () => useContext(GameHistoryContext);

export const GameHistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colors, setColors] = useState<string[]>([]);
  const [totalWon, setTotalWon] = useState<number>(0);
  const [lastColorIndexHistory, setLastColorIndexHistory] = useState<number>(0);

  const addColor = (color: string | undefined) => {
    if (color !== undefined) {
      setColors((prevColors) => [...prevColors, color!]);
    }
  };

  const addTotalWon = (amount: number, lastColorIndex: number) => {
    if (lastColorIndexHistory !== lastColorIndex) {
      setLastColorIndexHistory(lastColorIndex);
      setTotalWon((prevTotalWon) => prevTotalWon + amount);
    }
  };

  const resetHistory = () => {
    setLastColorIndexHistory(0);
    setColors([]);
    setTotalWon(0);
  };

  return (
    <GameHistoryContext.Provider
      value={{ colors, addColor, resetHistory, totalWon, addTotalWon }}
    >
      {children}
    </GameHistoryContext.Provider>
  );
};
