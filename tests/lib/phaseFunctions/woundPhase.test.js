import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";

vi.mock("@/lib/diceUtils", () => ({ rollD6: vi.fn() }));
vi.mock("@/lib/statUtils", () => ({ calculateToWoundThreshold: vi.fn() }));

import { rollD6 } from "@/lib/diceUtils";
import { calculateToWoundThreshold as mockCalcThreshold } from "@/lib/statUtils";
import { processWoundPhase } from "@/lib/phaseFunctions/woundPhase";

const mockRollSequence = (values) => {
  let i = 0;
  rollD6.mockImplementation(() => values[i++]);
};

const baseOpts = {
  lethalHits: false,
  reRollWound: false,
  reRollOneToWound: false,
  devastatingWounds: false,
};

beforeEach(() => vi.clearAllMocks());

describe("processWoundPhase (minimal)", () => {
  // 1️⃣ Core threshold function — covers all comparison logic
  describe("calculateToWoundThreshold", () => {
    let calc;
    beforeAll(async () => {
      const real = await vi.importActual("@/lib/statUtils");
      calc = real.calculateToWoundThreshold;
    });

    it.each([
      [4, 4, 4], // equal
      [5, 3, 4], // lower strength
      [3, 5, 4], // higher strength
      [2, 8, 4], // double or more
      [6, 2, 4], // half or less
    ])("%i+ -> strength=%i → toughness=%i", (expected, s, t) => {
      expect(calc(s, t)).toBe(expected);
    });
  });

  // 2️⃣ Basic wound threshold logic
  it("counts mixed wounds correctly", () => {
    mockRollSequence([1, 4, 2, 6, 3, 5]);
    mockCalcThreshold.mockReturnValue(4);
    const res = processWoundPhase(6, 0, 0, 4, 4, baseOpts);
    expect(res.successfulWounds).toBe(3);
  });

  // 3️⃣ Adds lethal hits properly
  it("adds lethal hits to successful wounds", () => {
    mockRollSequence([5, 3, 4]);
    mockCalcThreshold.mockReturnValue(4);
    const res = processWoundPhase(3, 2, 0, 4, 4, baseOpts);
    expect(res.successfulWounds).toBe(4); // 2 hits + 2 lethals
  });

  // 4️⃣ Counts devastating wounds on 6s
  it("marks 6s as devastating wounds", () => {
    mockRollSequence([6, 4, 2]);
    mockCalcThreshold.mockReturnValue(4);
    const res = processWoundPhase(3, 0, 0, 4, 4, {
      ...baseOpts,
      devastatingWounds: true,
    });
    expect(res.devastatingWounds).toBe(1);
  });

  // 5️⃣ Reroll ones
  it("rerolls 1s to wound", () => {
    mockRollSequence([1, 4, 5, 3, 2]);
    mockCalcThreshold.mockReturnValue(4);
    const res = processWoundPhase(4, 0, 0, 4, 4, {
      ...baseOpts,
      reRollOneToWound: true,
    });
    expect(res.reRolls).toEqual([4]);
    expect(res.successfulWounds).toBe(2);
  });

  // 6️⃣ Reroll all failed wounds
  it("rerolls all failed wounds", () => {
    mockRollSequence([2, 4, 6, 3, 5]);
    mockCalcThreshold.mockReturnValue(4);
    const res = processWoundPhase(5, 0, 0, 4, 4, {
      ...baseOpts,
      reRollWound: true,
    });
    expect(res.reRolls.length).toBeGreaterThan(0);
    expect(res.successfulWounds).toBeGreaterThan(2);
  });

  // 7️⃣ Edge: zero hits
  it("handles zero hits gracefully", () => {
    const res = processWoundPhase(0, 0, 0, 4, 4, baseOpts);
    expect(res.successfulWounds).toBe(0);
    expect(res.devastatingWounds).toBe(0);
  });
});
