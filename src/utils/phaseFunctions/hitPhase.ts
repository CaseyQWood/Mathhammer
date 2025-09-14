import { rollD6, variableCalculator } from '../diceUtils';

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
  
  const hitRolls: number[] = [];

  if (modifiers.torrent) {
    successfulHits = baseAttacks
    return { successfulHits, lethalHits, extraAttacks, hitRolls }
  }

  // Process all attacks (base + sustained hits)
  for (let i = 0; i < baseAttacks; i++) {
    let toHitRoll = rollD6();
    hitRolls.push(toHitRoll);

    // Handle hit phase with rerolls - checks for failure and if failed ends the loop for that attack
      if (toHitRoll < weaponSkill) {
        if (modifiers.reRollOneToHit && toHitRoll === 1) {
          toHitRoll = rollD6();
          hitRolls.push(toHitRoll);
          if (toHitRoll < weaponSkill) {
            continue;
          }
        } else if (modifiers.reRollHit) {
          toHitRoll = rollD6();
          hitRolls.push(toHitRoll);
          if (toHitRoll < weaponSkill) {
            continue;
          }
        } else {
          continue;
        }

        
      }

      if ( toHitRoll === 6 ) {
        if (modifiers.lethalHits) {
          lethalHits++;
        }
        if (modifiers.sustainedHits.value) {
          const sustainedExtra = variableCalculator(modifiers.sustainedHits.variable);
          extraAttacks += sustainedExtra;
        }
      }

    // Count successful hit
    successfulHits++;
  }

  return { successfulHits, lethalHits, extraAttacks, hitRolls };
}