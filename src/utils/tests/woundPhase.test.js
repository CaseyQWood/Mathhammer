import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the exact module specifiers used by `woundPhase.ts`
vi.mock('../diceUtils', () => ({
  rollD6: vi.fn(),
}))
vi.mock('../statUtils', () => ({
  calculateToWoundThreshold: vi.fn(),
}))

import { rollD6 } from '../diceUtils'
import { calculateToWoundThreshold } from '../statUtils'
import { processWoundPhase } from '../phaseFunctions/woundPhase'

const mockRollSequence = (values) => {
  let i = 0
  ;(rollD6).mockImplementation(() => values[i++])
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('processWoundPhase', () => {
  it('counts wounds without modifiers', () => {
    mockRollSequence([5, 3, 4])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(3, 0, 4, 4, {
      lethalHits: false,
      reRollWound: false,
      reRollOneToWound: false,
      devastatingWounds: false,
    })

    expect(res.successfulWounds).toBe(2) // 5 and 4 wound on threshold 4
    expect(res.devastatingWounds).toBe(0)
  })

  it('applies reRollOneToWound on 1s', () => {
    // Calls: initial(1), reroll(4), next initial(2), next initial(5)
    mockRollSequence([1, 4, 2, 5])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(3, 0, 4, 4, {
      lethalHits: false,
      reRollWound: false,
      reRollOneToWound: true,
      devastatingWounds: false,
    })

    expect(res.successfulWounds).toBe(2) // 4 and 5 wound
    expect(res.devastatingWounds).toBe(0)
  })

  it('applies reRollWound for any failed wound', () => {
    mockRollSequence([2, 4, 3, 2, 5])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(3, 0, 4, 4, {
      lethalHits: false,
      reRollWound: true,
      reRollOneToWound: false,
      devastatingWounds: false,
    })

    expect(res.successfulWounds).toBe(2) // 4 and 5 wound
    expect(res.devastatingWounds).toBe(0)
  })

  it('counts devastating wounds on 6s', () => {
    mockRollSequence([6, 4, 2])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(3, 0, 4, 4, {
      lethalHits: false,
      reRollWound: false,
      reRollOneToWound: false,
      devastatingWounds: true,
    })

    expect(res.successfulWounds).toBe(1) // 4 wound
    expect(res.devastatingWounds).toBe(1) // 6 is devastating
  })

  it('adds lethal hits to successful wounds', () => {
    mockRollSequence([5, 3, 4])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(3, 2, 4, 4, {
      lethalHits: false,
      reRollWound: false,
      reRollOneToWound: false,
      devastatingWounds: false,
    })

    expect(res.successfulWounds).toBe(3) // 1 regular wound + 2 lethal hits
    expect(res.devastatingWounds).toBe(0)
  })

  it('Lethals don`t modify amount of devastating wounds', () => {
    mockRollSequence([5, 3, 4])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(3, 2, 4, 4, {
      lethalHits: false,
      reRollWound: false,
      reRollOneToWound: false,
      devastatingWounds: true,
    })

    expect(res.successfulWounds).toBe(3) // 1 regular wound + 2 lethal hits
    expect(res.devastatingWounds).toBe(0) // 2 lethal hits count as devastating
  })

  it('handles mixed regular hits and lethal hits with devastating wounds', () => {
    mockRollSequence([6, 4, 2])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(5, 2, 4, 4, {
      lethalHits: false,
      reRollWound: false,
      reRollOneToWound: false,
      devastatingWounds: true,
    })

    expect(res.successfulWounds).toBe(3) // 1 regular wounds (4) + 2 lethal hits
    expect(res.devastatingWounds).toBe(1) // 1 from 6 
  })

  it('handles all failed wounds with rerolls', () => {
    mockRollSequence([1, 2, 3, 1, 2, 3])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(3, 0, 4, 4, {
      lethalHits: false,
      reRollWound: true,
      reRollOneToWound: false,
      devastatingWounds: false,
    })

    expect(res.successfulWounds).toBe(0) // All failed even with rerolls
    expect(res.devastatingWounds).toBe(0)
  })

  it('handles all successful wounds', () => {
    mockRollSequence([4, 5, 6])
    ;(calculateToWoundThreshold).mockReturnValue(4)

    const res = processWoundPhase(3, 0, 4, 4, {
      lethalHits: false,
      reRollWound: false,
      reRollOneToWound: false,
      devastatingWounds: false,
    })

    expect(res.successfulWounds).toBe(3) // All wound
  })

  it('handles only lethal hits', () => {
    const res = processWoundPhase(0, 3, 4, 4, {
      lethalHits: false,
      reRollWound: false,
      reRollOneToWound: false,
      devastatingWounds: true,
    })

    expect(res.successfulWounds).toBe(3) // All 3 lethal hits
    expect(res.devastatingWounds).toBe(0) // All 3 count as devastating
  })
})
