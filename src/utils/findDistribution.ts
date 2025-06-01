type WoundTallies = Record<number, number>;

export function findDistribution(matrix: number[][]) {
  const resultsArray: number[] = [];
  for (let i = 0; i < matrix.length; i++) {
    let totalWounds = 0;
    for (let a = 0; a < matrix[i].length; a++) {
      totalWounds = totalWounds + matrix[i][a];
    }
    resultsArray.push(totalWounds);
  }

  const aggrigatedObject: WoundTallies = {};
  for (let i = 0; i < resultsArray.length; i++) {
    if (!aggrigatedObject[resultsArray[i]]) {
      aggrigatedObject[resultsArray[i]] = 0;
    }

    if (aggrigatedObject[resultsArray[i]] >= 0) {
      aggrigatedObject[resultsArray[i]]++;
    }
  }
  for (const [key, value] of Object.entries(aggrigatedObject)) {
    console.log(
      `Wounds: ${key} Percent: ${((value / 50000) * 100).toFixed(1)}%`
    );
  }
  return aggrigatedObject;
}
