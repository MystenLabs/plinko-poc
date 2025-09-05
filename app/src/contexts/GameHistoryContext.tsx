"use client";
import React, { createContext, useContext, useState } from "react";

type HistoryItem = {
  bet: string;
  multiplier: string;
  earnings: string;
  earningsValue: number;
  isLost: boolean;
};

interface GameHistoryContextType {
  colors: string[];
  totalWon: number;
  addTotalWon: (amount: number, lastColorIndex: number) => void;
  addColor: (color: string | undefined) => void;

  // One game's history (list of entries for the current game)
  currentGameHistory: HistoryItem[];
  setCurrentGameHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;

  // All previous games' histories (array of games; each game is an array of HistoryItem)
  historyFromPreviousGames: HistoryItem[][];
  setHistoryFromPreviousGames: React.Dispatch<
    React.SetStateAction<HistoryItem[][]>
  >;

  resetHistory: () => void;
}

const GameHistoryContext = createContext<GameHistoryContextType>({
  colors: [],
  totalWon: 0,
  addTotalWon: () => {},
  addColor: () => {},
  currentGameHistory: [],
  setCurrentGameHistory: () => {},
  historyFromPreviousGames: [],
  setHistoryFromPreviousGames: () => {},
  resetHistory: () => {},
});

export const useGameHistory = () => useContext(GameHistoryContext);

export const GameHistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colors, setColors] = useState<string[]>([]);
  const [totalWon, setTotalWon] = useState<number>(0);
  const [lastColorIndexHistory, setLastColorIndexHistory] = useState<number>(0);

  // Current game's entries:
  const [currentGameHistory, setCurrentGameHistory] = useState<HistoryItem[]>(
    []
  );

  // List of past games (each past game is an array of HistoryItem):
  const [historyFromPreviousGames, setHistoryFromPreviousGames] = useState<
    HistoryItem[][]
  >([]);

  const addColor = (color: string | undefined) => {
    if (color !== undefined) {
      setColors((prev) => [...prev, color]);
    }
  };

  const addTotalWon = (amount: number, lastColorIndex: number) => {
    if (lastColorIndexHistory !== lastColorIndex) {
      setLastColorIndexHistory(lastColorIndex);
      setTotalWon((prevTotalWon) => prevTotalWon + amount);
    }
  };

  const resetHistory = () => {
    // Add the current game's history to the previous games list (if it has entries)
    if (currentGameHistory.length === 0) {
      console.log("No history to add to historyFromPreviousGames");
    } else {
      setHistoryFromPreviousGames((prev) => [...prev, [...currentGameHistory]]);
    }

    // Clear current game/UI tracking
    setCurrentGameHistory([]);
    setLastColorIndexHistory(0);
    setColors([]);
    setTotalWon(0);
  };

  return (
    <GameHistoryContext.Provider
      value={{
        colors,
        addColor,
        resetHistory,
        totalWon,
        addTotalWon,
        currentGameHistory,
        setCurrentGameHistory,
        historyFromPreviousGames,
        setHistoryFromPreviousGames,
      }}
    >
      {children}
    </GameHistoryContext.Provider>
  );
};
