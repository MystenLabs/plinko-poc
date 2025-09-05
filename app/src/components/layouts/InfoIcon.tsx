// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export const InfoIcon = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-[40px] h-[40px] relative bg-white hover:bg-gray-100 h-rounded-[10px] border-[1px] border-[#CCCCCC] opacity-80"
          >
            <Image src="/general/info.svg"
                   alt="Info"
                   fill={true}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-3/4 h-1/2">
          <DialogHeader>
            <DialogTitle>Game Rules</DialogTitle>
          </DialogHeader>
          <ScrollArea>
            <div className="space-y-[10px] text-black text-opacity-80 text-sm">
              <div>
                Inspired by the popular game show, Plinko is a game of chance where balls are dropped from the top of
                a pegged board, and the outcome is determined by the path they take. Our Sui blockchain implementation
                offers a unique experience by integrating cryptographic techniques to ensure fairness and
                transparency.
              </div>
              <div>
                The game begins with the players selecting the number of balls they want to play and also selecting
                the bet size for each ball. This strategic choice allows players to influence their potential rewards.
              </div>
              <div>
                After making their selections, players initiate the game, which then employs blockchain technology
                to ensure the randomness and fairness of each ball drop through a pegged board.
                The goal is to land the balls in slots at the bottom of the board, each offering different prize
                multipliers.
                The outcome of the game, dictated by where the balls land, is calculated automatically, with the smart
                contract assessing the results to determine the total winnings.
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
