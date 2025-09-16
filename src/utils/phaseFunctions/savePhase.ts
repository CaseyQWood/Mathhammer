import type { AttackStats, DefenseStats } from "../../types/unitStats";
import { rollD6, variableCalculator } from '../diceUtils';
import { getSaveThreshold } from '../damageUtils';

// Phase 3: Save Phase - Returns counts of wounds that need saves vs bypass saves
export function processSavePhase(
  successfulHits: number,
  devastatingHits: number,
  defenseStats: DefenseStats,
  attackStats: AttackStats,
): {
  wounds: number,
  diceRolls: number[]
} {
  let totalFailedSaves = 0;
  let wounds = 0
  const diceRolls: number[] = []

  if (successfulHits <= 0 && devastatingHits <= 0) return  { wounds, diceRolls }


  // Regular wounds need saves
  for (let i = 0; i < successfulHits; i++) {
    const saveThreshold = getSaveThreshold(
      defenseStats.save,
      attackStats.armourPiercing,
      defenseStats.invulnerable
    )

    if (saveThreshold != 0 || saveThreshold > 6) {
      const toSaveRoll = rollD6();
      diceRolls.push(toSaveRoll)
      if (toSaveRoll < saveThreshold) {
        totalFailedSaves++;
      }
    } else {
      continue;
    }
  }

  const woundTotal = (totalFailedSaves + devastatingHits) * (variableCalculator(attackStats.damage.variable) + attackStats.damage.value)

  if (defenseStats.feelNoPain === 0) {
    return { 
      wounds: woundTotal * (variableCalculator(attackStats.damage.variable) + attackStats.damage.value) , 
      diceRolls 
    }
  }

  
  for (let i = 0; i < woundTotal; i++) {
    const saveRoll = rollD6()
    diceRolls.push(saveRoll)
    if (saveRoll < defenseStats.feelNoPain) {
      wounds++
    }
  } 
  return { wounds, diceRolls } ;
} 