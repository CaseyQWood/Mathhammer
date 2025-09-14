import type { AttackStats, DefenseStats } from "../../types/unitStats";
import { rollD6, variableCalculator } from '../diceUtils';
import { getSaveThreshold } from '../damageUtils';

// Phase 3: Save Phase - Returns counts of wounds that need saves vs bypass saves
export function processSavePhase(
  successfulWounds: number,
  devastatingWounds: number,
  defenseStats: DefenseStats,
  attackStats: AttackStats,
): number {
  let totalWounds = 0;


  // Regular wounds need saves
  for (let i = 0; i < successfulWounds; i++) {
    const saveThreshold = getSaveThreshold(
      defenseStats.save,
      attackStats.armourPiercing,
      defenseStats.invulnerable
    )

    if (saveThreshold != 0) {
      const toSaveRoll = rollD6();
      if (toSaveRoll >= saveThreshold) {
        totalWounds++;
      }
    } else {
      continue;
    }
  }


  totalWounds += (devastatingWounds * variableCalculator(attackStats.damage.variable))
  let wounds = 0

  for (let i = 0; i < totalWounds; i++) {
    const saveRoll = rollD6()
    if (saveRoll < defenseStats.feelNoPain) {
      wounds++
    }
    continue
    
  }


  return wounds ;
} 