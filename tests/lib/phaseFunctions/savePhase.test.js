import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/diceUtils", () => ({
  rollD6: vi.fn(),
  variableCalculator: vi.fn(),
}));
vi.mock("@/lib/damageUtils", () => ({
  getSaveThreshold: vi.fn(),
}));

import { rollD6, variableCalculator } from "@/lib/diceUtils";
import { getSaveThreshold } from "@/lib/damageUtils";
import { processSavePhase } from "@/lib/phaseFunctions/savePhase";

const mockRollSequence = (values) => {
  let i = 0;
  rollD6.mockImplementation(() => values[i++]);
};

const baseDefense = {
  toughness: 4,
  save: 3,
  invulnerable: 4,
  feelNoPain: 0,
};

const baseAttack = {
  models: 1,
  attacks: { variable: "0", value: 1 },
  weaponSkill: 3,
  strength: 4,
  armourPiercing: 1,
  damage: { variable: "0", value: 1 },
};

beforeEach(() => vi.clearAllMocks());

describe("processSavePhase", () => {
  // 1️⃣ Basic save roll
  it("processes standard armor saves correctly", () => {
    mockRollSequence([2, 5, 3, 1]);
    getSaveThreshold.mockReturnValue(3);
    variableCalculator.mockReturnValue(0);
    const result = processSavePhase(4, 0, baseDefense, baseAttack);
    expect(result.wounds).toBe(2); // 2 rolls < 3 fail
    expect(result.diceRolls).toEqual([2, 5, 3, 1]);
  });

  // 2️⃣ Applies armor piercing modifiers
  it("applies armor piercing modifier", () => {
    mockRollSequence([5, 3, 2]);
    getSaveThreshold.mockReturnValue(4); // Save 3+, AP1 → 4+
    const result = processSavePhase(3, 0, baseDefense, {
      ...baseAttack,
      armourPiercing: 1,
    });
    expect(result.wounds).toBe(2); // Only 5 passes
    expect(getSaveThreshold).toHaveBeenCalledWith(3, 1, 4);
  });

  // 3️⃣ Chooses invulnerable if better
  it("uses invulnerable save when better than armor save", () => {
    const invulnDefense = { ...baseDefense, save: 5, invulnerable: 4 };
    mockRollSequence([4, 2, 6]);
    getSaveThreshold.mockReturnValue(4);
    const result = processSavePhase(3, 0, invulnDefense, baseAttack);
    expect(result.wounds).toBe(1); // Only 4+ passes
  });

  // 4️⃣ Edge case: cannot save (threshold >6)
  it("handles unsavable AP case", () => {
    mockRollSequence([1, 2]);
    getSaveThreshold.mockReturnValue(7);
    variableCalculator.mockReturnValue(0);
    const attack = { ...baseAttack, armourPiercing: 5 };
    const result = processSavePhase(2, 0, baseDefense, attack);
    expect(result.wounds).toBe(2); // All go through
    expect(result.diceRolls).toEqual([]); // no rolls
  });

  // 5️⃣ Feel No Pain after failed saves
  it("applies Feel No Pain 4+ correctly", () => {
    const fnpDefense = { ...baseDefense, feelNoPain: 4 };
    mockRollSequence([2, 1, 5, 3, 4]); // 3 save rolls + 2 FNP
    getSaveThreshold.mockReturnValue(3);
    const result = processSavePhase(3, 0, fnpDefense, baseAttack);
    expect(result.wounds).toBeGreaterThan(0);
    expect(result.feelNoPainRolls.length).toBeGreaterThan(0);
  });

  // 6️⃣ FNP with variable damage (D3)
  it("applies FNP for variable damage (D3)", () => {
    const fnpDefense = { ...baseDefense, feelNoPain: 4 };
    const variableAttack = {
      ...baseAttack,
      damage: { variable: "D3", value: 0 },
    };
    mockRollSequence([1, 1, 2, 3]);
    getSaveThreshold.mockReturnValue(3);
    variableCalculator.mockReturnValue(2); // D3 = 2
    const result = processSavePhase(1, 0, fnpDefense, variableAttack);
    expect(result.wounds).toBe(2); // 2 damage through FNP
    expect(result.feelNoPainRolls.length).toBe(2);
  });

  // 7️⃣ Devastating wounds bypass saves
  it("processes devastating wounds directly to FNP", () => {
    const fnpDefense = { ...baseDefense, feelNoPain: 4 };
    mockRollSequence([2, 5, 1]);
    getSaveThreshold.mockReturnValue(7); // unsavable
    variableCalculator.mockReturnValue(0);

    const result = processSavePhase(0, 3, fnpDefense, baseAttack);
    expect(result.diceRolls).toEqual([]); // skip saves
    expect(result.feelNoPainRolls.length).toBe(3);
  });

  // 8️⃣ Mixed regular + devastating wounds
  it("handles mixed regular and devastating wounds", () => {
    const fnpDefense = { ...baseDefense, feelNoPain: 4 };
    mockRollSequence([4, 2, 5, 2]);
    getSaveThreshold.mockReturnValue(3);
    variableCalculator.mockReturnValue(0);
    const result = processSavePhase(2, 1, fnpDefense, baseAttack);
    expect(result.wounds).toBeGreaterThan(0);
    expect(result.feelNoPainRolls.length).toBeGreaterThan(0);
  });

  // 9️⃣ Edge case: zero wounds input
  it("handles zero wounds cleanly", () => {
    const result = processSavePhase(0, 0, baseDefense, baseAttack);
    expect(result.wounds).toBe(0);
    expect(result.diceRolls).toEqual([]);
  });
});
