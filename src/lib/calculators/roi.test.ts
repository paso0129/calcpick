import { describe, it, expect } from 'vitest';
import { calculateROI } from './roi';

describe('calculateROI', () => {
  it('returns zero result when initialInvestment is zero', () => {
    // Arrange
    const input = { initialInvestment: 0, finalValue: 15000, years: 5 };

    // Act
    const result = calculateROI(input);

    // Assert
    expect(result.netProfit).toBe(0);
    expect(result.totalReturnPct).toBe(0);
    expect(result.annualizedReturnPct).toBe(0);
    expect(result.yearlyBreakdown).toHaveLength(0);
  });

  it('returns zero result when initialInvestment is negative', () => {
    // Arrange
    const input = { initialInvestment: -1000, finalValue: 15000, years: 5 };

    // Act
    const result = calculateROI(input);

    // Assert
    expect(result.netProfit).toBe(0);
    expect(result.totalReturnPct).toBe(0);
  });

  it('calculates a basic 50% total return correctly', () => {
    // Arrange
    const input = { initialInvestment: 10000, finalValue: 15000, years: 5 };

    // Act
    const result = calculateROI(input);

    // Assert
    expect(result.netProfit).toBeCloseTo(5000, 2);
    expect(result.totalReturnPct).toBeCloseTo(50, 2);
  });

  it('calculates annualized ROI (CAGR) for 10000 → 15000 over 5 years', () => {
    // Arrange
    const input = { initialInvestment: 10000, finalValue: 15000, years: 5 };

    // Act
    const result = calculateROI(input);

    // Assert — CAGR = (1.5)^(1/5) - 1 ≈ 8.447%
    expect(result.annualizedReturnPct).toBeCloseTo(8.447, 2);
  });

  it('handles additional costs reducing net profit and return', () => {
    // Arrange
    const input = {
      initialInvestment: 10000,
      finalValue: 15000,
      years: 5,
      additionalCosts: 500,
    };

    // Act
    const result = calculateROI(input);

    // Assert
    expect(result.netProfit).toBeCloseTo(4500, 2);
    expect(result.totalReturnPct).toBeCloseTo(45, 2);
    // CAGR = ((15000 - 500) / 10000)^(1/5) - 1 = (1.45)^0.2 - 1 ≈ 7.714%
    expect(result.annualizedReturnPct).toBeCloseTo(7.714, 2);
  });

  it('handles a loss correctly (negative net profit and return)', () => {
    // Arrange
    const input = { initialInvestment: 10000, finalValue: 7000, years: 3 };

    // Act
    const result = calculateROI(input);

    // Assert
    expect(result.netProfit).toBeCloseTo(-3000, 2);
    expect(result.totalReturnPct).toBeCloseTo(-30, 2);
    expect(result.annualizedReturnPct).toBeLessThan(0);
  });

  it('falls back to totalReturnPct when years is zero', () => {
    // Arrange
    const input = { initialInvestment: 10000, finalValue: 12000, years: 0 };

    // Act
    const result = calculateROI(input);

    // Assert
    expect(result.annualizedReturnPct).toBeCloseTo(result.totalReturnPct, 4);
  });

  it('yearlyBreakdown has correct length equal to years', () => {
    // Arrange
    const input = { initialInvestment: 10000, finalValue: 15000, years: 5 };

    // Act
    const result = calculateROI(input);

    // Assert
    expect(result.yearlyBreakdown).toHaveLength(5);
    expect(result.yearlyBreakdown[0].year).toBe(1);
    expect(result.yearlyBreakdown[4].year).toBe(5);
  });

  it('last yearlyBreakdown row snaps to actual finalValue (adjusted for costs)', () => {
    // Arrange
    const input = {
      initialInvestment: 10000,
      finalValue: 15000,
      years: 5,
      additionalCosts: 500,
    };

    // Act
    const result = calculateROI(input);

    // Assert — last value = finalValue - costs = 14500
    const last = result.yearlyBreakdown[result.yearlyBreakdown.length - 1];
    expect(last.value).toBeCloseTo(14500, 2);
    expect(last.cumulativeReturn).toBeCloseTo(result.totalReturnPct, 4);
  });

  it('yearlyBreakdown values grow monotonically for a positive return', () => {
    // Arrange
    const input = { initialInvestment: 10000, finalValue: 20000, years: 7 };

    // Act
    const result = calculateROI(input);

    // Assert
    for (let i = 1; i < result.yearlyBreakdown.length; i++) {
      expect(result.yearlyBreakdown[i].value).toBeGreaterThan(
        result.yearlyBreakdown[i - 1].value,
      );
    }
  });

  it('ignores negative additionalCosts (treats as zero)', () => {
    // Arrange
    const withNegCost = calculateROI({
      initialInvestment: 10000,
      finalValue: 15000,
      years: 5,
      additionalCosts: -1000,
    });
    const withZeroCost = calculateROI({
      initialInvestment: 10000,
      finalValue: 15000,
      years: 5,
      additionalCosts: 0,
    });

    // Assert
    expect(withNegCost.netProfit).toBeCloseTo(withZeroCost.netProfit, 4);
    expect(withNegCost.totalReturnPct).toBeCloseTo(withZeroCost.totalReturnPct, 4);
  });
});
