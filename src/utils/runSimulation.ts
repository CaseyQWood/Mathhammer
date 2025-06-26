import { calculateAttack } from "./calculateAttack";
import type { AttackStats, DefenseStats, Modifiers } from "../types/unitStats";

type WoundTallies = Record<number, number>;

function sumArray(arr: number[]) {
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum;
}
export async function runSimulation(
  iterations: number,
  attackStats: AttackStats[],
  defenseStats: DefenseStats,
  modifiers: Modifiers[]
): Promise<WoundTallies> {
  // creates an array of promises the length of model count for each unit type
  // sums all the damage from each modelType and adds to unitDamage

  const results: number[] = [];
  for (let i = 0; i < iterations; i++) {
    let unitDamage: number = 0;
    // runs calculations for each modelType
    for (let i = 0; i < attackStats.length; i++) {
      const modelAttacks = Array.from({ length: attackStats[i].models }, () =>
        calculateAttack(attackStats[i], defenseStats, modifiers[i])
      );
      await Promise.all(modelAttacks).then((modelDamage) => {
        unitDamage = unitDamage + sumArray(modelDamage);
      });
    }

    results.push(unitDamage);
  }

  // Creates a object with keys set as the wound amount and the key as the amount of cases it happened
  const aggrigatedObject: WoundTallies = {};
  for (let i = 0; i < results.length; i++) {
    if (!aggrigatedObject[results[i]]) {
      aggrigatedObject[results[i]] = 0;
    }

    if (aggrigatedObject[results[i]] >= 0) {
      aggrigatedObject[results[i]]++;
    }
  }

  // convert the values of object to percentages
  const percentObject: WoundTallies = {};
  for (const [key, value] of Object.entries(aggrigatedObject)) {
    percentObject[Number(key)] = Number(
      ((value / iterations) * 100).toFixed(1)
    );
  }
  // console.log("percent Object: ", percentObject);
  return percentObject;
}
