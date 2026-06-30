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
import RelatedCalculators from '@/components/RelatedCalculators';
import { calculatePersonalLoan } from '@/lib/calculators/personal-loan';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber } from '@/lib/share';
import { trackCalculatorUse } from '@/lib/analytics';

const TERM_OPTIONS = [12, 24, 36, 48, 60];

const FAQ_DATA = [
  {
    question: 'How is the monthly payment on a personal loan calculated?',
    answer:
      'The monthly payment is calculated using the standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1], where P is the loan principal, r is the monthly interest rate (annual rate divided by 12), and n is the total number of monthly payments. This formula ensures each payment covers both interest and principal so the loan is fully repaid by the end of the term.',
  },
  {
    question: 'What is the difference between APR and interest rate?',
    answer:
      'The interest rate is the cost of borrowing the principal, expressed as a percentage. APR (annual percentage rate) includes the interest rate plus origination fees and other lender charges spread across the loan term. APR is always equal to or higher than the interest rate and gives a more accurate picture of the true cost. When comparing personal loan offers, always compare APR, not just the interest rate.',
  },
  {
    question: 'How much will a $50,000 personal loan cost per month?',
    answer:
      'A $50,000 personal loan at 10% APR for 60 months costs about $1,062 per month, with total interest of roughly $13,742. At 7% APR over 60 months it drops to about $990/month with $9,400 in interest. Use the calculator above to model exact payments for your rate and term — even a 1-2% rate difference adds up to thousands over the life of the loan.',
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
  {
    question: 'What is an unsecured personal loan?',
    answer:
      'An unsecured personal loan does not require collateral such as a house or car. Approval and rate depend entirely on your creditworthiness — credit score, income, and existing debt. Most personal loans from banks, credit unions, and online lenders are unsecured. Because the lender has no asset to seize on default, rates are higher than secured loans like mortgages or auto loans.',
  },
];

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Calculators', href: '/calculator' },
  { label: 'Personal Loan Calculator' },
];

const breadcrumbJsonLdItems = [
  { name: 'Home', url: SITE_URL },
  { name: 'Calculators', url: `${SITE_URL}/calculator` },
  { name: 'Personal Loan Calculator', url: `${SITE_URL}/calculator/personal-loan` },
];

// Static reference matrix: monthly payment per $10,000 borrowed.
const REF_TERMS = [24, 36, 48, 60];
const REF_RATES = [7, 9, 11, 13];
const PAYMENT_PER_10K = REF_TERMS.map((term) => ({
  term,
  payments: REF_RATES.map(
    (rate) =>
      calculatePersonalLoan({ loanAmount: 10000, loanTerm: term, interestRate: rate }).monthlyPayment,
  ),
}));

export default function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(15000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const la = getParamNumber(params, 'la');
    const lt = getParamNumber(params, 'lt');
    const ir = getParamNumber(params, 'ir');
    if (la !== null) setLoanAmount(la);
    if (lt !== null) setLoanTerm(lt);
    if (ir !== null) setInterestRate(ir);
  }, []);

  const getShareUrl = useCallback(
    () => buildShareUrl('/calculator/personal-loan', { la: loanAmount, lt: loanTerm, ir: interestRate }),
    [loanAmount, loanTerm, interestRate]
  );

  const result = useMemo(
    () => calculatePersonalLoan({ loanAmount, loanTerm, interestRate }),
    [loanAmount, loanTerm, interestRate]
  );

  useEffect(() => {
    if (tracked) return;
    if (Number.isFinite(result.monthlyPayment) && result.monthlyPayment > 0) {
      trackCalculatorUse('personal-loan');
      setTracked(true);
    }
  }, [result.monthlyPayment, tracked]);

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
      value: formatCurrency(result.totalPayment),
    },
    {
      label: 'APR',
      value: `${interestRate.toFixed(2)}%`,
    },
  ];

  return (
    <>
      <WebApplicationJsonLd
        name="Personal Loan Calculator"
        description="Free personal loan calculator. Estimate monthly payments, total interest, and APR for unsecured personal loans from $1,000 to $100,000. Instant results, no signup."
        url={`${SITE_URL}/calculator/personal-loan`}
        applicationCategory="FinanceApplication"
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
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Personal Loan Calculator
            </h1>
            <ShareButton getShareUrl={getShareUrl} slug="personal-loan" />
          </div>
          <p className="text-text-secondary text-lg max-w-3xl">
            Calculate monthly payments, total interest, and total cost for your personal loan.
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

        {/* Rate Estimator + Reference Table */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Personal Loan Rate Estimator: How Rates Affect Your Payment
              </h3>
              <p className="text-text-secondary leading-relaxed">
                After the loan amount, your interest rate is the biggest driver of cost. The table
                below estimates the monthly payment per $10,000 borrowed across common rates and
                terms, so you can see at a glance how a few points of APR change what you pay.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Monthly payment per $10,000 borrowed by term and APR
                </caption>
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-text-tertiary font-medium py-2 pr-4">Term</th>
                    {REF_RATES.map((rate) => (
                      <th key={rate} className="text-right text-text-tertiary font-medium py-2 px-3">
                        {rate}% APR
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_PER_10K.map((row) => (
                    <tr key={row.term} className="border-b border-dark-border last:border-0">
                      <td className="py-2.5 pr-4 font-medium text-text-primary">{row.term} months</td>
                      {row.payments.map((payment, i) => (
                        <td key={REF_RATES[i]} className="py-2.5 px-3 text-right text-text-secondary">
                          {formatCurrency(payment)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-text-tertiary mt-3">
                Monthly payment per $10,000 borrowed. A $25,000 loan at 9% over 48 months is about
                2.5&times; the matching cell.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Estimating Your Monthly Payment
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Divide your loan amount by 10,000 and multiply by the matching cell above. A longer
                term lowers the monthly payment but raises total interest, so weigh the trade-off
                before choosing a term.
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

        <RelatedCalculators slug="personal-loan" />

        {/* Bottom Ad */}
        <AdSense slot="footer" variant="banner" />
      </div>
    </>
  );
}
