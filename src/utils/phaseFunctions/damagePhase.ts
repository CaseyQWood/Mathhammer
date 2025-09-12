import type { AttackStats, DefenseStats } from "../../types/unitStats";
import { calculateAttackDamage } from '../statUtils';
import { calculateDamageAfterFeelNoPain } from '../damageUtils';

// Phase 4: Damage Phase - Returns final damage
export function processDamagePhase(
  woundsNeedingSaves: number,
  woundsBypassingSaves: number,
  attackStats: AttackStats,
  defenseStats: DefenseStats
): number {
  const attackDamage = calculateAttackDamage(attackStats.damage);
  let totalDamage = 0;

  // Calculate damage for wounds that need saves
  for (let i = 0; i < woundsNeedingSaves; i++) {
    const finalDamage = calculateDamageAfterFeelNoPain(attackDamage, defenseStats.feelNoPain);
    totalDamage += finalDamage;
  }

  // Calculate damage for wounds that bypass saves (devastating wounds)
  for (let i = 0; i < woundsBypassingSaves; i++) {
    const finalDamage = calculateDamageAfterFeelNoPain(attackDamage, defenseStats.feelNoPain);
    totalDamage += finalDamage;
  }

  return totalDamage;
} 