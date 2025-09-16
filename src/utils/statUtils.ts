import { variableCalculator } from './calculateAttack';

// Pure function: Calculate wound threshold based on strength vs toughness
export function calculateToWoundThreshold(strength: number, toughness: number): number {
  if (strength === toughness) {
    return 4;
  } else if (strength === toughness - 1) {
    return 5;
  } else if (strength === toughness + 1) {
    return 3;
  } else if (strength >= toughness * 2) {
    return 2;
  } else if (strength <= toughness / 2) {
    return 6;
  } else {
    return 0;
  }
}

// Pure function: Calculate base attacks (without sustained hits)
export function calculateBaseAttacks(attacks: { value: number; variable: string }): number {
  return attacks.value + variableCalculator(attacks.variable);
}

// Pure function: Calculate attack damage
export function calculateAttackDamage(damage: { value: number; variable: string }): number {
  return damage.value + variableCalculator(damage.variable);
}

// Pure function: Calculate sustained hits extra attacks
export function calculateSustainedHitsExtra(
  sustainedHits: { value: boolean; variable: string },
  toHitRoll: number,
  currentAttackIndex: number,
  baseAttacks: number
): number {
  if (sustainedHits.value && toHitRoll === 6 && currentAttackIndex < baseAttacks) {
    return variableCalculator(sustainedHits.variable);
  }
  return 0;
} 