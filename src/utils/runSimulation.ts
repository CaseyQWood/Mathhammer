import { calculateAttack } from "./caclulateAttack";
import type { AttackStats, DefenseStats } from "../types/unitStats";

type WoundTallies = Record<number, number>;

export async function runSimulation(
  iterations: number,
  attackStats: AttackStats,
  defenseStats: DefenseStats
): Promise<WoundTallies> {
  const results: number[][] = [];
  for (let i = 0; i < iterations; i++) {
    const newAttacks = Array.from({ length: attackStats.attacks }, () =>
      calculateAttack(attackStats, defenseStats)
    );
    await Promise.all(newAttacks).then((values) => {
      const filterResults = values.filter((wound) => wound === 1);
      results.push(filterResults);
    });
  }

  const resultsArray: number[] = [];
  for (let i = 0; i < results.length; i++) {
    let totalWounds = 0;
    for (let a = 0; a < results[i].length; a++) {
      totalWounds = totalWounds + results[i][a];
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
  const percentObject: WoundTallies = {};
  for (const [key, value] of Object.entries(aggrigatedObject)) {
    percentObject[Number(key)] = Number(
      ((value / iterations) * 100).toFixed(1)
    );
  }
  return percentObject;
}
