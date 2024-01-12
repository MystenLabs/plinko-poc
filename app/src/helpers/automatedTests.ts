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

//I need to make a function that will take the MultiplierHistory as number[] , the predifienedPath as number[][] that got the 0 and 1 and the multipliers as number[]
//then i want to calculate how many 1 got in each list of the predifienedPath and make a matrix that was number [] and got the number of 1 in each list
// then i want to take this new matrix and find the multiplier for each list (take the number from the same index from the multipliers ) and made a new number[] that got the expected multipliers
// then i want to check if the MultiplierHistory is the same as the expected multipliers and return true or false
// i want to return a matrix that got this boolean values
//dont use anything from above

export const checkIfTheMultipliersAreCorrect = (
  multiplierHistory: number[],
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
  return multiplierHistory === expectedMultipliers;
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
