import type { AttackStats, DefenseStats, Modifiers } from "../types/unitStats";
import { calculateBaseAttacks } from './statUtils';
// import { processHitPhase, processWoundPhase, processSavePhase, processDamagePhase } from './phaseUtils';
import { processHitPhase } from './phaseFunctions/hitPhase';
import { processWoundPhase } from './phaseFunctions/woundPhase';
import { processSavePhase } from './phaseFunctions/savePhase';
import { processDamagePhase } from './phaseFunctions/damagePhase';

// Main orchestration function using count-based phases
export async function calculateAttack(
  attackStats: AttackStats,
  defenseStats: DefenseStats,
  modifiers: Modifiers
): Promise<number> {
  // Phase 1: Hit Phase
  const hitResult = processHitPhase(
    calculateBaseAttacks(attackStats.attacks),
    attackStats.weaponSkill,
    {
      torrent: modifiers.torrent,
      reRollHit: modifiers.reRollHit,
      reRollOneToHit: modifiers.reRollOneToHit,
      sustainedHits: modifiers.sustainedHits,
      lethalHits: modifiers.lethalHits,
    }
  );

  console.log('hitResult', hitResult);

  // Phase 2: Wound Phase
  const woundResult = processWoundPhase(
    hitResult.successfulHits,
    hitResult.lethalHits,
    attackStats.strength,
    defenseStats.toughness,
    {
      lethalHits: modifiers.lethalHits,
      reRollWound: modifiers.reRollWound,
      reRollOneToWound: modifiers.reRollOneToWound,
      devastatingWounds: modifiers.devastatingWounds,
    }
  );

  console.log('woundResult', woundResult);

  // Phase 3: Save Phase
  const saveResult = processSavePhase(
    woundResult.successfulWounds,
    woundResult.devastatingWounds,
    defenseStats,
    attackStats,
    {
      devastatingWounds: modifiers.devastatingWounds,
    }
  );

  console.log('saveResult', saveResult);

  // Phase 4: Damage Phase
  const damageResult = processDamagePhase(
    saveResult.woundsNeedingSaves,
    saveResult.woundsBypassingSaves,
    attackStats,
    defenseStats
  );

  console.log('damageResult', damageResult);

  return damageResult;
}

// Re-export commonly used functions for backward compatibility
export { calculateToWoundThreshold } from './statUtils';
export { variableCalculator } from './diceUtils';
