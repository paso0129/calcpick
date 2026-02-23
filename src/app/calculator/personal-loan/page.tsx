'use client';

import { useState, useMemo, useEffect } from 'react';
import NumberInput from '@/components/calculator/NumberInput';
import ResultCard from '@/components/calculator/ResultCard';
import AmortizationTable from '@/components/calculator/AmortizationTable';
import PaymentChart from '@/components/calculator/PaymentChart';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { calculatePersonalLoan } from '@/lib/calculators/personal-loan';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';

const TERM_OPTIONS = [12, 24, 36, 48, 60];

const FAQ_DATA = [
  {
    question: 'What is a personal loan?',
    answer:
      'A personal loan is an unsecured loan from a bank, credit union, or online lender that you repay in fixed monthly installments over a set term. Because they are unsecured, personal loans typically carry higher interest rates than mortgages or auto loans, but they can be used for almost any purpose including debt consolidation, home improvement, or major purchases.',
  },
  {
    question: 'How is the monthly payment on a personal loan calculated?',
    answer:
      'The monthly payment is calculated using the standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1], where P is the loan principal, r is the monthly interest rate (annual rate divided by 12), and n is the total number of monthly payments. This formula ensures each payment covers both interest and principal so the loan is fully repaid by the end of the term.',
  },
  {
    question: 'What factors affect personal loan interest rates?',
    answer:
      'Several factors influence your rate: credit score (higher scores get lower rates), debt-to-income ratio, loan amount, loan term, employment history, and whether you apply with a co-signer. Rates typically range from about 6% for excellent credit to 36% for poor credit. Shopping around and comparing offers from multiple lenders can help you secure a better rate.',
  },
  {
    question: 'Should I choose a shorter or longer loan term?',
    answer:
      'A shorter term means higher monthly payments but significantly less total interest paid. A longer term lowers your monthly payment but increases the total cost of the loan. For example, a $15,000 loan at 8.5% costs about $1,380 in interest over 24 months versus $3,564 over 60 months. Choose a term that balances affordable payments with minimizing total interest.',
  },
];

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Finance Calculators', href: '/calculator' },
  { label: 'Personal Loan Calculator' },
];

const breadcrumbJsonLdItems = [
  { name: 'Home', url: SITE_URL },
  { name: 'Finance Calculators', url: `${SITE_URL}/calculator` },
  { name: 'Personal Loan Calculator', url: `${SITE_URL}/calculator/personal-loan` },
];

export default function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(15000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [interestRate, setInterestRate] = useState(8.5);

  useEffect(() => {
    document.title = 'Personal Loan Calculator - Estimate Monthly Payments | CalcPick';
  }, []);

  const result = useMemo(
    () => calculatePersonalLoan({ loanAmount, loanTerm, interestRate }),
    [loanAmount, loanTerm, interestRate]
  );

  const resultItems = [
    {
      label: 'Monthly Payment',
      value: formatCurrency(result.monthlyPayment),
      highlight: true,
      subtext: `${loanTerm} monthly payments`,
    },
    {
      label: 'Total Interest',
      value: formatCurrency(result.totalInterest),
      subtext: `${((result.totalInterest / loanAmount) * 100).toFixed(1)}% of loan amount`,
    },
    {
      label: 'Total Cost',
      value: formatCurrency(result.totalPayment),
      subtext: 'Principal + Interest',
    },
    {
      label: 'APR',
      value: `${interestRate.toFixed(2)}%`,
      subtext: 'Annual Percentage Rate',
    },
  ];

  return (
    <>
      <WebApplicationJsonLd
        name="Personal Loan Calculator"
        description="Calculate monthly payments and total interest for personal loans. Compare loan terms and interest rates with an interactive amortization schedule."
        url={`${SITE_URL}/calculator/personal-loan`}
      />
      <FAQJsonLd questions={FAQ_DATA} />
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Personal Loan Calculator
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl">
            Estimate your monthly payment, total interest, and total cost for a personal loan. Adjust
            the loan amount, term, and interest rate to find the right plan for your budget.
          </p>
        </div>

        {/* Top Ad */}
        <AdSense slot="header" variant="banner" />

        {/* Calculator + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Form + Results */}
          <div className="lg:col-span-2 space-y-6">
            <CalculatorForm>
              {/* Loan Amount */}
              <NumberInput
                label="Loan Amount"
                value={loanAmount}
                onChange={setLoanAmount}
                min={1000}
                max={100000}
                step={500}
                prefix="$"
                showSlider
                helpText="How much do you need to borrow?"
              />

              {/* Loan Term (button group) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Loan Term (months)
                </label>
                <div className="flex flex-wrap gap-2">
                  {TERM_OPTIONS.map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        loanTerm === term
                          ? 'bg-accent-500 text-white'
                          : 'bg-dark-elevated border border-dark-border text-text-secondary hover:text-text-primary hover:border-accent-500/50'
                      }`}
                    >
                      {term} mo
                      <span className="hidden sm:inline text-xs ml-1 opacity-70">
                        ({term / 12} yr{term > 12 ? 's' : ''})
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-text-tertiary text-xs mt-1">
                  Select the repayment period for your loan
                </p>
              </div>

              {/* Interest Rate */}
              <NumberInput
                label="Interest Rate (APR)"
                value={interestRate}
                onChange={setInterestRate}
                min={1}
                max={36}
                step={0.25}
                suffix="%"
                showSlider
                helpText="Annual percentage rate offered by your lender"
              />
            </CalculatorForm>

            {/* Results */}
            <ResultCard title="Loan Summary" items={resultItems} />
          </div>

          {/* Right Column: Sidebar Ad */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <AdSense slot="sidebar" variant="sidebar" format="vertical" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-8">
          <PaymentChart
            principal={loanAmount}
            totalInterest={result.totalInterest}
            schedule={result.schedule}
            type="both"
          />
        </div>

        {/* In-feed Ad */}
        <AdSense slot="in-article" variant="in-feed" />

        {/* Amortization Table */}
        <div className="mb-12">
          <AmortizationTable schedule={result.schedule} />
        </div>

        {/* SEO Content Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How Does a Personal Loan Calculator Work?
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary space-y-4">
              <p>
                A personal loan calculator uses the standard loan amortization formula to determine
                your fixed monthly payment based on three inputs: the loan amount (principal), the
                annual interest rate (APR), and the loan term in months.
              </p>
              <p>
                The formula works by distributing both principal and interest across equal monthly
                payments. In the early months, a larger portion of each payment goes toward interest.
                As the principal balance decreases, more of each payment is applied to the principal.
                This process is called amortization, and the table below the calculator shows exactly
                how each payment is split.
              </p>
              <p>
                Personal loans are typically unsecured, meaning they do not require collateral like a
                house or car. Because of this, lenders rely more heavily on your creditworthiness
                when setting the interest rate. Borrowers with excellent credit (750+) can often
                qualify for rates below 8%, while those with fair or poor credit may see rates
                between 15% and 36%.
              </p>
              <p>
                Use this calculator to compare different scenarios. Try adjusting the loan term to
                see how a shorter repayment period reduces total interest, or experiment with
                different interest rates to understand the impact on your monthly budget. The
                amortization schedule and payment charts give you a complete picture of your loan
                over time.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <details
                key={index}
                className="group bg-dark-surface border border-dark-border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 text-text-primary font-medium hover:bg-dark-elevated/50 transition-colors">
                  <span>{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-text-tertiary shrink-0 ml-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom Ad */}
        <AdSense slot="footer" variant="banner" />
      </div>
    </>
  );
}
