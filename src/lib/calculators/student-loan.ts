import { StudentLoanResult, AmortizationRow } from '@/types/calculator';

interface StudentLoanInput {
  loanAmount: number;
  interestRate: number; // annual %
  plan: 'standard' | 'extended' | 'graduated';
}

function calculateStandardSchedule(principal: number, monthlyRate: number, numPayments: number): AmortizationRow[] {
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
    const interest = balance * monthlyRate;
    const principalPmt = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPmt);
    schedule.push({ month: i, payment: monthlyPayment, principal: principalPmt, interest, balance });
  }

  return schedule;
}

export function calculateStudentLoan(input: StudentLoanInput): StudentLoanResult {
  const principal = input.loanAmount;
  const monthlyRate = input.interestRate / 100 / 12;

  let numPayments: number;
  let schedule: AmortizationRow[];

  switch (input.plan) {
    case 'standard':
      numPayments = 120; // 10 years
      schedule = calculateStandardSchedule(principal, monthlyRate, numPayments);
      break;

    case 'extended':
      numPayments = 300; // 25 years
      schedule = calculateStandardSchedule(principal, monthlyRate, numPayments);
      break;

    case 'graduated': {
      numPayments = 120; // 10 years
      schedule = [];
      let balance = principal;
      // Payments start low and increase every 2 years
      const basePayment = monthlyRate === 0
        ? principal / numPayments * 0.6
        : principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1) * 0.6;

      for (let i = 1; i <= numPayments; i++) {
        const period = Math.floor((i - 1) / 24); // 2-year periods
        const growthFactor = 1 + (period * 0.2);
        let payment = basePayment * growthFactor;
        const interest = balance * monthlyRate;

        if (i === numPayments) {
          payment = balance + interest;
        }

        const principalPmt = Math.min(payment - interest, balance);
        balance = Math.max(0, balance - principalPmt);

        schedule.push({
          month: i,
          payment: principalPmt + interest,
          principal: principalPmt,
          interest,
          balance,
        });
      }
      break;
    }
  }

  const monthlyPayment = schedule[0]?.payment || 0;
  const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = totalPayment - principal;

  const planNames: Record<string, string> = {
    standard: 'Standard (10 years)',
    extended: 'Extended (25 years)',
    graduated: 'Graduated (10 years)',
  };

  return {
    plan: planNames[input.plan],
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

export function compareStudentLoanPlans(loanAmount: number, interestRate: number): StudentLoanResult[] {
  return (['standard', 'extended', 'graduated'] as const).map(plan =>
    calculateStudentLoan({ loanAmount, interestRate, plan })
  );
}
