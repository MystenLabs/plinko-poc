export const splitIntoPathsAndNormalize = (trace: number[]): number[][] => {
  const chunkSize = 12;
  let paths: number[][] = [];

  for (let i = 0; i < trace.length; i += chunkSize) {
    const chunk = trace
      .slice(i, i + chunkSize)
      .map((num) => (num % 2 === 0 ? 0 : 1));
    paths.push(chunk);
  }

  return paths;
};
