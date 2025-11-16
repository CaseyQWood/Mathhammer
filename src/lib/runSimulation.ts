import { calculateAttack } from "./calculateAttack";
import type { AttackProfile, DefenseStats } from "@/types/unitStats";

type WoundTallies = Record<number, number>;

function sumArray(arr: number[]) {
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum;
}

export async function runSimulation(
  iterations: number,
  attackProfiles: AttackProfile[],
  defenseStats: DefenseStats
): Promise<WoundTallies> {
  // creates an array of promises the length of model count for each unit type
  // sums all the damage from each modelType and adds to unitDamage
  const results: number[] = [];
  for (let i = 0; i < iterations; i++) {
    let unitDamage: number = 0;
    // runs calculations for each modelType
    for (let j = 0; j < attackProfiles.length; j++) {
      const profile = attackProfiles[j];
      const modelAttacks = Array.from(
        { length: profile.attackStats.models },
        () =>
          calculateAttack(profile.attackStats, defenseStats, profile.modifiers)
      );
      await Promise.all(modelAttacks).then((modelDamage) => {
        unitDamage = unitDamage + sumArray(modelDamage);
      });
    }

    results.push(unitDamage);
  }

  // Creates a object with keys set as the wound amount and the key as the amount of cases it happened
  const aggregatedObject: WoundTallies = {};
  for (let i = 0; i < results.length; i++) {
    if (!aggregatedObject[results[i]]) {
      aggregatedObject[results[i]] = 0;
    }

    if (aggregatedObject[results[i]] >= 0) {
      aggregatedObject[results[i]]++;
    }
  }

  // convert the values of object to percentages
  const percentObject: WoundTallies = {};
  for (const [key, value] of Object.entries(aggregatedObject)) {
    percentObject[Number(key)] = Number(
      ((value / iterations) * 100).toFixed(1)
    );
  }
  return percentObject;
}
