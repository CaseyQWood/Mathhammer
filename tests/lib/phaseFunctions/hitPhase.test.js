import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/diceUtils", () => ({
  rollD6: vi.fn(),
  variableCalculator: vi.fn(),
}));

import { rollD6, variableCalculator } from "@/lib/diceUtils";
import { processHitPhase } from "@/lib/phaseFunctions/hitPhase";

const mockRollSequence = (values) => {
  let i = 0;
  rollD6.mockImplementation(() => values[i++]);
};

const baseOpts = {
  torrent: false,
  reRollHit: false,
  reRollOneToHit: false,
  sustainedHits: { value: false, variable: "0" },
  lethalHits: false,
};

beforeEach(() => vi.clearAllMocks());

describe("processHitPhase (Warhammer 40k 10th - minimal)", () => {
  // 1️⃣ Basic hit threshold logic
  it("counts hits correctly based on WS", () => {
    mockRollSequence([2, 1, 6, 3]);
    const res = processHitPhase(4, 3, baseOpts);
    // WS3+: 3 and 6 hit
    expect(res.successfulHits).toBe(2);
    expect(res.hitRolls).toEqual([2, 1, 6, 3]);
  });

  // 2️⃣ Handles sustained hits (exploding 6s)
  it("adds sustained hits on 6s", () => {
    mockRollSequence([6, 4, 2]);
    variableCalculator.mockReturnValue(1); // 1 extra hit per 6
    const res = processHitPhase(3, 4, {
      ...baseOpts,
      sustainedHits: { value: true, variable: "1" },
    });
    expect(res.sustainedHits).toBe(1);
    expect(res.successfulHits).toBe(2); // 6 and 4
  });

  // 3️⃣ Handles lethal hits (auto-wound on 6s)
  it("marks 6s as lethal hits", () => {
    mockRollSequence([6, 5, 3]);
    const res = processHitPhase(3, 4, {
      ...baseOpts,
      lethalHits: true,
    });
    expect(res.lethalHits).toBe(1); // one 6
    expect(res.successfulHits).toBe(1); // only 5 counts as regular hit
  });

  // 4️⃣ Rerolls 1s to hit
  it("rerolls 1s to hit", () => {
    mockRollSequence([1, 4, 6, 3]);
    const res = processHitPhase(3, 4, {
      ...baseOpts,
      reRollOneToHit: true,
    });
    expect(res.reRolls).toEqual([4]);
    expect(res.successfulHits).toBe(2); // 4 and 6 hit
  });

  // 5️⃣ Rerolls all failed hits
  it("rerolls all failed hits", () => {
    mockRollSequence([2, 4, 3, 5, 6, 5]);
    const res = processHitPhase(4, 4, {
      ...baseOpts,
      reRollHit: true,
    });
    expect(res.reRolls.length).toBeGreaterThan(0);
    expect(res.successfulHits).toBeGreaterThan(2);
  });

  // 6️⃣ Torrent weapons auto-hit
  it("bypasses hit logic when torrent is true", () => {
    mockRollSequence([1, 2, 3, 4]);
    const res = processHitPhase(4, 6, {
      ...baseOpts,
      torrent: true,
    });
    expect(res.successfulHits).toBe(4); // all auto-hit
    expect(res.hitRolls).toEqual([]); // no rolls tracked
  });

  // 7️⃣ Handles zero attacks
  it("returns zero hits when no attacks made", () => {
    const res = processHitPhase(0, 4, baseOpts);
    expect(res.successfulHits).toBe(0);
    expect(res.hitRolls).toEqual([]);
  });

  // 8️⃣ Edge case: all misses
  it("handles all misses correctly", () => {
    mockRollSequence([1, 2, 3]);
    const res = processHitPhase(3, 4, baseOpts);
    expect(res.successfulHits).toBe(0);
    expect(res.sustainedHits).toBe(0);
    expect(res.lethalHits).toBe(0);
  });
});
