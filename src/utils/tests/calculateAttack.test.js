import { expect, test, describe } from 'vitest'
import { calculateToWoundThreshold, variableCalculator } from '../calculateAttack'

describe('calculateToWoundThreshold', () => {
  test('returns 4 when strength equals toughness', () => {
    expect(calculateToWoundThreshold(4, 4)).toBe(4)
  })

  test('returns 5 when strength is toughness - 1', () => {
    expect(calculateToWoundThreshold(3, 4)).toBe(5)
  })

  test('returns 3 when strength is toughness + 1', () => {
    expect(calculateToWoundThreshold(5, 4)).toBe(3)
  })

  test('returns 2 when strength is double or more than toughness', () => {
    expect(calculateToWoundThreshold(4, 2)).toBe(2)
    expect(calculateToWoundThreshold(9, 4)).toBe(2) // More than double
  })

  test('returns 6 when strength is half or less than toughness', () => {
    expect(calculateToWoundThreshold(2, 4)).toBe(6)
    expect(calculateToWoundThreshold(1, 4)).toBe(6) // Less than half
  })
})

describe('variableCalculator', () => {
  test('returns fixed values for numeric strings', () => {
    expect(variableCalculator('0')).toBe(0)
    expect(variableCalculator('1')).toBe(1)
    expect(variableCalculator('3')).toBe(3)
  })

  test('returns values within expected range for D3 dice', () => {
    // Test D3 (1-3)
    const d3Result = variableCalculator('D3')
    expect(d3Result).toBeGreaterThanOrEqual(1)
    expect(d3Result).toBeLessThanOrEqual(3)

    // Test 2D3 (2-6)
    const twoD3Result = variableCalculator('2D3')
    expect(twoD3Result).toBeGreaterThanOrEqual(2)
    expect(twoD3Result).toBeLessThanOrEqual(6)

    // Test 3D3 (3-9)
    const threeD3Result = variableCalculator('3D3')
    expect(threeD3Result).toBeGreaterThanOrEqual(3)
    expect(threeD3Result).toBeLessThanOrEqual(9)
  })

  test('returns values within expected range for D6 dice', () => {
    // Test D6 (1-6)
    const d6Result = variableCalculator('D6')
    expect(d6Result).toBeGreaterThanOrEqual(1)
    expect(d6Result).toBeLessThanOrEqual(6)

    // Test 2D6 (2-12)
    const twoD6Result = variableCalculator('2D6')
    expect(twoD6Result).toBeGreaterThanOrEqual(2)
    expect(twoD6Result).toBeLessThanOrEqual(12)

    // Test 3D6 (3-18)
    const threeD6Result = variableCalculator('3D6')
    expect(threeD6Result).toBeGreaterThanOrEqual(3)
    expect(threeD6Result).toBeLessThanOrEqual(18)
  })

  test('returns 0 for unknown variables', () => {
    expect(variableCalculator('unknown')).toBe(0)
    expect(variableCalculator('')).toBe(0)
    expect(variableCalculator('D4')).toBe(0)
    expect(variableCalculator('2D4')).toBe(0)
    expect(variableCalculator('invalid')).toBe(0)
  })
})

