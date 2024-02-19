"use client";
import React, { createContext, useContext, useState } from "react";
import { never, set } from "zod";

interface GameHistoryContextType {
  colors: string[]; // Only storing colors now
  totalWon: number;
  addTotalWon: (amount: number, lastColorIndex: number) => void;
  addColor: (color: string | undefined) => void;
  currentGameHistory: any;
  setCurrentGameHistory: any;
  historyFromPreviousGames: any;
  setHistoryFromPreviousGames: any;
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
  const [currentGameHistory, setCurrentGameHistory] = useState([]);
  //@ts-ignore
  const [historyFromPreviousGames, setHistoryFromPreviousGames] = useState<[]>([
    {
      bet: "",
      multiplier: "",
      earnings: "",
      earningsValue: 0,
      isLost: true,
    },
  ]);

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
    // I want to add the current game history to the historyFromPreviousGames
    //@ts-ignore
    if (currentGameHistory === [[]]) {
      console.log("No history to add to historyFromPreviousGames");
    } else {
      //@ts-ignore
      setHistoryFromPreviousGames((prevHistory: any) => [
        ...prevHistory,
        currentGameHistory as any,
      ]);
    }

    console.log(
      "!!!!!!!!!!!historyFromPreviousGames!!!!!!!!!!!",
      historyFromPreviousGames
    );
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
