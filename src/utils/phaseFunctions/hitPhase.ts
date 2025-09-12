import { rollD6, variableCalculator } from '../diceUtils';
import { statCheck } from '../statUtils';

// Phase 1: Hit Phase - Returns counts of successful hits and lethal hits
export function processHitPhase(
  baseAttacks: number,
  weaponSkill: number,
  modifiers: {
    torrent: boolean;
    reRollHit: boolean;
    reRollOneToHit: boolean;
    sustainedHits: { value: boolean; variable: string };
    lethalHits: boolean;
  }
): {
  successfulHits: number;
  lethalHits: number;
  extraAttacks: number;
  hitRolls: number[];
} {
  let successfulHits = 0;
  let lethalHits = 0;
  let extraAttacks = 0;
  let totalAttacks = baseAttacks;
  
  const hitRolls: number[] = [];

  // Process all attacks (base + sustained hits)
  for (let i = 0; i < totalAttacks; i++) {
    let toHitRoll = rollD6();
    hitRolls.push(toHitRoll);

    // Handle hit phase with rerolls - checks for failure and if failed ends the loop for that attack
    if (!modifiers.torrent) {
      if (!statCheck(toHitRoll, weaponSkill)) {
        if (modifiers.reRollOneToHit && toHitRoll === 1) {
          toHitRoll = rollD6();
          hitRolls.push(toHitRoll);
          if (!statCheck(toHitRoll, weaponSkill)) {
            continue;
          }
        } else if (modifiers.reRollHit) {
          toHitRoll = rollD6();
          hitRolls.push(toHitRoll);
          if (!statCheck(toHitRoll, weaponSkill)) {
            continue;
          }
        } else {
          continue;
        }
      }

      // Check for lethal hits
      if (modifiers.lethalHits && toHitRoll === 6) {
        lethalHits++;
      }

      // Handle sustained hits (only for base attacks)

      if (modifiers.sustainedHits.value && toHitRoll === 6 && i < baseAttacks) {
        const sustainedExtra = variableCalculator(modifiers.sustainedHits.variable);
        extraAttacks += sustainedExtra;
        totalAttacks += sustainedExtra;
      }
    }

    // Count successful hit
    successfulHits++;
  }

  return { successfulHits, lethalHits, extraAttacks, hitRolls };
}