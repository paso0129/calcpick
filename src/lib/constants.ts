import { CalculatorMeta } from '@/types/calculator';

export const SITE_NAME = 'CalcPick';
export const SITE_URL = 'https://www.calcpick.com';
export const SITE_DESCRIPTION = 'Free online calculators and unit converters. From mortgage payments to temperature conversions — accurate, instant tools for everyday math and financial planning.';

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: 'basic',
    title: 'Professional Calculator',
    shortTitle: 'Calculator',
    description: 'High-precision arithmetic calculator with scientific functions and history log.',
    icon: '🔢',
    category: 'Utility',
  },
  {
    slug: 'unit-converter',
    title: 'Unit Converter',
    shortTitle: 'Unit Converter',
    description: 'Convert 100+ units across 17 categories including radiation, frequency, power, force, data rate, and more.',
    icon: '🔄',
    category: 'Utility',
  },
  {
    slug: 'mortgage',
    title: 'Mortgage Calculator',
    shortTitle: 'Mortgage',
    description: 'Calculate your monthly mortgage payment, total interest, and view a detailed amortization schedule.',
    icon: '🏠',
    category: 'Finance',
  },
  {
    slug: 'auto-loan',
    title: 'Auto Loan Calculator',
    shortTitle: 'Auto Loan',
    description: 'Estimate your monthly car payment with trade-in value, down payment, and loan terms.',
    icon: '🚗',
    category: 'Finance',
  },
  {
    slug: 'personal-loan',
    title: 'Personal Loan Calculator',
    shortTitle: 'Personal Loan',
    description: 'Calculate monthly payments and total interest for personal loans of any size.',
    icon: '💳',
    category: 'Finance',
  },
  {
    slug: 'student-loan',
    title: 'Student Loan Calculator',
    shortTitle: 'Student Loan',
    description: 'Compare repayment plans and calculate your monthly student loan payments.',
    icon: '🎓',
    category: 'Finance',
  },
  {
    slug: 'compound-interest',
    title: 'Compound Interest Calculator',
    shortTitle: 'Compound Interest',
    description: 'See how your investments grow over time with the power of compound interest.',
    icon: '📈',
    category: 'Finance',
  },
  {
    slug: 'debt-payoff',
    title: 'Debt Payoff Calculator',
    shortTitle: 'Debt Payoff',
    description: 'Compare snowball vs avalanche strategies to find the fastest way to become debt-free.',
    icon: '🎯',
    category: 'Finance',
  },
];
