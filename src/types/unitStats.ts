export interface AttackStats {
  models: number;
  attacks: { variable: string; value: number };
  weaponSkill: number;
  strength: number;
  armourPiercing: number;
  damage: { variable: string; value: number };
}

export interface Modifiers {
  lethalHits: boolean;
  sustainedHits: { value: boolean; variable: string };
  devastatingWounds: boolean;
  torrent: boolean;
  reRollHit: boolean;
  reRollOneToHit: boolean;
  reRollWound: boolean;
  reRollOneToWound: boolean;
}

export interface AttackProfile {
  id: string;
  attackStats: AttackStats;
  modifiers: Modifiers;
}

export interface DefenseStats {
  toughness: number;
  save: number;
  invulnerable: number;
  feelNoPain: number;
}

export type WoundTallies = Record<number, number>;
