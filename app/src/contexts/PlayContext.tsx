// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UiError = {
  message?: string;
  title?: string;
};

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
  errorModal: { visible: boolean; error?: UiError };
  setErrorModal: (v: { visible: boolean; error?: UiError }) => void;
  showError: (err: UiError | string) => void;
  hideError: () => void;
  setError: (err?: UiError) => void;
}

const PlayContext = createContext<IPlayContext | undefined>(undefined);

export const usePlayContext = () => {
  const context = useContext(PlayContext);
  if (!context)
    throw new Error("usePlayContext must be used within a PlayProvider");
  return context;
};

export const PlayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setPlaying] = useState(false);
  const [betSize, setBetSize] = useState(0.1);
  const [finalPaths, setFinalPaths] = useState<number[][]>([
    [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
  ]);
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [txDigest, setTxDigest] = useState("");

  const [errorModal, setErrorModal] = useState<{
    visible: boolean;
    error?: UiError;
  }>({
    visible: false,
    error: undefined,
  });

  const showError = (err: UiError | string) => {
    setErrorModal({
      visible: true,
      error: typeof err === "string" ? { message: err } : err,
    });
  };
  const hideError = () => setErrorModal({ visible: false, error: undefined });
  const setError = (err?: UiError) =>
    setErrorModal({ visible: !!err, error: err });

  const value: IPlayContext = {
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

    errorModal,
    setErrorModal,
    showError,
    hideError,
    setError,
  };

  return <PlayContext.Provider value={value}>{children}</PlayContext.Provider>;
};
