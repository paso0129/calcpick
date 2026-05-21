import { describe, it, expect } from 'vitest';
import { calculateAutoLoan } from './auto-loan';

describe('calculateAutoLoan', () => {
  it('computes monthly payment for a typical 60-month auto loan', () => {
    // Arrange
    const input = {
      vehiclePrice: 30000,
      downPayment: 3000,
      tradeInValue: 2000,
      loanTerm: 60,
      interestRate: 6,
    };

    // Act
    const result = calculateAutoLoan(input);

    // Assert
    // principal=25000, r=0.005, n=60 → ~483.32
    expect(result.monthlyPayment).toBeCloseTo(483.32, 0);
    expect(result.schedule).toHaveLength(60);
  });

  it('subtracts both down payment and trade-in from principal', () => {
    // Arrange
    const noDown = calculateAutoLoan({
      vehiclePrice: 20000,
      downPayment: 0,
      tradeInValue: 0,
      loanTerm: 36,
      interestRate: 0,
    });
    const withDown = calculateAutoLoan({
      vehiclePrice: 20000,
      downPayment: 2000,
      tradeInValue: 3000,
      loanTerm: 36,
      interestRate: 0,
    });

    // Act / Assert
    expect(noDown.monthlyPayment).toBeCloseTo(20000 / 36, 2);
    expect(withDown.monthlyPayment).toBeCloseTo(15000 / 36, 2);
  });

  it('totalPayment equals monthlyPayment * loanTerm', () => {
    // Arrange
    const input = {
      vehiclePrice: 28000,
      downPayment: 4000,
      tradeInValue: 0,
      loanTerm: 48,
      interestRate: 5.5,
    };

    // Act
    const result = calculateAutoLoan(input);

    // Assert
    expect(result.totalPayment).toBeCloseTo(result.monthlyPayment * 48, 2);
    expect(result.totalInterest).toBeCloseTo(
      result.totalPayment - (28000 - 4000),
      2,
    );
  });

  it('handles 0% APR (manufacturer promo) without NaN', () => {
    // Arrange
    const input = {
      vehiclePrice: 24000,
      downPayment: 0,
      tradeInValue: 0,
      loanTerm: 60,
      interestRate: 0,
    };

    // Act
    const result = calculateAutoLoan(input);

    // Assert
    expect(result.monthlyPayment).toBeCloseTo(400, 2);
    expect(result.totalInterest).toBeCloseTo(0, 2);
  });

  it('shorter term means higher monthly payment but lower total interest', () => {
    // Arrange
    const base = {
      vehiclePrice: 25000,
      downPayment: 5000,
      tradeInValue: 0,
      interestRate: 6,
    };

    // Act
    const short = calculateAutoLoan({ ...base, loanTerm: 36 });
    const long = calculateAutoLoan({ ...base, loanTerm: 72 });

    // Assert
    expect(short.monthlyPayment).toBeGreaterThan(long.monthlyPayment);
    expect(short.totalInterest).toBeLessThan(long.totalInterest);
  });

  it('ends with near-zero balance', () => {
    // Arrange
    const input = {
      vehiclePrice: 22000,
      downPayment: 2000,
      tradeInValue: 0,
      loanTerm: 48,
      interestRate: 4.9,
    };

    // Act
    const result = calculateAutoLoan(input);
    const last = result.schedule[result.schedule.length - 1];

    // Assert
    expect(Math.abs(last.balance)).toBeLessThan(1);
  });
});
