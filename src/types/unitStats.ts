export interface AttackStats {
  models: number;
  attacks: { variable: string; value: number };
  weaponSkill: number;
  strength: number;
  armourPiercing: number;
  damage: { variable: string; value: number };
}

export interface DefenseStats {
  toughness: number;
  save: number;
  invulnerable: number;
  feelNoPain: number;
}

export type WoundTallies = Record<number, number>;
