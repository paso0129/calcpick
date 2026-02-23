export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: {
    year: number;
    balance: number;
    contributions: number;
    interest: number;
  }[];
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

export interface DebtPayoffResult {
  strategy: 'snowball' | 'avalanche';
  totalInterest: number;
  totalPayment: number;
  payoffMonths: number;
  payoffDate: string;
  schedule: {
    month: number;
    debts: { name: string; payment: number; balance: number }[];
    totalPayment: number;
  }[];
}

export interface StudentLoanResult {
  plan: string;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export interface CalculatorMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  category: string;
}
