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
import { calculateMortgage } from '@/lib/calculators/mortgage';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';

const PAGE_TITLE = 'Mortgage Calculator - Calculate Your Monthly Payment | CalcPick';
const PAGE_URL = `${SITE_URL}/calculator/mortgage`;

const FAQ_ITEMS = [
  {
    question: 'How is a monthly mortgage payment calculated?',
    answer:
      'A monthly mortgage payment is calculated using the loan principal (home price minus down payment), the annual interest rate divided by 12, and the total number of monthly payments. The standard formula is M = P[r(1+r)^n]/[(1+r)^n-1], where M is the monthly payment, P is the principal, r is the monthly interest rate, and n is the number of payments. Property tax and homeowners insurance are then added to determine your total monthly housing cost.',
  },
  {
    question: 'How much down payment do I need for a mortgage?',
    answer:
      'The typical down payment ranges from 3% to 20% of the home price. Conventional loans often require at least 5%, while FHA loans may accept as low as 3.5%. Putting down 20% or more lets you avoid private mortgage insurance (PMI), which can save you hundreds of dollars per month. A larger down payment also means lower monthly payments and less total interest paid over the life of the loan.',
  },
  {
    question: 'Should I choose a 15-year or 30-year mortgage?',
    answer:
      'A 15-year mortgage has higher monthly payments but saves significantly on total interest. A 30-year mortgage has lower monthly payments, making it more affordable month-to-month, but you pay more interest over the life of the loan. For example, on a $280,000 loan at 6.5%, a 15-year term saves over $150,000 in interest compared to a 30-year term. Choose based on your monthly budget and long-term financial goals.',
  },
  {
    question: 'What factors affect my mortgage interest rate?',
    answer:
      'Mortgage interest rates are influenced by your credit score, down payment size, loan term, loan type (fixed vs. adjustable), and current market conditions. A higher credit score (740+) typically qualifies you for the best rates. Larger down payments can also secure lower rates. Shopping around and comparing offers from multiple lenders can help you find the most competitive rate available.',
  },
];

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Finance Calculators', href: '/' },
  { label: 'Mortgage Calculator' },
];

const BREADCRUMB_JSON_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Finance Calculators', url: SITE_URL },
  { name: 'Mortgage Calculator', url: PAGE_URL },
];

export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTax, setPropertyTax] = useState(3600);
  const [homeInsurance, setHomeInsurance] = useState(1200);

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const result = useMemo(
    () =>
      calculateMortgage({
        homePrice,
        downPayment,
        loanTerm,
        interestRate,
        propertyTax,
        homeInsurance,
      }),
    [homePrice, downPayment, loanTerm, interestRate, propertyTax, homeInsurance]
  );

  const loanAmount = homePrice - downPayment;

  const resultItems = [
    {
      label: 'Monthly Payment',
      value: formatCurrency(result.monthlyPayment),
      highlight: true,
      subtext: 'Principal, interest, tax & insurance',
    },
    {
      label: 'Principal & Interest',
      value: formatCurrency(result.monthlyPrincipalInterest),
    },
    {
      label: 'Monthly Tax',
      value: formatCurrency(result.monthlyTax),
    },
    {
      label: 'Monthly Insurance',
      value: formatCurrency(result.monthlyInsurance),
    },
    {
      label: 'Total Interest',
      value: formatCurrency(result.totalInterest),
      subtext: `Over ${loanTerm} years`,
    },
    {
      label: 'Total Cost',
      value: formatCurrency(result.totalPayment),
      subtext: 'All payments combined',
    },
  ];

  const downPaymentPercent = homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : '0.0';

  return (
    <>
      <BreadcrumbJsonLd items={BREADCRUMB_JSON_ITEMS} />
      <WebApplicationJsonLd
        name="Mortgage Calculator"
        description="Calculate your monthly mortgage payment, total interest, and view a detailed amortization schedule. Free online mortgage calculator with property tax and insurance."
        url={PAGE_URL}
      />
      <FAQJsonLd questions={FAQ_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Mortgage Calculator
          </h1>
          <p className="text-text-secondary text-lg">
            Estimate your monthly mortgage payment including principal, interest, taxes, and
            insurance.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left column - Form */}
          <div className="lg:col-span-5">
            <CalculatorForm>
              <NumberInput
                label="Home Price"
                value={homePrice}
                onChange={setHomePrice}
                min={50000}
                max={2000000}
                step={5000}
                prefix="$"
                showSlider
              />

              <NumberInput
                label="Down Payment"
                value={downPayment}
                onChange={(val) => setDownPayment(Math.min(val, homePrice * 0.5))}
                min={0}
                max={homePrice * 0.5}
                step={1000}
                prefix="$"
                showSlider
                helpText={`${downPaymentPercent}% of home price`}
              />

              {/* Loan Term Toggle */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Loan Term
                </label>
                <div className="flex bg-dark-elevated rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setLoanTerm(15)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      loanTerm === 15
                        ? 'bg-accent-500 text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    15 Years
                  </button>
                  <button
                    onClick={() => setLoanTerm(30)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      loanTerm === 30
                        ? 'bg-accent-500 text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    30 Years
                  </button>
                </div>
              </div>

              <NumberInput
                label="Interest Rate"
                value={interestRate}
                onChange={setInterestRate}
                min={1}
                max={15}
                step={0.125}
                suffix="%"
                showSlider
              />

              <NumberInput
                label="Property Tax"
                value={propertyTax}
                onChange={setPropertyTax}
                min={0}
                max={20000}
                step={100}
                prefix="$"
                suffix="/yr"
                showSlider
              />

              <NumberInput
                label="Home Insurance"
                value={homeInsurance}
                onChange={setHomeInsurance}
                min={0}
                max={10000}
                step={100}
                prefix="$"
                suffix="/yr"
                showSlider
              />
            </CalculatorForm>
          </div>

          {/* Right column - Results + Sidebar Ad */}
          <div className="lg:col-span-7 space-y-6">
            <ResultCard title="Your Mortgage Summary" items={resultItems} />

            <AdSense slot="sidebar" variant="sidebar" format="auto" />

            {/* Loan details summary */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Loan Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-tertiary">Home Price</p>
                  <p className="text-text-primary font-medium">{formatCurrency(homePrice)}</p>
                </div>
                <div>
                  <p className="text-text-tertiary">Down Payment</p>
                  <p className="text-text-primary font-medium">
                    {formatCurrency(downPayment)} ({downPaymentPercent}%)
                  </p>
                </div>
                <div>
                  <p className="text-text-tertiary">Loan Amount</p>
                  <p className="text-text-primary font-medium">{formatCurrency(loanAmount)}</p>
                </div>
                <div>
                  <p className="text-text-tertiary">Loan Term</p>
                  <p className="text-text-primary font-medium">{loanTerm} years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Chart */}
        <div className="mb-8">
          <PaymentChart
            principal={loanAmount}
            totalInterest={result.totalInterest}
            schedule={result.schedule}
            type="both"
          />
        </div>

        {/* In-content Ad */}
        <div className="mb-8">
          <AdSense slot="in-article" variant="in-feed" format="auto" />
        </div>

        {/* Amortization Table */}
        <div className="mb-12">
          <AmortizationTable schedule={result.schedule} showYearly />
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How Does a Mortgage Calculator Work?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              A mortgage calculator helps you estimate your monthly housing costs before you commit
              to a home loan. It uses the standard amortization formula to break down each payment
              into principal and interest, then adds property taxes and homeowners insurance to give
              you a complete picture of your monthly obligation. By adjusting the home price, down
              payment, loan term, and interest rate, you can quickly compare different scenarios to
              find a mortgage that fits your budget. Understanding these numbers upfront helps you
              shop for homes with confidence and negotiate better terms with lenders.
            </p>

            {/* FAQ Section */}
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-dark-elevated rounded-lg border border-dark-border"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-text-primary font-medium text-sm sm:text-base">
                    {faq.question}
                    <svg
                      className="w-5 h-5 text-text-tertiary transition-transform group-open:rotate-180 flex-shrink-0 ml-3"
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
                  <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
