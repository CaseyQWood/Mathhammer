import { rollD6 } from '../diceUtils';
import { calculateToWoundThreshold } from '../statUtils';

// Phase 2: Wound Phase - Returns counts of successful wounds and devastating wounds
export function processWoundPhase(
  successfulHits: number,
  lethalHits: number,
  strength: number,
  toughness: number,
  modifiers: {
    lethalHits: boolean;
    reRollWound: boolean;
    reRollOneToWound: boolean;
    devastatingWounds: boolean;
  }
): {
  successfulWounds: number;
  devastatingWounds: number;
  diceRolls: number[];
} {
  const toWound = calculateToWoundThreshold(strength, toughness);
  let successfulWounds = 0;
  let devastatingWounds = 0;
  const diceRolls = []
  // Process regular hits (non-lethal)
  for (let i = 0; i < successfulHits; i++) {
    let toWoundRoll = rollD6();
    diceRolls.push(toWoundRoll)

    // Handle wound phase with rerolls
    if (toWoundRoll < toWound) {
      if (modifiers.reRollOneToWound && toWoundRoll === 1) {
        toWoundRoll = rollD6();
        diceRolls.push(toWoundRoll)
        if (toWoundRoll < toWound) {
          continue;
        }
      } else if (modifiers.reRollWound) {
        toWoundRoll = rollD6();
        diceRolls.push(toWoundRoll)
        if (toWoundRoll < toWound) {
          continue;
        }
      } else {
        continue;
      }
    }

    // Check for devastating wounds
    if (modifiers.devastatingWounds && toWoundRoll === 6) {
      devastatingWounds++;
      continue;
    }

    // Count successful wound
    successfulWounds++;

 
  }
  // Lethal hits auto-wound
  successfulWounds += lethalHits;

  return { successfulWounds, devastatingWounds, diceRolls };
} 