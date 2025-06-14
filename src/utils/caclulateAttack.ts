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

function statCheck(value: number, passingThreshold: number): boolean {
  if (value < passingThreshold) {
    return false;
  }
  return true;
}

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

  let attacks =
    attackStats.attacks.value +
    Number(
      attackStats.attacks.variable === "0"
        ? 0
        : attackStats.attacks.variable === "D6"
          ? rollD6()
          : rollD3()
    );
  for (let i = 0; i < attacks; i++) {
    let toHitRoll = rollD6();
    // console.log("to hit roll: ", toHitRoll);
    if (!torrent) {
      if (!statCheck(toHitRoll, weaponSkill)) {
        if (reRollOneToHit && toHitRoll === 1) {
          toHitRoll = rollD6();
          // console.log("reroll 1 : New roll", toHitRoll);

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

    if (sustainedHits.value && toHitRoll === 6) {
      attacks = attacks + Number(sustainedHits.variable);
    }

    const toWound =
      strength === toughness
        ? 4
        : strength === toughness - 1
          ? 5
          : strength === toughness + 1
            ? 3
            : strength >= toughness
              ? 2
              : strength <= toughness
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
      Number(
        attackStats.damage.variable === "0"
          ? 0
          : attackStats.damage.variable === "D6"
            ? rollD6()
            : rollD3()
      );

    if (feelNoPain) {
      let totalDamage: number = 0;
      for (let i = 0; i < attackDamage; i++) {
        if (statCheck(rollD6(), feelNoPain)) {
          totalDamage++;
        }
      }
      finalDamage = finalDamage + totalDamage;
      continue;
    }
    finalDamage = finalDamage + attackDamage;
  }

  // console.log("attack damage: ", finalDamage);

  return finalDamage;
}
