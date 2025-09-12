import { statCheck } from './statUtils';
import { rollD6 } from './diceUtils';

// Pure function: Determine if a save should be attempted
export function shouldAttemptSave(
  save: number,
  armourPiercing: number,
  invulnerable: number,
  devastatingWounds: boolean,
  toWoundRoll: number
): boolean {
  if (devastatingWounds && toWoundRoll === 6) {
    return false; // Devastating wounds bypass saves
  }
  
  if (save > 0 && save + armourPiercing <= 6) {
    return !(invulnerable && save + armourPiercing <= invulnerable);
  } else if (invulnerable > 0) {
    return true;
  }
  
  return false;
}

// Pure function: Determine which save to use (normal or invulnerable)
export function getSaveThreshold(
  save: number,
  armourPiercing: number,
  invulnerable: number
): number {
  if (save > 0 && save + armourPiercing <= 6) {
    if (invulnerable && save + armourPiercing <= invulnerable) {
      return invulnerable;
    }
    return save + armourPiercing;
  } else if (invulnerable > 0) {
    return invulnerable;
  }
  return 0;
}

// Pure function: Calculate damage after Feel No Pain
export function calculateDamageAfterFeelNoPain(
  attackDamage: number,
  feelNoPain: number
): number {
  if (feelNoPain === 0) {
    return attackDamage;
  }
  
  let totalDamage = 0;
  for (let i = 0; i < attackDamage; i++) {
    if (!statCheck(rollD6(), feelNoPain)) {
      totalDamage++;
    }
  }
  return totalDamage;
} 