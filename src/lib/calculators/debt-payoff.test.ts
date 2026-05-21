import { describe, it, expect } from 'vitest';
import { calculateDebtPayoff } from './debt-payoff';
import type { DebtItem } from '@/types/calculator';

const sampleDebts: DebtItem[] = [
  { id: '1', name: 'Card A', balance: 5000, rate: 18, minPayment: 100 },
  { id: '2', name: 'Card B', balance: 1500, rate: 22, minPayment: 50 },
  { id: '3', name: 'Loan', balance: 8000, rate: 8, minPayment: 200 },
];

describe('calculateDebtPayoff', () => {
  it('returns the chosen strategy in the result', () => {
    // Arrange / Act
    const snowball = calculateDebtPayoff(sampleDebts, 100, 'snowball');
    const avalanche = calculateDebtPayoff(sampleDebts, 100, 'avalanche');

    // Assert
    expect(snowball.strategy).toBe('snowball');
    expect(avalanche.strategy).toBe('avalanche');
  });

  it('produces a non-empty schedule that ends with all balances near zero', () => {
    // Arrange / Act
    const result = calculateDebtPayoff(sampleDebts, 200, 'avalanche');
    const lastMonth = result.schedule[result.schedule.length - 1];

    // Assert
    expect(result.schedule.length).toBeGreaterThan(0);
    lastMonth.debts.forEach((d) => {
      expect(d.balance).toBeLessThan(0.05);
    });
  });

  it('extra payment reduces payoffMonths and totalInterest', () => {
    // Arrange / Act
    const noExtra = calculateDebtPayoff(sampleDebts, 0, 'avalanche');
    const withExtra = calculateDebtPayoff(sampleDebts, 300, 'avalanche');

    // Assert
    expect(withExtra.payoffMonths).toBeLessThan(noExtra.payoffMonths);
    expect(withExtra.totalInterest).toBeLessThan(noExtra.totalInterest);
  });

  it('totalInterest is non-negative', () => {
    // Arrange / Act
    const result = calculateDebtPayoff(sampleDebts, 50, 'snowball');

    // Assert
    expect(result.totalInterest).toBeGreaterThanOrEqual(0);
  });

  it('payoffDate is a non-empty formatted string', () => {
    // Arrange / Act
    const result = calculateDebtPayoff(sampleDebts, 100, 'snowball');

    // Assert
    expect(typeof result.payoffDate).toBe('string');
    expect(result.payoffDate.length).toBeGreaterThan(0);
  });

  it('handles a single debt correctly', () => {
    // Arrange
    const single: DebtItem[] = [
      { id: '1', name: 'Solo', balance: 1000, rate: 12, minPayment: 50 },
    ];

    // Act
    const result = calculateDebtPayoff(single, 0, 'avalanche');

    // Assert
    expect(result.payoffMonths).toBeGreaterThan(0);
    const last = result.schedule[result.schedule.length - 1];
    expect(last.debts[0].balance).toBeLessThan(0.05);
  });

  it('caps schedule at 360 months even with extreme debt and low min payments', () => {
    // Arrange — very high interest, very low minimum, no extra
    const stuck: DebtItem[] = [
      { id: '1', name: 'Trap', balance: 50000, rate: 30, minPayment: 10 },
    ];

    // Act
    const result = calculateDebtPayoff(stuck, 0, 'snowball');

    // Assert
    expect(result.payoffMonths).toBeLessThanOrEqual(360);
  });

  it('does not mutate the original debts array order', () => {
    // Arrange
    const debts: DebtItem[] = [
      { id: '1', name: 'A', balance: 5000, rate: 10, minPayment: 100 },
      { id: '2', name: 'B', balance: 1000, rate: 20, minPayment: 50 },
    ];
    const snapshot = JSON.stringify(debts);

    // Act
    calculateDebtPayoff(debts, 100, 'snowball');

    // Assert
    expect(JSON.stringify(debts)).toBe(snapshot);
  });
});
