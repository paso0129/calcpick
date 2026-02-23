import { LoanResult, AmortizationRow } from '@/types/calculator';

interface MortgageInput {
  homePrice: number;
  downPayment: number;
  loanTerm: number; // years
  interestRate: number; // annual %
  propertyTax: number; // annual
  homeInsurance: number; // annual
}

export function calculateMortgage(input: MortgageInput): LoanResult & {
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
} {
  const principal = input.homePrice - input.downPayment;
  const monthlyRate = input.interestRate / 100 / 12;
  const numPayments = input.loanTerm * 12;
  const monthlyTax = input.propertyTax / 12;
  const monthlyInsurance = input.homeInsurance / 12;

  let monthlyPI: number;
  if (monthlyRate === 0) {
    monthlyPI = principal / numPayments;
  } else {
    monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const monthlyPayment = monthlyPI + monthlyTax + monthlyInsurance;
  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let i = 1; i <= numPayments; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPI - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    schedule.push({
      month: i,
      payment: monthlyPI,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    });
  }

  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = (monthlyPI * numPayments) - principal;

  return {
    monthlyPayment,
    monthlyPrincipalInterest: monthlyPI,
    monthlyTax,
    monthlyInsurance,
    totalPayment,
    totalInterest,
    schedule,
  };
}
