'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import NumberInput from '@/components/calculator/NumberInput';
import ResultCard from '@/components/calculator/ResultCard';
import AmortizationTable from '@/components/calculator/AmortizationTable';
import PaymentChart from '@/components/calculator/PaymentChart';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { calculateAutoLoan } from '@/lib/calculators/auto-loan';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber } from '@/lib/share';

const LOAN_TERMS = [36, 48, 60, 72, 84];

const FAQ_ITEMS = [
  {
    question: 'How is my monthly auto loan payment calculated?',
    answer:
      'Your monthly auto loan payment is calculated using the loan amount (vehicle price minus down payment and trade-in value), the annual interest rate divided by 12 for the monthly rate, and the total number of monthly payments. The standard amortization formula ensures each payment covers both principal and interest, with early payments weighted more toward interest.',
  },
  {
    question: 'What is a good interest rate for an auto loan?',
    answer:
      'A good auto loan interest rate depends on your credit score, the loan term, and whether the vehicle is new or used. As of 2024, rates for new cars with excellent credit can range from 3% to 6%, while used car rates tend to be 1-2% higher. Shorter loan terms generally come with lower interest rates.',
  },
  {
    question: 'Should I make a larger down payment on my car?',
    answer:
      'A larger down payment reduces your loan amount, which lowers your monthly payment and the total interest you pay over the life of the loan. Experts recommend putting at least 20% down on a new car and 10% on a used car to avoid being upside down on the loan (owing more than the car is worth).',
  },
  {
    question: 'How does trade-in value affect my auto loan?',
    answer:
      'Your trade-in value is subtracted from the vehicle price before calculating the loan amount, similar to a down payment. A higher trade-in value means a smaller loan, lower monthly payments, and less total interest paid. Be sure to research your trade-in vehicle\'s market value to negotiate the best deal at the dealership.',
  },
];

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Finance Calculators', href: '/' },
  { label: 'Car Payment Calculator' },
];

const BREADCRUMB_JSON_LD_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Finance Calculators', url: SITE_URL },
  { name: 'Car Payment Calculator', url: `${SITE_URL}/calculator/auto-loan` },
];

export default function AutoLoanCalculatorPage() {
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(5.5);

  useEffect(() => {
    document.title = 'Car Payment Calculator - Auto Loan Estimator | CalcPick';
    const params = new URLSearchParams(window.location.search);
    const vp = getParamNumber(params, 'vp');
    const dp = getParamNumber(params, 'dp');
    const tv = getParamNumber(params, 'tv');
    const lt = getParamNumber(params, 'lt');
    const ir = getParamNumber(params, 'ir');
    if (vp !== null) setVehiclePrice(vp);
    if (dp !== null) setDownPayment(dp);
    if (tv !== null) setTradeInValue(tv);
    if (lt !== null) setLoanTerm(lt);
    if (ir !== null) setInterestRate(ir);
  }, []);

  const getShareUrl = useCallback(
    () => buildShareUrl('/calculator/auto-loan', {
      vp: vehiclePrice, dp: downPayment, tv: tradeInValue, lt: loanTerm, ir: interestRate,
    }),
    [vehiclePrice, downPayment, tradeInValue, loanTerm, interestRate]
  );

  const result = useMemo(() => {
    return calculateAutoLoan({
      vehiclePrice,
      downPayment,
      tradeInValue,
      loanTerm,
      interestRate,
    });
  }, [vehiclePrice, downPayment, tradeInValue, loanTerm, interestRate]);

  const loanAmount = vehiclePrice - downPayment - tradeInValue;

  const resultItems = [
    {
      label: 'Monthly Payment',
      value: formatCurrency(result.monthlyPayment),
      highlight: true,
      subtext: `${loanTerm}mo / ${interestRate}% APR`,
    },
    {
      label: 'Total Interest',
      value: formatCurrency(result.totalInterest),
      subtext: `${((result.totalInterest / loanAmount) * 100).toFixed(1)}% of loan`,
    },
    {
      label: 'Total Cost',
      value: formatCurrency(result.totalPayment + downPayment + tradeInValue),
    },
    {
      label: 'Loan Amount',
      value: formatCurrency(loanAmount),
    },
  ];

  return (
    <>
      <WebApplicationJsonLd
        name="Car Payment Calculator"
        description="Calculate your monthly car payment with trade-in value, down payment, and auto loan terms. See total interest and a detailed amortization schedule."
        url={`${SITE_URL}/calculator/auto-loan`}
      />
      <FAQJsonLd questions={FAQ_ITEMS} />
      <BreadcrumbJsonLd items={BREADCRUMB_JSON_LD_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Car Payment Calculator
            </h1>
            <ShareButton getShareUrl={getShareUrl} />
          </div>
          <p className="text-text-secondary text-lg max-w-3xl">
            Estimate your monthly car payment with trade-in value, down payment, and auto loan terms.
          </p>
        </div>

        {/* Top Ad */}
        <AdSense slot="header" variant="banner" />

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <CalculatorForm>
              <NumberInput
                label="Vehicle Price"
                value={vehiclePrice}
                onChange={setVehiclePrice}
                min={1000}
                max={500000}
                step={500}
                prefix="$"
                showSlider
              />
              <NumberInput
                label="Down Payment"
                value={downPayment}
                onChange={setDownPayment}
                min={0}
                max={vehiclePrice}
                step={500}
                prefix="$"
                showSlider
              />
              <NumberInput
                label="Trade-In Value"
                value={tradeInValue}
                onChange={setTradeInValue}
                min={0}
                max={vehiclePrice}
                step={500}
                prefix="$"
                showSlider
              />
              <NumberInput
                label="Interest Rate (APR)"
                value={interestRate}
                onChange={setInterestRate}
                min={0}
                max={30}
                step={0.1}
                suffix="%"
                showSlider
              />
              <NumberInput
                label="Loan Term"
                value={loanTerm}
                onChange={setLoanTerm}
                min={12}
                max={96}
                step={12}
                suffix="mo"
                showSlider
              />

              {/* Quick Term Buttons */}
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {LOAN_TERMS.map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        loanTerm === term
                          ? 'bg-accent-500 text-white'
                          : 'bg-dark-elevated border border-dark-border text-text-secondary hover:text-text-primary hover:border-accent-500/50'
                      }`}
                    >
                      {term} months
                    </button>
                  ))}
                </div>
              </div>
            </CalculatorForm>
          </div>

          {/* Right Column: Results + Ad Sidebar */}
          <div className="space-y-6">
            <ResultCard title="Your Auto Loan Summary" items={resultItems} />
            <AdSense slot="sidebar" variant="sidebar" format="rectangle" />
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

        {/* Amortization Table */}
        <div className="mb-8">
          <AmortizationTable schedule={result.schedule} />
        </div>

        {/* In-Article Ad */}
        <AdSense slot="in-article" variant="in-feed" />

        {/* SEO Content */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 mb-8">
          <article className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How Does an Auto Loan Calculator Work?
            </h2>
            <p className="text-text-secondary mb-4">
              An auto loan calculator uses the standard amortization formula to determine your monthly
              car payment. It takes into account the vehicle price, your down payment, any trade-in
              value, the loan term (in months), and the annual interest rate (APR). By subtracting
              your down payment and trade-in value from the vehicle price, the calculator determines
              the principal loan amount.
            </p>
            <p className="text-text-secondary mb-4">
              The monthly payment is then calculated using the formula:
            </p>
            <div className="bg-dark-elevated border border-dark-border rounded-lg p-4 mb-4">
              <p className="text-text-primary font-mono text-sm text-center">
                M = P &times; [r(1 + r)<sup>n</sup>] / [(1 + r)<sup>n</sup> - 1]
              </p>
              <p className="text-text-tertiary text-xs text-center mt-2">
                Where M = monthly payment, P = principal, r = monthly interest rate, n = number of payments
              </p>
            </div>
            <p className="text-text-secondary mb-4">
              Each monthly payment is split between principal and interest. In the early months, a
              larger portion goes toward interest. As you pay down the principal, more of each payment
              goes toward reducing the balance. The amortization schedule above shows this breakdown
              for every month of your loan.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Tips for Getting the Best Auto Loan
            </h3>
            <ul className="text-text-secondary space-y-2 mb-4">
              <li>
                <strong className="text-text-primary">Check your credit score</strong> before applying.
                A higher score qualifies you for lower interest rates.
              </li>
              <li>
                <strong className="text-text-primary">Compare offers</strong> from banks, credit unions,
                and dealerships to find the best rate.
              </li>
              <li>
                <strong className="text-text-primary">Choose a shorter loan term</strong> if you can
                afford higher monthly payments -- you will pay significantly less in total interest.
              </li>
              <li>
                <strong className="text-text-primary">Put at least 20% down</strong> on a new vehicle
                to avoid negative equity and reduce your loan amount.
              </li>
              <li>
                <strong className="text-text-primary">Consider the total cost</strong>, not just the
                monthly payment. A longer term has lower payments but much higher total interest.
              </li>
            </ul>
          </article>
        </div>

        {/* FAQ Section */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="border-b border-dark-border pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {faq.question}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Ad */}
        <AdSense slot="footer" variant="banner" />
      </div>
    </>
  );
}
