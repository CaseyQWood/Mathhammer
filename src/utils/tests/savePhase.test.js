import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the exact module specifiers used by `savePhase.ts`
vi.mock('../diceUtils', () => ({
  rollD6: vi.fn(),
}))
vi.mock('../damageUtils', () => ({
  shouldAttemptSave: vi.fn(),
  getSaveThreshold: vi.fn(),
}))

import { rollD6 } from '../diceUtils'
import { shouldAttemptSave, getSaveThreshold } from '../damageUtils'
import { processSavePhase } from '../phaseFunctions/savePhase'

const mockRollSequence = (values) => {
  let i = 0
  ;(rollD6).mockImplementation(() => values[i++])
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('processSavePhase', () => {
  const mockDefenseStats = {
    toughness: 4,
    save: 3,
    invulnerable: 4,
    feelNoPain: 0,
  }

  const mockAttackStats = {
    models: 1,
    attacks: { variable: '1', value: 1 },
    weaponSkill: 3,
    strength: 4,
    armourPiercing: 0,
    damage: { variable: '1', value: 1 },
  }

  it('bypasses saves for devastating wounds', () => {
    const res = processSavePhase(3, 2, mockDefenseStats, mockAttackStats, {
      devastatingWounds: true,
    })

    expect(res.woundsBypassingSaves).toBe(2) // All devastating wounds bypass saves
    expect(res.wounds).toBe(0) // No regular wounds in this test
  })

  it('processes regular wounds that need saves', () => {
    mockRollSequence([2, 4, 1])
    ;(shouldAttemptSave).mockReturnValue(true)
    ;(getSaveThreshold).mockReturnValue(3)
    // First save fails (2 < 3), second save passes (4 >= 3), third save fails (1 < 3)

    const res = processSavePhase(3, 0, mockDefenseStats, mockAttackStats, {
      devastatingWounds: false,
    })

    expect(res.woundsBypassingSaves).toBe(0)
    expect(res.wounds).toBe(2) // 2 failed saves
  })

  it('handles wounds that cannot attempt saves', () => {
    ;(shouldAttemptSave).mockReturnValue(false)

    const res = processSavePhase(2, 0, mockDefenseStats, mockAttackStats, {
      devastatingWounds: false,
    })

    expect(res.woundsBypassingSaves).toBe(0)
    expect(res.wounds).toBe(2) // All wounds that can't save count as wounds
  })

  it('handles mixed devastating and regular wounds', () => {
    mockRollSequence([5, 2])
    ;(shouldAttemptSave).mockReturnValue(true)
    ;(getSaveThreshold).mockReturnValue(3)
    // First save passes (5 >= 3), second save fails (2 < 3)

    const res = processSavePhase(4, 2, mockDefenseStats, mockAttackStats, {
      devastatingWounds: true,
    })

    expect(res.woundsBypassingSaves).toBe(2) // 2 devastating wounds
    expect(res.wounds).toBe(1) // 1 failed regular save
  })

  it('handles all successful saves', () => {
    mockRollSequence([4, 5, 6])
    ;(shouldAttemptSave).mockReturnValue(true)
    ;(getSaveThreshold).mockReturnValue(3)
    // All saves pass (4, 5, 6 >= 3)

    const res = processSavePhase(3, 0, mockDefenseStats, mockAttackStats, {
      devastatingWounds: false,
    })

    expect(res.woundsBypassingSaves).toBe(0)
    expect(res.wounds).toBe(0) // All saves successful
  })

  it('handles all failed saves', () => {
    mockRollSequence([1, 2, 1])
    ;(shouldAttemptSave).mockReturnValue(true)
    ;(getSaveThreshold).mockReturnValue(3)
    // All saves fail (1, 2, 1 < 3)

    const res = processSavePhase(3, 0, mockDefenseStats, mockAttackStats, {
      devastatingWounds: false,
    })

    expect(res.woundsBypassingSaves).toBe(0)
    expect(res.wounds).toBe(3) // All saves failed
  })

  it('handles only devastating wounds', () => {
    const res = processSavePhase(0, 3, mockDefenseStats, mockAttackStats, {
      devastatingWounds: true,
    })

    expect(res.woundsBypassingSaves).toBe(3) // All 3 devastating wounds
    expect(res.wounds).toBe(0) // No regular wounds
  })

  it('handles no wounds at all', () => {
    const res = processSavePhase(0, 0, mockDefenseStats, mockAttackStats, {
      devastatingWounds: false,
    })

    expect(res.woundsBypassingSaves).toBe(0)
    expect(res.wounds).toBe(0)
  })

  it('handles high armour piercing attacks', () => {
    const highAPAttackStats = {
      ...mockAttackStats,
      armourPiercing: 3,
    }

    mockRollSequence([6])
    ;(shouldAttemptSave).mockReturnValue(true)
    ;(getSaveThreshold).mockReturnValue(6) // Save 3 + AP 3 = 6+
    // Save passes (6 >= 6)

    const res = processSavePhase(1, 0, mockDefenseStats, highAPAttackStats, {
      devastatingWounds: false,
    })

    expect(res.woundsBypassingSaves).toBe(0)
    expect(res.wounds).toBe(0) // Save successful
  })

  it('handles invulnerable saves', () => {
    const invulnDefenseStats = {
      ...mockDefenseStats,
      invulnerable: 2,
    }

    mockRollSequence([3])
    ;(shouldAttemptSave).mockReturnValue(true)
    ;(getSaveThreshold).mockReturnValue(2) // Invulnerable save
    // Save passes (3 >= 2)

    const res = processSavePhase(1, 0, invulnDefenseStats, mockAttackStats, {
      devastatingWounds: false,
    })

    expect(res.woundsBypassingSaves).toBe(0)
    expect(res.wounds).toBe(0) // Save successful
  })
})
