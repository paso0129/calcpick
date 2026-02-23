import { DebtItem, DebtPayoffResult } from '@/types/calculator';

export function calculateDebtPayoff(
  debts: DebtItem[],
  extraPayment: number,
  strategy: 'snowball' | 'avalanche'
): DebtPayoffResult {
  // Sort debts: snowball = lowest balance first, avalanche = highest rate first
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'snowball') return a.balance - b.balance;
    return b.rate - a.rate;
  });

  const balances = sortedDebts.map(d => d.balance);
  const rates = sortedDebts.map(d => d.rate / 100 / 12);
  const minPayments = sortedDebts.map(d => d.minPayment);
  const names = sortedDebts.map(d => d.name);

  const schedule: DebtPayoffResult['schedule'] = [];
  let month = 0;
  const maxMonths = 360; // 30 year cap

  while (balances.some(b => b > 0.01) && month < maxMonths) {
    month++;
    let availableExtra = extraPayment;

    const monthDebts: { name: string; payment: number; balance: number }[] = [];

    // Apply interest and minimum payments
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] <= 0.01) {
        // Freed-up minimum payment becomes extra
        availableExtra += minPayments[i];
        monthDebts.push({ name: names[i], payment: 0, balance: 0 });
        continue;
      }

      // Apply interest
      balances[i] += balances[i] * rates[i];

      // Apply minimum payment
      const payment = Math.min(minPayments[i], balances[i]);
      balances[i] -= payment;
      monthDebts.push({ name: names[i], payment, balance: balances[i] });
    }

    // Apply extra payment to target debt (first non-zero in sorted order)
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] > 0.01 && availableExtra > 0) {
        const extraPmt = Math.min(availableExtra, balances[i]);
        balances[i] -= extraPmt;
        monthDebts[i].payment += extraPmt;
        monthDebts[i].balance = balances[i];
        availableExtra -= extraPmt;
      }
    }

    const totalPayment = monthDebts.reduce((sum, d) => sum + d.payment, 0);
    schedule.push({ month, debts: monthDebts, totalPayment });
  }

  const totalPrincipal = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalPayment = schedule.reduce((sum, s) => sum + s.totalPayment, 0);
  const totalInterest = totalPayment - totalPrincipal;

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);
  const payoffDateStr = payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return {
    strategy,
    totalInterest: Math.max(0, totalInterest),
    totalPayment,
    payoffMonths: month,
    payoffDate: payoffDateStr,
    schedule,
  };
}
