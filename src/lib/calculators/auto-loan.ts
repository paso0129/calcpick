import { LoanResult, AmortizationRow } from '@/types/calculator';

interface AutoLoanInput {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  loanTerm: number; // months
  interestRate: number; // annual %
}

export function calculateAutoLoan(input: AutoLoanInput): LoanResult {
  const principal = input.vehiclePrice - input.downPayment - input.tradeInValue;
  const monthlyRate = input.interestRate / 100 / 12;
  const numPayments = input.loanTerm;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / numPayments;
  } else {
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let i = 1; i <= numPayments; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    });
  }

  return {
    monthlyPayment,
    totalPayment: monthlyPayment * numPayments,
    totalInterest: (monthlyPayment * numPayments) - principal,
    schedule,
  };
}
