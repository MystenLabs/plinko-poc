//i will take a list of strings and a list of numbers and i  want to take also a string
// then i will check when the string finds on the list of strings for the first time
//and i will return the number from the list of numbers that has the same index as the string on the list of strings

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

export const checkIfTheMultipliersAreCorrect = async (
  multiplierHistory: number[],
  predefinedPath: number[][],
  multipliers: number[]
) => {
  const test = async () => {
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
    return multiplierHistory === expectedMultipliers;
  };
  await test();
};

//Make a function that returns the expexted multipliers
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

//Create rundom paths for 30 balls
// const predefinedPaths: number[][] = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0],
//   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Example path for the second ball
//   [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
//   [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
//   [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
//   [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Example path for the second ball
//   [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
//   [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0],
//   [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
// ];
// the paths looks like this and each list of 0 and 1 is a path for a ball

export const generateRandomPaths = (numberOfBalls: number) => {
  let result: number[][] = [];
  for (let i = 0; i < numberOfBalls; i++) {
    let list: number[] = [];
    for (let j = 0; j < 12; j++) {
      list.push(Math.round(Math.random()));
    }
    result.push(list);
  }
  return result;
};

//Also i want to take a list of the list of 0 and 1 and i want to find how many 1 got in each list and return a list of the numbers of 1 in each list

// export const findTheNumberOfOnes = (listOfLists: number[][]) => {
//   let result: number[] = [];
//   listOfLists.forEach((list) => {
//     let count = 0;
//     list.forEach((item) => {
//       if (item === 1) {
//         count++;
//       }
//     });
//     result.push(count);
//   });
//   return result;
// }
