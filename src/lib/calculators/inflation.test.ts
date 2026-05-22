import { describe, it, expect } from 'vitest';
import {
  calculateHistoricalInflation,
  calculateProjectedInflation,
  CPI_DATA,
} from './inflation';

describe('CPI_DATA', () => {
  it('contains data from 1913 to 2024', () => {
    expect(CPI_DATA[1913]).toBe(9.9);
    expect(CPI_DATA[2024]).toBe(313.7);
  });

  it('has at least 100 data points', () => {
    expect(Object.keys(CPI_DATA).length).toBeGreaterThanOrEqual(100);
  });
});

describe('calculateHistoricalInflation', () => {
  it('returns zero cumulative inflation when fromYear equals toYear', () => {
    // Arrange
    const input = { amount: 100, fromYear: 2000, toYear: 2000 };

    // Act
    const result = calculateHistoricalInflation(input);

    // Assert
    expect(result.adjustedValue).toBeCloseTo(100, 4);
    expect(result.cumulativeInflationPct).toBeCloseTo(0, 4);
    expect(result.annualizedRatePct).toBeCloseTo(0, 4);
    expect(result.mode).toBe('historical');
  });

  it('correctly adjusts $100 from 1913 to 2024 using anchor CPI values', () => {
    // Arrange
    const input = { amount: 100, fromYear: 1913, toYear: 2024 };

    // Act
    const result = calculateHistoricalInflation(input);

    // Assert — adjusted = 100 × (313.7 / 9.9) ≈ 3168.69
    expect(result.adjustedValue).toBeCloseTo(3168.69, 0);
    expect(result.cumulativeInflationPct).toBeGreaterThan(3000);
    expect(result.annualizedRatePct).toBeGreaterThan(0);
  });

  it('correctly adjusts $1000 from 1980 to 2000', () => {
    // Arrange
    const input = { amount: 1000, fromYear: 1980, toYear: 2000 };

    // Act
    const result = calculateHistoricalInflation(input);

    // Assert — adjusted = 1000 × (172.2 / 82.4) ≈ 2089.32
    expect(result.adjustedValue).toBeCloseTo(2089.32, 0);
    expect(result.cumulativeInflationPct).toBeCloseTo(108.93, 0);
  });

  it('returns yearlyBreakdown spanning fromYear to toYear inclusive', () => {
    // Arrange
    const input = { amount: 500, fromYear: 2010, toYear: 2020 };

    // Act
    const result = calculateHistoricalInflation(input);

    // Assert
    expect(result.yearlyBreakdown).toHaveLength(11); // 2010..2020 inclusive
    expect(result.yearlyBreakdown[0].year).toBe(2010);
    expect(result.yearlyBreakdown[10].year).toBe(2020);
  });

  it('first breakdown entry equals the original amount (fromYear)', () => {
    // Arrange
    const input = { amount: 250, fromYear: 1990, toYear: 2010 };

    // Act
    const result = calculateHistoricalInflation(input);

    // Assert
    expect(result.yearlyBreakdown[0].value).toBeCloseTo(250, 4);
  });

  it('handles toYear < fromYear (reverse direction)', () => {
    // Arrange
    const input = { amount: 100, fromYear: 2020, toYear: 2000 };

    // Act
    const result = calculateHistoricalInflation(input);

    // Assert — going backwards, adjusted value should be less than original
    expect(result.adjustedValue).toBeLessThan(100);
    expect(result.cumulativeInflationPct).toBeLessThan(0);
  });

  it('annualizedRatePct is consistent with cumulativeInflationPct over known span', () => {
    // Arrange
    const input = { amount: 1000, fromYear: 2000, toYear: 2010 };

    // Act
    const result = calculateHistoricalInflation(input);

    // Assert — compound annualized rate should reproduce cumulative over 10 years
    const reconstructed =
      (Math.pow(1 + result.annualizedRatePct / 100, 10) - 1) * 100;
    expect(reconstructed).toBeCloseTo(result.cumulativeInflationPct, 1);
  });
});

describe('calculateProjectedInflation', () => {
  it('returns original amount as adjustedValue when years is 0', () => {
    // Arrange
    const input = { amount: 1000, years: 0, annualRate: 3 };

    // Act
    const result = calculateProjectedInflation(input);

    // Assert
    expect(result.adjustedValue).toBeCloseTo(1000, 4);
    expect(result.cumulativeInflationPct).toBeCloseTo(0, 4);
    expect(result.mode).toBe('projection');
  });

  it('calculates purchasing power correctly at 3% for 10 years', () => {
    // Arrange — purchasing power = 1000 / (1.03)^10 ≈ 744.09
    const input = { amount: 1000, years: 10, annualRate: 3 };

    // Act
    const result = calculateProjectedInflation(input);

    // Assert
    expect(result.adjustedValue).toBeCloseTo(744.09, 0);
  });

  it('calculates cumulative inflation correctly', () => {
    // Arrange — futureValue = 1000 × (1.05)^20 ≈ 2653.3, cumulative ≈ 165.33%
    const input = { amount: 1000, years: 20, annualRate: 5 };

    // Act
    const result = calculateProjectedInflation(input);

    // Assert
    expect(result.cumulativeInflationPct).toBeCloseTo(165.33, 0);
  });

  it('annualizedRatePct equals input annualRate', () => {
    // Arrange
    const input = { amount: 500, years: 15, annualRate: 2.5 };

    // Act
    const result = calculateProjectedInflation(input);

    // Assert
    expect(result.annualizedRatePct).toBe(2.5);
  });

  it('yearlyBreakdown length equals years + 1 (includes year 0)', () => {
    // Arrange
    const input = { amount: 1000, years: 30, annualRate: 3 };

    // Act
    const result = calculateProjectedInflation(input);

    // Assert
    expect(result.yearlyBreakdown).toHaveLength(31);
  });

  it('first breakdown value equals original amount (year 0)', () => {
    // Arrange
    const input = { amount: 800, years: 5, annualRate: 4 };

    // Act
    const result = calculateProjectedInflation(input);

    // Assert
    expect(result.yearlyBreakdown[0].value).toBeCloseTo(800, 4);
  });

  it('purchasing power decreases monotonically over projection period', () => {
    // Arrange
    const input = { amount: 1000, years: 10, annualRate: 3 };

    // Act
    const result = calculateProjectedInflation(input);

    // Assert
    for (let i = 1; i < result.yearlyBreakdown.length; i++) {
      expect(result.yearlyBreakdown[i].value).toBeLessThan(
        result.yearlyBreakdown[i - 1].value,
      );
    }
  });

  it('handles 0% inflation rate (no change)', () => {
    // Arrange
    const input = { amount: 500, years: 10, annualRate: 0 };

    // Act
    const result = calculateProjectedInflation(input);

    // Assert
    expect(result.adjustedValue).toBeCloseTo(500, 4);
    expect(result.cumulativeInflationPct).toBeCloseTo(0, 4);
  });
});
