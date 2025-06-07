import type { AttackStats, DefenseStats } from "../types/unitStats";

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

function statCheck(value: number, passingThreshold: number): boolean {
  if (value < passingThreshold) {
    return false;
  }
  return true;
}

export async function calculateAttack(
  attackStats: AttackStats,
  defenseStats: DefenseStats
): Promise<number> {
  const attackDamage =
    attackStats.damage +
    Number(
      attackStats.variableDamage === 0
        ? 0
        : attackStats.variableDamage === 6
          ? rollD6()
          : rollD3()
    );

  // To hit
  if (!statCheck(rollD6(), attackStats.weaponSkill)) {
    return 0;
  }

  // To wound
  /*
  if stats match 4+
  if strength higher 3 +
  if strength lower 5+
  if strength double 2+
  if toughness double 6+
  */
  const toWound =
    attackStats.strength === defenseStats.toughness
      ? 4
      : attackStats.strength === defenseStats.toughness - 1
        ? 5
        : attackStats.strength === defenseStats.toughness + 1
          ? 3
          : attackStats.strength >= defenseStats.toughness
            ? 2
            : attackStats.strength <= defenseStats.toughness
              ? 6
              : 0;

  if (rollD6() < toWound) {
    return 0;
  }

  // To invulnerable or armour save
  if (
    defenseStats.save > 0 &&
    defenseStats.save + attackStats.armourPiercing <= 6 &&
    !(
      defenseStats.invulnerable &&
      defenseStats.save + attackStats.armourPiercing <=
        defenseStats.invulnerable
    )
  ) {
    // armour save
    if (statCheck(rollD6(), defenseStats.save + attackStats.armourPiercing)) {
      return 0;
    }
  } else if (defenseStats.invulnerable > 0) {
    //invulnerable save
    if (statCheck(rollD6(), defenseStats.invulnerable)) {
      return 0;
    }
  }

  // Feel no pain
  if (defenseStats.feelNoPain) {
    let totalDamage: number = 0;
    for (let i = 0; i < attackDamage; i++) {
      if (statCheck(rollD6(), defenseStats.feelNoPain)) {
        totalDamage++;
      }
    }
    return totalDamage;
  }

  // Successful attack
  return attackDamage;
}
