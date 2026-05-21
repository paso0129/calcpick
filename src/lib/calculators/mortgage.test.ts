import { describe, it, expect } from 'vitest';
import { calculateMortgage } from './mortgage';

describe('calculateMortgage', () => {
  it('computes standard 30-year fixed mortgage monthly P&I correctly', () => {
    // Arrange
    const input = {
      homePrice: 400000,
      downPayment: 80000,
      loanTerm: 30,
      interestRate: 6,
      propertyTax: 0,
      homeInsurance: 0,
    };

    // Act
    const result = calculateMortgage(input);

    // Assert
    // P=320000, r=0.005, n=360 → ~1918.56
    expect(result.monthlyPrincipalInterest).toBeCloseTo(1918.56, 0);
    expect(result.monthlyPayment).toBeCloseTo(1918.56, 0);
    expect(result.schedule).toHaveLength(360);
  });

  it('includes property tax and insurance in monthly payment', () => {
    // Arrange
    const input = {
      homePrice: 300000,
      downPayment: 60000,
      loanTerm: 30,
      interestRate: 5,
      propertyTax: 3600,
      homeInsurance: 1200,
    };

    // Act
    const result = calculateMortgage(input);

    // Assert
    expect(result.monthlyTax).toBeCloseTo(300, 2);
    expect(result.monthlyInsurance).toBeCloseTo(100, 2);
    expect(result.monthlyPayment).toBeCloseTo(
      result.monthlyPrincipalInterest + 300 + 100,
      2,
    );
  });

  it('produces a 15-year schedule with shorter length and lower total interest than 30-year', () => {
    // Arrange
    const base = {
      homePrice: 350000,
      downPayment: 50000,
      interestRate: 4.5,
      propertyTax: 0,
      homeInsurance: 0,
    };

    // Act
    const fifteen = calculateMortgage({ ...base, loanTerm: 15 });
    const thirty = calculateMortgage({ ...base, loanTerm: 30 });

    // Assert
    expect(fifteen.schedule).toHaveLength(180);
    expect(thirty.schedule).toHaveLength(360);
    expect(fifteen.totalInterest).toBeLessThan(thirty.totalInterest);
  });

  it('totalInterest equals (monthlyPI * n) - principal', () => {
    // Arrange
    const input = {
      homePrice: 250000,
      downPayment: 50000,
      loanTerm: 15,
      interestRate: 4,
      propertyTax: 0,
      homeInsurance: 0,
    };

    // Act
    const result = calculateMortgage(input);
    const principal = input.homePrice - input.downPayment;

    // Assert
    expect(result.totalInterest).toBeCloseTo(
      result.monthlyPrincipalInterest * 180 - principal,
      2,
    );
  });

  it('handles 0% interest rate without producing NaN', () => {
    // Arrange
    const input = {
      homePrice: 240000,
      downPayment: 0,
      loanTerm: 20,
      interestRate: 0,
      propertyTax: 0,
      homeInsurance: 0,
    };

    // Act
    const result = calculateMortgage(input);

    // Assert
    // principal/n = 240000 / 240 = 1000
    expect(result.monthlyPrincipalInterest).toBeCloseTo(1000, 2);
    expect(result.totalInterest).toBeCloseTo(0, 2);
  });

  it('ends with a near-zero balance after the final payment', () => {
    // Arrange
    const input = {
      homePrice: 200000,
      downPayment: 40000,
      loanTerm: 30,
      interestRate: 6,
      propertyTax: 0,
      homeInsurance: 0,
    };

    // Act
    const result = calculateMortgage(input);
    const lastRow = result.schedule[result.schedule.length - 1];

    // Assert
    expect(Math.abs(lastRow.balance)).toBeLessThan(1);
  });

  it('handles large principal without overflow', () => {
    // Arrange
    const input = {
      homePrice: 5_000_000,
      downPayment: 1_000_000,
      loanTerm: 30,
      interestRate: 7,
      propertyTax: 0,
      homeInsurance: 0,
    };

    // Act
    const result = calculateMortgage(input);

    // Assert
    expect(Number.isFinite(result.monthlyPrincipalInterest)).toBe(true);
    expect(result.monthlyPrincipalInterest).toBeGreaterThan(0);
  });
});
