import type { AttackStats, DefenseStats, Modifiers } from "../types/unitStats";

function rollD6() {
  const min = 1;
  const max = 6;
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function rollD3() {
  const min = 1;
  const max = 3;
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function variableCalculator(variable: string) {
  switch (variable) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "3":
      return 3;
    case "D3":
      return rollD3();
    case "2D3":
      return rollD3() + rollD3();
    case "3D3":
      return rollD3() + rollD3() + rollD3();
    case "D6":
      return rollD6();
    case "2D6":
      return rollD6() + rollD6();
    case "3D6":
      return rollD6() + rollD6() + rollD6();
    default:
      return 0;
  }
}

// Why do I have this ?
function statCheck(value: number, passingThreshold: number): boolean {
  if (value < passingThreshold) {
    return false;
  }
  return true;
}

// Calculates attacks for 1 model
export async function calculateAttack(
  attackStats: AttackStats,
  defenseStats: DefenseStats,
  modifiers: Modifiers
): Promise<number> {
  let finalDamage = 0;

  const weaponSkill = attackStats.weaponSkill;
  const strength = attackStats.strength;
  const toughness = defenseStats.toughness;
  const save = defenseStats.save;
  const armourPiercing = attackStats.armourPiercing;
  const invulnerable = defenseStats.invulnerable;
  const feelNoPain = defenseStats.feelNoPain;

  const lethalHits = modifiers.lethalHits;
  const sustainedHits = modifiers.sustainedHits;
  const devistatingWounds = modifiers.devistatingWounds;

  const torrent = modifiers.torrent;
  const reRollWounds = modifiers.reRollWound;
  const reRollOneToWound = modifiers.reRollOneToWound;
  const reRollHits = modifiers.reRollHit;
  const reRollOneToHit = modifiers.reRollOneToHit;

  const baseAttacks =
    attackStats.attacks.value +
    variableCalculator(attackStats.attacks.variable);

  let attacks = baseAttacks;

  for (let i = 0; i < attacks; i++) {
    let toHitRoll = rollD6();
    if (!torrent) {
      if (!statCheck(toHitRoll, weaponSkill)) {
        if (reRollOneToHit && toHitRoll === 1) {
          toHitRoll = rollD6();
          if (!statCheck(toHitRoll, weaponSkill)) {
            continue;
          }
        } else if (reRollHits) {
          toHitRoll = rollD6();
          if (!statCheck(toHitRoll, weaponSkill)) {
            continue;
          }
        } else {
          continue;
        }
      }
    }

    if (sustainedHits.value && toHitRoll === 6 && i < baseAttacks) {
      const test = variableCalculator(sustainedHits.variable);
      attacks = attacks + test;
    }

    const toWound =
      strength === toughness
        ? 4
        : strength === toughness - 1
          ? 5
          : strength === toughness + 1
            ? 3
            : strength >= toughness * 2
              ? 2
              : strength <= toughness / 2
                ? 6
                : 0;

    let toWoundRoll = rollD6();
    if (!(lethalHits && toHitRoll === 6)) {
      if (toWoundRoll < toWound) {
        if (reRollOneToWound && toWoundRoll === 1) {
          toWoundRoll = rollD6();
          if (toWoundRoll < toWound) {
            continue;
          }
        }
        if (reRollWounds) {
          toWoundRoll = rollD6();
          if (toWoundRoll < toWound) {
            continue;
          }
        } else {
          continue;
        }
      }
    }

    if (!(devistatingWounds && toWoundRoll === 6)) {
      if (
        save > 0 &&
        save + armourPiercing <= 6 &&
        !(invulnerable && save + armourPiercing <= invulnerable)
      ) {
        const toSaveRoll = rollD6();
        if (statCheck(toSaveRoll, save + armourPiercing)) {
          continue;
        }
      } else if (invulnerable > 0) {
        const toInvulnerableSave = rollD6();
        if (statCheck(toInvulnerableSave, invulnerable)) {
          continue;
        }
      }
    }

    const attackDamage =
      attackStats.damage.value +
      variableCalculator(attackStats.damage.variable);

    if (feelNoPain) {
      let totalDamage: number = 0;
      for (let i = 0; i < attackDamage; i++) {
        if (statCheck(rollD6(), feelNoPain)) {
          continue;
        }
        totalDamage++;
      }
      finalDamage = finalDamage + totalDamage;
      continue;
    }
    finalDamage = finalDamage + attackDamage;
  }
  return finalDamage;
}
