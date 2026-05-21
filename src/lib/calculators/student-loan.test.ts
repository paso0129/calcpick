import { describe, it, expect } from 'vitest';
import {
  calculateStudentLoan,
  compareStudentLoanPlans,
} from './student-loan';

describe('calculateStudentLoan', () => {
  it('standard plan produces 120-month schedule and labels correctly', () => {
    // Arrange
    const input = {
      loanAmount: 30000,
      interestRate: 6,
      plan: 'standard' as const,
    };

    // Act
    const result = calculateStudentLoan(input);

    // Assert
    expect(result.plan).toBe('Standard (10 years)');
    expect(result.schedule).toHaveLength(120);
    // Standard P=30000, r=0.005, n=120 → ~333.06
    expect(result.monthlyPayment).toBeCloseTo(333.06, 0);
  });

  it('extended plan produces 300-month schedule with lower monthly payment than standard', () => {
    // Arrange
    const standard = calculateStudentLoan({
      loanAmount: 50000,
      interestRate: 5,
      plan: 'standard',
    });
    const extended = calculateStudentLoan({
      loanAmount: 50000,
      interestRate: 5,
      plan: 'extended',
    });

    // Act / Assert
    expect(extended.plan).toBe('Extended (25 years)');
    expect(extended.schedule).toHaveLength(300);
    expect(extended.monthlyPayment).toBeLessThan(standard.monthlyPayment);
    expect(extended.totalInterest).toBeGreaterThan(standard.totalInterest);
  });

  it('graduated plan starts low and ramps up', () => {
    // Arrange
    const input = {
      loanAmount: 40000,
      interestRate: 6,
      plan: 'graduated' as const,
    };

    // Act
    const result = calculateStudentLoan(input);

    // Assert
    expect(result.plan).toBe('Graduated (10 years)');
    expect(result.schedule).toHaveLength(120);
    // Payment at month 1 should be less than payment at month 60 (period grows)
    expect(result.schedule[0].payment).toBeLessThan(result.schedule[60].payment);
  });

  it('totalInterest equals totalPayment - principal', () => {
    // Arrange
    const input = {
      loanAmount: 20000,
      interestRate: 5,
      plan: 'standard' as const,
    };

    // Act
    const result = calculateStudentLoan(input);

    // Assert
    expect(result.totalInterest).toBeCloseTo(
      result.totalPayment - input.loanAmount,
      0,
    );
  });

  it('handles 0% interest rate on standard plan', () => {
    // Arrange
    const input = {
      loanAmount: 12000,
      interestRate: 0,
      plan: 'standard' as const,
    };

    // Act
    const result = calculateStudentLoan(input);

    // Assert
    expect(result.monthlyPayment).toBeCloseTo(100, 2);
    expect(result.totalInterest).toBeCloseTo(0, 2);
  });
});

describe('compareStudentLoanPlans', () => {
  it('returns 3 plan results in standard / extended / graduated order', () => {
    // Arrange / Act
    const plans = compareStudentLoanPlans(25000, 6);

    // Assert
    expect(plans).toHaveLength(3);
    expect(plans[0].plan).toBe('Standard (10 years)');
    expect(plans[1].plan).toBe('Extended (25 years)');
    expect(plans[2].plan).toBe('Graduated (10 years)');
  });

  it('all plan results have positive monthly payments and schedules', () => {
    // Arrange / Act
    const plans = compareStudentLoanPlans(35000, 4.5);

    // Assert
    plans.forEach((p) => {
      expect(p.monthlyPayment).toBeGreaterThan(0);
      expect(p.schedule.length).toBeGreaterThan(0);
    });
  });
});
