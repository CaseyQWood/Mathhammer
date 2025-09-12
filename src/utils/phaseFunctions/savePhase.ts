import type { AttackStats, DefenseStats } from "../../types/unitStats";
import { rollD6 } from '../diceUtils';
import { statCheck } from '../statUtils';
import { shouldAttemptSave, getSaveThreshold } from '../damageUtils';

// Phase 3: Save Phase - Returns counts of wounds that need saves vs bypass saves
export function processSavePhase(
  successfulWounds: number,
  devastatingWounds: number,
  defenseStats: DefenseStats,
  attackStats: AttackStats,
  modifiers: {
    devastatingWounds: boolean;
  }
): {
  woundsNeedingSaves: number;
  woundsBypassingSaves: number;
} {
  let woundsNeedingSaves = 0;
  let woundsBypassingSaves = 0;

  // Devastating wounds bypass saves
  woundsBypassingSaves += devastatingWounds;

  // Regular wounds need saves
  const regularWounds = successfulWounds - devastatingWounds;
  for (let i = 0; i < regularWounds; i++) {
    if (shouldAttemptSave(
      defenseStats.save,
      attackStats.armourPiercing,
      defenseStats.invulnerable,
      modifiers.devastatingWounds,
      0 // Not used in shouldAttemptSave for regular wounds
    )) {
      const saveThreshold = getSaveThreshold(
        defenseStats.save,
        attackStats.armourPiercing,
        defenseStats.invulnerable
      );
      const toSaveRoll = rollD6();
      if (!statCheck(toSaveRoll, saveThreshold)) {
        woundsNeedingSaves++;
      }
    } else {
      woundsNeedingSaves++;
    }
  }

  return { woundsNeedingSaves, woundsBypassingSaves };
} 