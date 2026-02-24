'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import NumberInput from '@/components/calculator/NumberInput';
import ResultCard from '@/components/calculator/ResultCard';
import ComparisonPanel from '@/components/calculator/ComparisonPanel';
import AmortizationTable from '@/components/calculator/AmortizationTable';
import PaymentChart from '@/components/calculator/PaymentChart';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { calculateStudentLoan, compareStudentLoanPlans } from '@/lib/calculators/student-loan';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber, getParamString } from '@/lib/share';

type RepaymentPlan = 'standard' | 'extended' | 'graduated';

const PLAN_OPTIONS: { value: RepaymentPlan; label: string }[] = [
  { value: 'standard', label: 'Standard 10yr' },
  { value: 'extended', label: 'Extended 25yr' },
  { value: 'graduated', label: 'Graduated 10yr' },
];

const FAQ_QUESTIONS = [
  {
    question: 'What is a student loan calculator?',
    answer:
      'A student loan calculator is a free online tool that helps you estimate your monthly payments, total interest costs, and overall repayment amount based on your loan balance, interest rate, and chosen repayment plan. It allows you to compare different repayment options side by side.',
  },
  {
    question: 'What are the different student loan repayment plans?',
    answer:
      'The three main repayment plans are: Standard (10-year fixed payments), Extended (25-year fixed payments with lower monthly costs but more total interest), and Graduated (10-year plan where payments start low and increase every two years). Each plan has trade-offs between monthly affordability and total cost.',
  },
  {
    question: 'How is student loan interest calculated?',
    answer:
      'Student loan interest is typically calculated daily based on your outstanding principal balance. The daily interest rate is your annual rate divided by 365.25. Each month, a portion of your payment covers the accrued interest, and the remainder reduces your principal balance.',
  },
  {
    question: 'Should I choose a standard or extended repayment plan?',
    answer:
      'A standard 10-year plan has higher monthly payments but saves you significantly on total interest. An extended 25-year plan lowers your monthly payment but can cost thousands more in interest over the life of the loan. Use the comparison feature above to see the exact difference for your loan amount.',
  },
];

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Finance Calculators', href: '/calculator' },
  { label: 'Student Loan Calculator' },
];

const BREADCRUMB_JSON_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Finance Calculators', url: `${SITE_URL}/calculator` },
  { name: 'Student Loan Calculator', url: `${SITE_URL}/calculator/student-loan` },
];

export default function StudentLoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(35000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [plan, setPlan] = useState<RepaymentPlan>('standard');

  useEffect(() => {
    document.title = 'Student Loan Calculator - Compare Repayment Plans | CalcPick';
    const params = new URLSearchParams(window.location.search);
    const la = getParamNumber(params, 'la');
    const ir = getParamNumber(params, 'ir');
    const p = getParamString(params, 'plan');
    if (la !== null) setLoanAmount(la);
    if (ir !== null) setInterestRate(ir);
    if (p === 'standard' || p === 'extended' || p === 'graduated') setPlan(p);
  }, []);

  const getShareUrl = useCallback(
    () => buildShareUrl('/calculator/student-loan', { la: loanAmount, ir: interestRate, plan }),
    [loanAmount, interestRate, plan]
  );

  const result = useMemo(
    () => calculateStudentLoan({ loanAmount, interestRate, plan }),
    [loanAmount, interestRate, plan]
  );

  const allPlans = useMemo(
    () => compareStudentLoanPlans(loanAmount, interestRate),
    [loanAmount, interestRate]
  );

  const lowestMonthly = Math.min(...allPlans.map((p) => p.monthlyPayment));
  const lowestInterest = Math.min(...allPlans.map((p) => p.totalInterest));
  const lowestTotal = Math.min(...allPlans.map((p) => p.totalPayment));

  return (
    <>
      <WebApplicationJsonLd
        name="Student Loan Calculator"
        description="Compare student loan repayment plans and calculate your monthly payments, total interest, and overall cost."
        url={`${SITE_URL}/calculator/student-loan`}
      />
      <FAQJsonLd questions={FAQ_QUESTIONS} />
      <BreadcrumbJsonLd items={BREADCRUMB_JSON_ITEMS} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={BREADCRUMB_ITEMS} />

        {/* Page Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-3xl font-bold text-text-primary">Student Loan Calculator</h1>
            <ShareButton getShareUrl={getShareUrl} />
          </div>
          <p className="text-text-secondary">
            Compare repayment plans and calculate your monthly student loan payments.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Calculator Form */}
          <div className="lg:col-span-2">
            <CalculatorForm>
              <NumberInput
                label="Loan Amount"
                value={loanAmount}
                onChange={setLoanAmount}
                min={5000}
                max={200000}
                step={1000}
                prefix="$"
                showSlider
              />

              <NumberInput
                label="Interest Rate"
                value={interestRate}
                onChange={setInterestRate}
                min={1}
                max={12}
                step={0.125}
                suffix="%"
                showSlider
              />

              {/* Repayment Plan Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Repayment Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PLAN_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPlan(option.value)}
                      className={`px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                        plan === option.value
                          ? 'bg-accent-500 text-white border-accent-500'
                          : 'bg-dark-elevated text-text-secondary border-dark-border hover:border-accent-500/50 hover:text-text-primary'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </CalculatorForm>
          </div>

          {/* Right: Result Card + AdSense */}
          <div className="lg:col-span-1 space-y-6">
            <ResultCard
              title="Your Results"
              items={[
                {
                  label: 'Monthly Payment',
                  value: formatCurrency(result.monthlyPayment),
                  highlight: true,
                  subtext: plan === 'graduated' ? 'Starting payment' : undefined,
                },
                {
                  label: 'Total Interest',
                  value: formatCurrency(result.totalInterest),
                },
                {
                  label: 'Total Cost',
                  value: formatCurrency(result.totalPayment),
                },
                {
                  label: 'Repayment Plan',
                  value: result.plan,
                },
              ]}
            />

            <AdSense slot="sidebar" variant="sidebar" />
          </div>
        </div>

        {/* Comparison Panel */}
        <div className="mb-8">
          <ComparisonPanel
            title="Compare All Repayment Plans"
            headers={['Standard (10yr)', 'Extended (25yr)', 'Graduated (10yr)']}
            items={[
              {
                label: 'Monthly Payment',
                values: allPlans.map((p) => formatCurrency(p.monthlyPayment)),
                highlight: allPlans.findIndex((p) => p.monthlyPayment === lowestMonthly),
              },
              {
                label: 'Total Interest',
                values: allPlans.map((p) => formatCurrency(p.totalInterest)),
                highlight: allPlans.findIndex((p) => p.totalInterest === lowestInterest),
              },
              {
                label: 'Total Cost',
                values: allPlans.map((p) => formatCurrency(p.totalPayment)),
                highlight: allPlans.findIndex((p) => p.totalPayment === lowestTotal),
              },
            ]}
          />
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

        {/* Amortization Table */}
        <div className="mb-8">
          <AmortizationTable schedule={result.schedule} showYearly />
        </div>

        {/* In-feed Ad */}
        <AdSense slot="in-article" variant="in-feed" />

        {/* SEO Content */}
        <div className="mt-12 mb-8">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How Does a Student Loan Calculator Work?
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary space-y-4">
              <p>
                A student loan calculator estimates your monthly payments and total repayment costs
                based on your loan amount, interest rate, and chosen repayment plan. It uses standard
                amortization formulas to break down each payment into principal and interest
                components, giving you a clear picture of how your debt will be paid off over time.
              </p>
              <p>
                The <strong className="text-text-primary">Standard repayment plan</strong> spreads
                your loan over 10 years with fixed monthly payments. This is the fastest way to pay
                off your loan and results in the least total interest paid. However, the monthly
                payments are higher compared to other plans.
              </p>
              <p>
                The <strong className="text-text-primary">Extended repayment plan</strong> stretches
                payments over 25 years, significantly reducing your monthly obligation. While this
                makes payments more manageable, you will pay substantially more in total interest
                over the life of the loan.
              </p>
              <p>
                The <strong className="text-text-primary">Graduated repayment plan</strong> also
                spans 10 years but starts with lower payments that increase every two years. This can
                be a good option if you expect your income to grow over time, though it typically
                costs more in total interest than the standard plan.
              </p>
              <p>
                Use the comparison panel above to see exactly how much each plan costs and choose the
                option that best fits your budget and financial goals.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQ_QUESTIONS.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{faq.question}</h3>
                  <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
