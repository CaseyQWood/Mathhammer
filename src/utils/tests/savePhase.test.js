import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the exact module specifiers used by `savePhase.ts`
vi.mock('../diceUtils', () => ({
  rollD6: vi.fn(),
  variableCalculator: vi.fn(),
}))
vi.mock('../damageUtils', () => ({
  getSaveThreshold: vi.fn(),
}))

import { rollD6, variableCalculator } from '../diceUtils'
import { getSaveThreshold } from '../damageUtils'
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
    attacks: { variable: '0', value: 1 },
    weaponSkill: 3,
    strength: 4,
    armourPiercing: 0,
    damage: { variable: '0', value: 1 },
  }


  it('processes regular wounds through saves', () => {
    mockRollSequence([4, 2, 1, 3])
    
    // Mock the functions that will be called
    ;(getSaveThreshold).mockReturnValue(3) // Save threshold of 3+
    ;(variableCalculator).mockReturnValue(0) // Damage calculation
    
    const result = processSavePhase(4, 0, mockDefenseStats, mockAttackStats)
    
    expect(result.wounds).toBe(2) 
    expect(result.diceRolls).toEqual([4, 2, 1, 3])
  })

  it('handles wounds that cannot attempt saves (saveThreshold = 0)', () => {

    const armourPiercingMockAttackData ={
      ...mockAttackStats,
      armourPiercing: 4
    }
 
    mockRollSequence([1, 2]) 
    ;(getSaveThreshold).mockReturnValue(7) // 3+ save + ap 4 = 7 (out of threshold)
    ;(variableCalculator).mockReturnValue(0) // Damage calculation

    const result = processSavePhase(2, 0, mockDefenseStats, armourPiercingMockAttackData)
    
    expect(result.wounds).toBe(2) 
  })

  it('processes devastating wounds through Feel No Pain only', () => {

    const mockDefenseStats = {
      toughness: 4,
      save: 3,
      invulnerable: 0,
      feelNoPain: 4,
    }
  
    const mockAttackStats = {
      models: 1,
      attacks: { variable: '0', value: 1 },
      weaponSkill: 3,
      strength: 4,
      armourPiercing: 4,
      damage: { variable: '0', value: 1 },
    }
    // Mock: 2 devastating wounds, both fail Feel No Pain
    mockRollSequence([1, 2, 4]) 
    ;(getSaveThreshold).mockReturnValue(7) 
    ;(variableCalculator).mockReturnValue(0) // Damage calculation

    const result = processSavePhase(0, 3, mockDefenseStats, mockAttackStats)
    
    expect(result.wounds).toBe(2) // fail (1, 2 < 0) pass (4 = 4)
    expect(rollD6).toHaveBeenCalledTimes(3) // Only FNP rolls
  })

  it('handles mixed regular and devastating wounds', () => {
    
    // Mock: 1 regular wound passes save, 2 devastating wounds
    // All 3 go to Feel No Pain, 2 fail FNP
    mockRollSequence([4, 1, 3]) // Save passes (4 >= 3), FNP fails (1 < 0), FNP fails (2 < 0), FNP passes (3 >= 0)
    ;(getSaveThreshold).mockReturnValue(3)
    ;(variableCalculator).mockReturnValue(0)

    const mockDefenseStats = {
      toughness: 4,
      save: 3,
      invulnerable: 0,
      feelNoPain: 3,
    }
  
    const mockAttackStats = {
      models: 1,
      attacks: { variable: '0', value: 1 },
      weaponSkill: 3,
      strength: 4,
      armourPiercing: 0,
      damage: { variable: '0', value: 1 },
    }

    const result = processSavePhase(1, 2, mockDefenseStats, mockAttackStats)
    
    expect(result.wounds).toBe(1) 
    expect(rollD6).toHaveBeenCalledTimes(3) // 1 save + 2 FNP
  })

  it('handles all successful saves (no wounds reach Feel No Pain)', () => {
    // Mock: 3 regular wounds, all fail saves
    mockRollSequence([3, 4, 5]) // All saves fail (1, 2, 1 < 3)
    ;(getSaveThreshold).mockReturnValue(3)
    ;(variableCalculator).mockReturnValue(0)

    const result = processSavePhase(3, 0, mockDefenseStats, mockAttackStats)
    
    expect(result.wounds).toBe(0) // No wounds reach Feel No Pain
    expect(rollD6).toHaveBeenCalledTimes(3) // Only save rolls
  })

  it('handles Feel No Pain saves correctly', () => {
    const fnpDefenseStats = {
      ...mockDefenseStats,
      feelNoPain: 4,
    }

    // Mock: 1 regular wound passes save, 1 devastating wound
    mockRollSequence([5, 2, 4]) // Save passes (5 >= 3), FNP fails (2 < 4), FNP pass (4 > 2)
    ;(getSaveThreshold).mockReturnValue(3)
    ;(variableCalculator).mockReturnValue(0)

    const result = processSavePhase(1, 2, fnpDefenseStats, mockAttackStats)
    
    expect(result.wounds).toBe(1) // 1 wound failed Feel No Pain
    expect(rollD6).toHaveBeenCalledTimes(3) // 1 save + 2 FNP
  })

  it('handles high armour piercing attacks', () => {
    const highAPAttackStats = {
      ...mockAttackStats,
      armourPiercing: 3,
    }

    // Mock: 1 regular wound, save fails due to high AP, goes to FNP and fails
    mockRollSequence([5, 1]) // Save fails (5 < 6), FNP fails (1 < 0)
    ;(getSaveThreshold).mockReturnValue(6) // Save 3 + AP 3 = 6+

    const result = processSavePhase(1, 0, mockDefenseStats, highAPAttackStats)
    
    expect(result.wounds).toBe(1) // Wound failed save and FNP
    expect(getSaveThreshold).toHaveBeenCalledWith(3, 3, 4)
  })

  it('handles invulnerable saves', () => {
    const invulnDefenseStats = {
      ...mockDefenseStats,
      invulnerable: 2,
    }

    // Mock: 1 regular wound, invulnerable save passes, goes to FNP and fails
    mockRollSequence([3, 1]) // Invuln save passes (3 >= 2), FNP fails (1 < 0)
    ;(getSaveThreshold).mockReturnValue(2) // Invulnerable save
    ;(variableCalculator).mockReturnValue(0)

    const result = processSavePhase(1, 0, invulnDefenseStats, mockAttackStats)
    
    expect(result.wounds).toBe(0) // Wound passed save but failed FNP
    expect(getSaveThreshold).toHaveBeenCalledWith(3, 0, 2)
  })

  it('handles variable damage for devastating wounds', () => {
    const fnpDefenseStats = {
      ...mockDefenseStats,
      feelNoPain: 4,
    }

    const variableAttackStats = {
      ...mockAttackStats,
      damage: { variable: 'D3', value: 1 }

    }
    // Mock: 1 devastating wound with D3 damage (rolls 2), both damage instances fail FNP
    mockRollSequence([1, 2, 4]) 
    ;(getSaveThreshold).mockReturnValue(3)
    ;(variableCalculator).mockReturnValue(2) // D3 rolled 2

    const result = processSavePhase(0, 1, fnpDefenseStats , variableAttackStats)
    
    expect(result.wounds).toBe(2) // 2 damage instances failed Feel No Pain
    expect(result.diceRolls).toEqual([1, 2, 4])
    // expect(rollD6).toHaveBeenCalledTimes(3) // 2 FNP rolls
  })

  it('handles zero damage from variable calculator', () => {
    // Mock: 1 devastating wound with 0 damage
    mockRollSequence([1, 2, 4]) 
    ;(getSaveThreshold).mockReturnValue(3)
    ;(variableCalculator).mockReturnValue(0)

    const result = processSavePhase(0, 1, mockDefenseStats, mockAttackStats)
    
    expect(result.wounds).toBe(1) // No damage, no FNP rolls
    expect(rollD6).not.toHaveBeenCalled()
  })
})
