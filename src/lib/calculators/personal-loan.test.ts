import { describe, it, expect } from 'vitest';
import { calculatePersonalLoan } from './personal-loan';

describe('calculatePersonalLoan', () => {
  it('computes monthly payment for a standard 36-month personal loan', () => {
    // Arrange
    const input = {
      loanAmount: 10000,
      loanTerm: 36,
      interestRate: 8,
    };

    // Act
    const result = calculatePersonalLoan(input);

    // Assert
    // P=10000, r=0.00667, n=36 → ~313.36
    expect(result.monthlyPayment).toBeCloseTo(313.36, 0);
    expect(result.schedule).toHaveLength(36);
  });

  it('schedule monthly payment equals the returned monthlyPayment', () => {
    // Arrange
    const result = calculatePersonalLoan({
      loanAmount: 5000,
      loanTerm: 24,
      interestRate: 7.5,
    });

    // Act / Assert
    expect(result.schedule[0].payment).toBeCloseTo(result.monthlyPayment, 4);
    expect(result.schedule[10].payment).toBeCloseTo(result.monthlyPayment, 4);
  });

  it('totalInterest equals totalPayment - loanAmount', () => {
    // Arrange
    const input = { loanAmount: 15000, loanTerm: 60, interestRate: 9 };

    // Act
    const result = calculatePersonalLoan(input);

    // Assert
    expect(result.totalInterest).toBeCloseTo(
      result.totalPayment - input.loanAmount,
      2,
    );
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('handles 0% APR loans (e.g. promotional)', () => {
    // Arrange
    const input = { loanAmount: 6000, loanTerm: 24, interestRate: 0 };

    // Act
    const result = calculatePersonalLoan(input);

    // Assert
    expect(result.monthlyPayment).toBeCloseTo(250, 2);
    expect(result.totalInterest).toBeCloseTo(0, 2);
  });

  it('higher interest rate yields higher total interest', () => {
    // Arrange
    const low = calculatePersonalLoan({
      loanAmount: 10000,
      loanTerm: 36,
      interestRate: 5,
    });
    const high = calculatePersonalLoan({
      loanAmount: 10000,
      loanTerm: 36,
      interestRate: 15,
    });

    // Act / Assert
    expect(high.totalInterest).toBeGreaterThan(low.totalInterest);
    expect(high.monthlyPayment).toBeGreaterThan(low.monthlyPayment);
  });

  it('handles very large loan amounts without precision blow-up', () => {
    // Arrange
    const input = {
      loanAmount: 1_000_000,
      loanTerm: 120,
      interestRate: 10,
    };

    // Act
    const result = calculatePersonalLoan(input);

    // Assert
    expect(Number.isFinite(result.monthlyPayment)).toBe(true);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    const last = result.schedule[result.schedule.length - 1];
    expect(Math.abs(last.balance)).toBeLessThan(1);
  });
});
