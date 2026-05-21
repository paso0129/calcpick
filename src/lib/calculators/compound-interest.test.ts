import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest } from './compound-interest';

describe('calculateCompoundInterest', () => {
  it('with no contributions and no interest, balance equals initial investment', () => {
    // Arrange
    const input = {
      initialInvestment: 10000,
      monthlyContribution: 0,
      annualRate: 0,
      years: 5,
      compoundFrequency: 12,
    };

    // Act
    const result = calculateCompoundInterest(input);

    // Assert
    expect(result.finalBalance).toBeCloseTo(10000, 2);
    expect(result.totalContributions).toBeCloseTo(10000, 2);
    expect(result.totalInterest).toBeCloseTo(0, 2);
    expect(result.yearlyBreakdown).toHaveLength(5);
  });

  it('grows initial investment with monthly compounding over 10 years', () => {
    // Arrange
    const input = {
      initialInvestment: 1000,
      monthlyContribution: 0,
      annualRate: 6,
      years: 10,
      compoundFrequency: 12,
    };

    // Act
    const result = calculateCompoundInterest(input);

    // Assert
    // FV = 1000 * (1 + 0.06/12)^120 ≈ 1819.40
    expect(result.finalBalance).toBeCloseTo(1819.4, 0);
    expect(result.totalContributions).toBeCloseTo(1000, 2);
  });

  it('includes monthly contributions in totalContributions', () => {
    // Arrange
    const input = {
      initialInvestment: 5000,
      monthlyContribution: 200,
      annualRate: 5,
      years: 3,
      compoundFrequency: 12,
    };

    // Act
    const result = calculateCompoundInterest(input);

    // Assert
    // Initial 5000 + 200 * 36 = 12200
    expect(result.totalContributions).toBeCloseTo(12200, 2);
    expect(result.finalBalance).toBeGreaterThan(result.totalContributions);
  });

  it('yearlyBreakdown balance grows monotonically with positive rate and contributions', () => {
    // Arrange
    const input = {
      initialInvestment: 2000,
      monthlyContribution: 100,
      annualRate: 5,
      years: 5,
      compoundFrequency: 12,
    };

    // Act
    const result = calculateCompoundInterest(input);

    // Assert
    for (let i = 1; i < result.yearlyBreakdown.length; i++) {
      expect(result.yearlyBreakdown[i].balance).toBeGreaterThan(
        result.yearlyBreakdown[i - 1].balance,
      );
    }
  });

  it('annual vs monthly compounding produce close but distinct balances', () => {
    // Arrange
    const base = {
      initialInvestment: 10000,
      monthlyContribution: 0,
      annualRate: 8,
      years: 10,
    };

    // Act
    const annually = calculateCompoundInterest({
      ...base,
      compoundFrequency: 1,
    });
    const monthly = calculateCompoundInterest({
      ...base,
      compoundFrequency: 12,
    });

    // Assert
    expect(monthly.finalBalance).toBeGreaterThan(annually.finalBalance);
    expect(monthly.finalBalance - annually.finalBalance).toBeLessThan(
      annually.finalBalance,
    );
  });

  it('totalInterest = finalBalance - totalContributions', () => {
    // Arrange
    const input = {
      initialInvestment: 1500,
      monthlyContribution: 50,
      annualRate: 7,
      years: 4,
      compoundFrequency: 12,
    };

    // Act
    const result = calculateCompoundInterest(input);

    // Assert
    expect(result.totalInterest).toBeCloseTo(
      result.finalBalance - result.totalContributions,
      4,
    );
  });

  it('handles 0 years (returns empty breakdown)', () => {
    // Arrange
    const input = {
      initialInvestment: 5000,
      monthlyContribution: 100,
      annualRate: 5,
      years: 0,
      compoundFrequency: 12,
    };

    // Act
    const result = calculateCompoundInterest(input);

    // Assert
    expect(result.yearlyBreakdown).toHaveLength(0);
    expect(result.finalBalance).toBeCloseTo(5000, 2);
    expect(result.totalContributions).toBeCloseTo(5000, 2);
  });
});
