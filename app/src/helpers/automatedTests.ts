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
