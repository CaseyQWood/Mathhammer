import { rollD6, variableCalculator } from "../diceUtils";

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
  sustainedHits: number;
  hitRolls: number[];
  reRolls: number[];
} {
  let successfulHits = 0;
  let lethalHits = 0;
  let sustainedHits = 0;

  const hitRolls: number[] = [];
  const reRolls: number[] = [];

  if (modifiers.torrent) {
    successfulHits = baseAttacks;
    return { successfulHits, lethalHits, sustainedHits, hitRolls, reRolls };
  }

  // Process all attacks
  for (let i = 0; i < baseAttacks; i++) {
    let toHitRoll = rollD6();
    hitRolls.push(toHitRoll);

    // Handle hit phase with rerolls - checks for failure and if failed ends the loop for that attack
    if (toHitRoll < weaponSkill) {
      if (modifiers.reRollOneToHit && toHitRoll === 1) {
        toHitRoll = rollD6();
        reRolls.push(toHitRoll);
        if (toHitRoll < weaponSkill) {
          continue;
        }
      } else if (modifiers.reRollHit) {
        toHitRoll = rollD6();
        reRolls.push(toHitRoll);
        if (toHitRoll < weaponSkill) {
          continue;
        }
      } else {
        continue;
      }
    }

    // Criticals
    if (toHitRoll === 6) {
      if (modifiers.sustainedHits.value) {
        const sustainedExtra = variableCalculator(
          modifiers.sustainedHits.variable
        );
        sustainedHits += sustainedExtra;
        successfulHits++;
      }
      if (modifiers.lethalHits) {
        lethalHits++;
        continue;
      }
    }

    // Count successful hit
    successfulHits++;
  }

  return { successfulHits, lethalHits, sustainedHits, hitRolls, reRolls };
}
