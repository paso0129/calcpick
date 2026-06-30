'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import NumberInput from '@/components/calculator/NumberInput';
import ResultCard from '@/components/calculator/ResultCard';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import RelatedCalculators from '@/components/RelatedCalculators';
import { calculateCompoundInterest } from '@/lib/calculators/compound-interest';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber } from '@/lib/share';
import { trackCalculatorUse } from '@/lib/analytics';
import dynamic from 'next/dynamic';

const CompoundInterestCharts = dynamic(() => import('./Charts'), {
  ssr: false,
  loading: () => (
    <div className="mt-8 space-y-8">
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <div className="h-7 w-60 bg-dark-elevated rounded mb-4" />
        <div className="h-[400px] rounded-lg bg-dark-elevated/40 animate-pulse" />
      </div>
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <div className="h-7 w-60 bg-dark-elevated rounded mb-4" />
        <div className="h-[350px] rounded-lg bg-dark-elevated/40 animate-pulse" />
      </div>
    </div>
  ),
});

const FREQUENCY_OPTIONS = [
  { label: 'Annually', value: 1 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
  { label: 'Daily', value: 365 },
];

const FAQ_ITEMS = [
  {
    question: 'What is compound interest?',
    answer:
      'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, which is calculated only on the principal, compound interest allows your money to grow exponentially over time as you earn "interest on interest."',
  },
  {
    question: 'How does compound frequency affect my returns?',
    answer:
      'The more frequently interest compounds, the more you earn. Daily compounding yields slightly more than monthly, which yields more than quarterly or annually. However, the difference between monthly and daily compounding is relatively small. The biggest jump is from annual to quarterly or monthly compounding.',
  },
  {
    question: 'What is the Rule of 72?',
    answer:
      'The Rule of 72 is a simple way to estimate how long it takes for an investment to double. Divide 72 by your annual interest rate to get the approximate number of years. For example, at 8% interest, your money doubles in approximately 72 / 8 = 9 years.',
  },
  {
    question: 'How much should I invest monthly to reach my goal?',
    answer:
      'The amount depends on your target balance, time horizon, and expected return. Use this calculator to experiment with different monthly contribution amounts. Generally, starting early with consistent contributions, even small ones, is more effective than investing larger amounts later due to the power of compounding.',
  },
  {
    question: 'Is interest compounded monthly better?',
    answer:
      'Yes — for the same annual rate, monthly compounding earns slightly more than annual compounding because interest is added to your balance 12 times a year instead of once, so you begin earning interest on that interest sooner. At 7%, monthly compounding gives an effective annual rate of about 7.23% versus 7.00% for annual compounding, and the gap widens over long time horizons.',
  },
  {
    question: 'How much is compound interest on $10,000 over 10 years?',
    answer:
      'A one-time $10,000 deposit at 7% compounded annually grows to about $19,672 after 10 years — roughly $9,672 of that is compound interest. At 5% it would reach about $16,289, and at 10% about $25,937. Adding regular monthly contributions increases the total substantially.',
  },
];

// Static lump-sum growth scenarios: a $10,000 deposit at 7% compounded annually.
const GROWTH_PRINCIPAL = 10000;
const GROWTH_RATE = 0.07;
const GROWTH_SCENARIOS = [5, 10, 20, 30].map((years) => ({
  years,
  futureValue: GROWTH_PRINCIPAL * Math.pow(1 + GROWTH_RATE, years),
}));

export default function CompoundInterestCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(20);
  const [compoundFrequency, setCompoundFrequency] = useState(12);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ii = getParamNumber(params, 'ii');
    const mc = getParamNumber(params, 'mc');
    const ar = getParamNumber(params, 'ar');
    const y = getParamNumber(params, 'y');
    const cf = getParamNumber(params, 'cf');
    if (ii !== null) setInitialInvestment(ii);
    if (mc !== null) setMonthlyContribution(mc);
    if (ar !== null) setAnnualRate(ar);
    if (y !== null) setYears(y);
    if (cf !== null) setCompoundFrequency(cf);
  }, []);

  const getShareUrl = useCallback(
    () => buildShareUrl('/calculator/compound-interest', {
      ii: initialInvestment, mc: monthlyContribution, ar: annualRate, y: years, cf: compoundFrequency,
    }),
    [initialInvestment, monthlyContribution, annualRate, years, compoundFrequency]
  );

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        initialInvestment,
        monthlyContribution,
        annualRate,
        years,
        compoundFrequency,
      }),
    [initialInvestment, monthlyContribution, annualRate, years, compoundFrequency]
  );

  useEffect(() => {
    if (tracked) return;
    if (Number.isFinite(result.finalBalance) && result.finalBalance > 0) {
      trackCalculatorUse('compound-interest');
      setTracked(true);
    }
  }, [result.finalBalance, tracked]);

  const effectiveAnnualRate = useMemo(() => {
    const r = annualRate / 100;
    const n = compoundFrequency;
    const ear = (Math.pow(1 + r / n, n) - 1) * 100;
    return ear.toFixed(2);
  }, [annualRate, compoundFrequency]);

  const chartData = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        year: `Year ${row.year}`,
        Contributions: Math.round(row.contributions),
        Interest: Math.round(row.interest),
        Balance: Math.round(row.balance),
      })),
    [result]
  );

  const interestPerYearData = useMemo(() => {
    return result.yearlyBreakdown.map((row, index) => {
      const prevInterest = index > 0 ? result.yearlyBreakdown[index - 1].interest : 0;
      return {
        year: `Year ${row.year}`,
        'Interest Earned': Math.round(row.interest - prevInterest),
      };
    });
  }, [result]);

  const pageUrl = `${SITE_URL}/calculator/compound-interest`;

  return (
    <>
      <WebApplicationJsonLd
        name="Compound Interest Calculator"
        description="Calculate how your investments grow over time with compound interest. See detailed projections with charts and yearly breakdowns."
        url={pageUrl}
        applicationCategory="FinanceApplication"
      />
      <FAQJsonLd questions={FAQ_ITEMS} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Calculators', url: `${SITE_URL}/calculator` },
          { name: 'Compound Interest Calculator', url: pageUrl },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Calculators', href: '/calculator' },
            { label: 'Compound Interest Calculator' },
          ]}
        />

        {/* Page Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Compound Interest Calculator
            </h1>
            <ShareButton getShareUrl={getShareUrl} slug="compound-interest" />
          </div>
          <p className="text-text-secondary text-lg">
            See how your investments grow over time with compound interest.
          </p>
        </div>

        {/* Top Ad */}
        <AdSense slot="header" variant="banner" />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Calculator Form */}
          <div className="lg:col-span-2">
            <CalculatorForm>
              <NumberInput
                label="Initial Investment"
                value={initialInvestment}
                onChange={setInitialInvestment}
                min={0}
                max={500000}
                step={1000}
                prefix="$"
                showSlider
              />

              <NumberInput
                label="Monthly Contribution"
                value={monthlyContribution}
                onChange={setMonthlyContribution}
                min={0}
                max={5000}
                step={50}
                prefix="$"
                showSlider
              />

              <NumberInput
                label="Annual Interest Rate"
                value={annualRate}
                onChange={setAnnualRate}
                min={1}
                max={20}
                step={0.1}
                suffix="%"
                showSlider
              />

              <NumberInput
                label="Investment Period"
                value={years}
                onChange={setYears}
                min={1}
                max={50}
                step={1}
                suffix="years"
                showSlider
              />

              {/* Compound Frequency Buttons */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Compound Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FREQUENCY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCompoundFrequency(option.value)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        compoundFrequency === option.value
                          ? 'bg-accent-500 text-white'
                          : 'bg-dark-elevated border border-dark-border text-text-secondary hover:text-text-primary hover:border-accent-500/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </CalculatorForm>
          </div>

          {/* Right Column - Results & Ad */}
          <div className="space-y-6">
            <ResultCard
              title="Investment Summary"
              items={[
                {
                  label: 'Final Balance',
                  value: formatCurrency(result.finalBalance),
                  highlight: true,
                },
                {
                  label: 'Total Contributions',
                  value: formatCurrency(result.totalContributions),
                },
                {
                  label: 'Interest Earned',
                  value: formatCurrency(result.totalInterest),
                  subtext: `${((result.totalInterest / result.totalContributions) * 100).toFixed(1)}% return`,
                },
                {
                  label: 'Effective Rate',
                  value: `${effectiveAnnualRate}%`,
                },
              ]}
            />

            <AdSense slot="sidebar" variant="sidebar" />
          </div>
        </div>

        {/* Charts Section (recharts lazy-loaded below the fold) */}
        <CompoundInterestCharts
          chartData={chartData}
          interestPerYearData={interestPerYearData}
          years={years}
        />

        {/* In-Article Ad */}
        <div className="mt-8">
          <AdSense slot="in-article" variant="in-feed" />
        </div>

        {/* SEO Content Section */}
        <div className="mt-12 space-y-8">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How Does Compound Interest Work?
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary space-y-4">
              <p>
                Compound interest is one of the most powerful concepts in finance. Unlike simple
                interest, which is calculated only on the principal amount, compound interest is
                calculated on the principal plus all previously accumulated interest. This creates a
                snowball effect where your money grows faster and faster over time.
              </p>
              <p>
                The compound interest formula is:
              </p>
              <div className="bg-dark-elevated border border-dark-border rounded-lg p-4 my-4">
                <p className="text-text-primary font-mono text-center text-lg">
                  A = P(1 + r/n)<sup>nt</sup>
                </p>
              </div>
              <p>Where:</p>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>
                  <strong className="text-text-primary">A</strong> = Final amount (principal + interest)
                </li>
                <li>
                  <strong className="text-text-primary">P</strong> = Principal (initial investment)
                </li>
                <li>
                  <strong className="text-text-primary">r</strong> = Annual interest rate (as a decimal)
                </li>
                <li>
                  <strong className="text-text-primary">n</strong> = Number of times interest compounds
                  per year
                </li>
                <li>
                  <strong className="text-text-primary">t</strong> = Number of years
                </li>
              </ul>
              <p>
                For example, if you invest $10,000 at 7% annual interest compounded monthly for 20
                years, your investment would grow to approximately{' '}
                {formatCurrency(10000 * Math.pow(1 + 0.07 / 12, 12 * 20))} without any additional
                contributions. Adding regular monthly contributions accelerates this growth even
                further, which is why consistent investing is so important.
              </p>
              <p>
                The key takeaway is that time is your greatest ally. The earlier you start investing,
                the more time compound interest has to work in your favor. Even small monthly
                contributions can grow into substantial wealth over decades.
              </p>
            </div>
          </div>

          {/* Monthly vs Annual + $10k Growth Scenarios */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Interest Compounded Monthly vs. Annually
            </h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              At your current rate and compounding frequency, each dollar grows at an effective
              annual rate of {effectiveAnnualRate}%. Compounding monthly beats annually because
              interest is added 12 times a year instead of once, so you begin earning interest on
              your interest sooner.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mb-2">
              $10,000 Growth Over Time
            </h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              How a one-time $10,000 deposit grows at 7% compounded annually with no extra
              contributions. Over 10 years it reaches about{' '}
              {formatCurrency(GROWTH_SCENARIOS[1].futureValue)}.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Future value of a $10,000 deposit at 7% compounded annually
                </caption>
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-text-tertiary font-medium py-2 pr-4">Years</th>
                    <th className="text-right text-text-tertiary font-medium py-2 px-3">Future Value</th>
                    <th className="text-right text-text-tertiary font-medium py-2 px-3">Interest Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {GROWTH_SCENARIOS.map((s) => (
                    <tr key={s.years} className="border-b border-dark-border last:border-0">
                      <td className="py-2.5 pr-4 font-medium text-text-primary">{s.years} years</td>
                      <td className="py-2.5 px-3 text-right text-text-secondary">
                        {formatCurrency(s.futureValue)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-text-secondary">
                        {formatCurrency(s.futureValue - GROWTH_PRINCIPAL)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{item.question}</h3>
                  <p className="text-text-secondary leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <RelatedCalculators slug="compound-interest" />

        {/* Footer Ad */}
        <div className="mt-8">
          <AdSense slot="footer" variant="banner" />
        </div>
      </div>
    </>
  );
}
