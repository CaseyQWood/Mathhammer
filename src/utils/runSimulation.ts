import { calculateAttack } from "./caclulateAttack";
import type { AttackStats, DefenseStats } from "../types/unitStats";

type WoundTallies = Record<number, number>;

export async function runSimulation(
  iterations: number,
  attackStats: AttackStats,
  defenseStats: DefenseStats
): Promise<WoundTallies> {
  // a series of runs where each case creates an array of promises the length of model count
  // filters out all cases of no wounds
  // captures results into a matrix
  const results: number[][] = [];
  for (let i = 0; i < iterations; i++) {
    const newAttacks = Array.from({ length: attackStats.models }, () =>
      calculateAttack(attackStats, defenseStats)
    );
    await Promise.all(newAttacks).then((values) => {
      const filterResults = values.filter((wound) => wound != 0);
      results.push(filterResults);
    });
  }

  console.log("results: ", results);

  // Sums the wounds from each iteration to form a single array
  const resultsArray: number[] = [];
  for (let i = 0; i < results.length; i++) {
    let totalWounds = 0;
    for (let a = 0; a < results[i].length; a++) {
      totalWounds = totalWounds + results[i][a];
    }
    resultsArray.push(totalWounds);
  }

  console.log("results array: ", resultsArray);

  // Creates a object with keys set as the wound amount and the key as the amount of cases it happened
  const aggrigatedObject: WoundTallies = {};
  for (let i = 0; i < resultsArray.length; i++) {
    if (!aggrigatedObject[resultsArray[i]]) {
      aggrigatedObject[resultsArray[i]] = 0;
    }

    if (aggrigatedObject[resultsArray[i]] >= 0) {
      aggrigatedObject[resultsArray[i]]++;
    }
  }

  console.log("aggrigrated Object: ", aggrigatedObject);
  // convert the values of object to percentages
  const percentObject: WoundTallies = {};
  for (const [key, value] of Object.entries(aggrigatedObject)) {
    percentObject[Number(key)] = Number(
      ((value / iterations) * 100).toFixed(1)
    );
  }
  console.log("percent Object: ", percentObject);
  return percentObject;
}
