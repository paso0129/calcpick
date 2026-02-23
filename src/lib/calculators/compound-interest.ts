import { CompoundInterestResult } from '@/types/calculator';

interface CompoundInterestInput {
  initialInvestment: number;
  monthlyContribution: number;
  annualRate: number; // %
  years: number;
  compoundFrequency: number; // times per year (1=annually, 4=quarterly, 12=monthly, 365=daily)
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { initialInvestment, monthlyContribution, annualRate, years, compoundFrequency } = input;
  const rate = annualRate / 100;
  const n = compoundFrequency;

  const yearlyBreakdown: CompoundInterestResult['yearlyBreakdown'] = [];
  let balance = initialInvestment;
  let totalContributions = initialInvestment;

  for (let year = 1; year <= years; year++) {
    // Apply compound interest and monthly contributions for this year
    for (let month = 1; month <= 12; month++) {
      // Add monthly contribution at the start of each month
      balance += monthlyContribution;
      totalContributions += monthlyContribution;

      // Apply interest based on compound frequency
      if (n === 12) {
        // Monthly compounding
        balance *= (1 + rate / n);
      } else if (n === 365) {
        // Daily - approximate for the month (30.44 days)
        const dailyRate = rate / 365;
        balance *= Math.pow(1 + dailyRate, 30.44);
      } else if (n === 4) {
        // Quarterly - apply quarterly rate every 3 months
        if (month % 3 === 0) {
          balance *= (1 + rate / n);
        }
      } else if (n === 1) {
        // Annually - apply at year end
        if (month === 12) {
          balance *= (1 + rate);
        }
      }
    }

    yearlyBreakdown.push({
      year,
      balance,
      contributions: totalContributions,
      interest: balance - totalContributions,
    });
  }

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    yearlyBreakdown,
  };
}
