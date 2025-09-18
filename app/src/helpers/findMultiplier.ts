// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export const findTheMultiplier = (
  colorList: string[],
  multipliers: number[],
  colorThatIHave: string
) => {
  let index = colorList.indexOf(colorThatIHave);
  return multipliers[index];
};
// Make the same of a list of colorsThatIHave
export const findTheMultipliers = (
  colorList: string[],
  multipliers: number[],
  colorsThatIHave: string[]
) => {
  let result: number[] = [];
  colorsThatIHave.forEach((color) => {
    result.push(findTheMultiplier(colorList, multipliers, color));
  });
  return result;
};

export const generateMultiplierText = (numbers: number[]) => {
  return numbers.map((num) => `${num}x`);
};

export const findTheExpectedMultipliers = (
  predefinedPath: number[][],
  multipliers: number[]
) => {
  let result: number[] = [];
  predefinedPath.forEach((list) => {
    let count = 0;
    list.forEach((item) => {
      if (item === 1) {
        count++;
      }
    });
    result.push(count);
  });
  let expectedMultipliers: number[] = [];
  result.forEach((num) => {
    expectedMultipliers.push(multipliers[num]);
  });
  return expectedMultipliers;
};
