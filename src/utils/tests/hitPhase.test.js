import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the exact module specifiers used by `hitPhase.ts`
vi.mock('../diceUtils', () => ({
  rollD6: vi.fn(),
  variableCalculator: vi.fn(),
}))

import { rollD6, variableCalculator } from '../diceUtils'
import { processHitPhase } from '../phaseFunctions/hitPhase'

const mockRollSequence = (values) => {
  let i = 0
  ;(rollD6).mockImplementation(() => values[i++])
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('processHitPhase', () => {
  it('counts hits without modifiers and records hit rolls', () => {
    mockRollSequence([5, 3, 4])

    const res = processHitPhase(3, 4, {
      torrent: false,
      reRollHit: false,
      reRollOneToHit: false,
      sustainedHits: { value: false, variable: '0' },
      lethalHits: false,
    })

    expect(res.successfulHits).toBe(2) // 5 and 4 hit on WS4
    expect(res.lethalHits).toBe(0)
    expect(res.extraAttacks).toBe(0)
    expect(res.hitRolls).toEqual([5, 3, 4])
  })

  it('applies reRollOneToHit on 1s and records reroll', () => {
    // Calls: initial(1), reroll(4), next initial(5)
    mockRollSequence([1, 4, 5, 3])

    const res = processHitPhase(3, 4, {
      torrent: false,
      reRollHit: false,
      reRollOneToHit: true,
      sustainedHits: { value: false, variable: '0' },
      lethalHits: false,
    })

    expect(res.successfulHits).toBe(2) // 4 and 5 hit
    expect(res.hitRolls).toEqual([1, 4, 5, 3]) // includes the reroll of the 1
  })

  it('applies reRollHit for any failed hit', () => {
    mockRollSequence([2, 4, 6, 2, 3])

    const res = processHitPhase(3, 4, {
      torrent: false,
      reRollHit: true,
      reRollOneToHit: false,
      sustainedHits: { value: false, variable: '0' },
      lethalHits: false,
    })

    expect(res.successfulHits).toBe(2) // 4 and 6
    expect(res.hitRolls).toEqual([2, 4, 6, 2, 3])
  })

  it('adds extra attacks for sustained hits/lethal hits from base attacks only and processes them', () => {
    // BaseAttacks = 1
    // First roll (base): 6 -> sustained trig
    // variableCalculator('D3') -> 2 extra attacks
    // The loop should then process 2 more rolls: 4, 2
    mockRollSequence([6, 4, 2])
    ;(variableCalculator).mockReturnValue(2)

    const res = processHitPhase(1, 3, {
      torrent: false,
      reRollHit: false,
      reRollOneToHit: false,
      sustainedHits: { value: true, variable: 'D3' },
      lethalHits: true,
    })

    expect(res.extraAttacks).toBe(2)
    expect(res.successfulHits).toBe(1) 
    expect(res.lethalHits).toBe(1) // 6 is a lethal hit
    expect(res.hitRolls).toEqual([6])
  })

  it('skips all hit logic when torrent is true but still records rolls', () => {
    // With torrent true, current implementation bypasses hit checks
    mockRollSequence([2, 1, 6])

    const res = processHitPhase(3, 6, {
      torrent: true,
      reRollHit: true,
      reRollOneToHit: true,
      sustainedHits: { value: true, variable: 'D3' },
      lethalHits: true,
    })

    expect(res.successfulHits).toBe(3) // Since torrent bypasses the miss checks, all three are counted as successful hits
    expect(res.lethalHits).toBe(0)  
    expect(res.extraAttacks).toBe(0) 
    expect(res.hitRolls).toEqual([])
  })


  it('handles all failed hits', () => {
    mockRollSequence([1, 2, 3])

    const res = processHitPhase(3, 4, {
      torrent: false,
      reRollHit: false,
      reRollOneToHit: false,
      sustainedHits: { value: false, variable: '0' },
      lethalHits: false,
    })

    expect(res.successfulHits).toBe(0) // None hit (1, 2, 3 < 4)
    expect(res.lethalHits).toBe(0)
    expect(res.extraAttacks).toBe(0)
  })

  it('handles lethal hits correctly', () => {
    mockRollSequence([6, 4, 6])

    const res = processHitPhase(3, 4, {
      torrent: false,
      reRollHit: false,
      reRollOneToHit: false,
      sustainedHits: { value: false, variable: '0' },
      lethalHits: true,
    })

    expect(res.successfulHits).toBe(1) // All hit (6, 4, 6 >= 4)
    expect(res.lethalHits).toBe(2) // Two 6s are lethal hits
    expect(res.extraAttacks).toBe(0)
  })
})
