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
import {
  calculateHistoricalInflation,
  calculateProjectedInflation,
  CPI_DATA,
} from '@/lib/calculators/inflation';
import type { InflationMode } from '@/lib/calculators/inflation';
import { formatCurrency, formatPercent } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber, getParamString } from '@/lib/share';
import { trackCalculatorUse } from '@/lib/analytics';
import dynamic from 'next/dynamic';

const InflationChart = dynamic(() => import('./Charts'), {
  ssr: false,
  loading: () => (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
      <div className="h-6 w-64 max-w-full bg-dark-elevated rounded mb-1" />
      <div className="h-4 w-80 max-w-full bg-dark-elevated rounded mb-4" />
      <div className="h-[380px] rounded-lg bg-dark-elevated/40 animate-pulse" />
    </div>
  ),
});

const MIN_YEAR = Math.min(...Object.keys(CPI_DATA).map(Number));
const MAX_YEAR = Math.max(...Object.keys(CPI_DATA).map(Number));

const FAQ_ITEMS = [
  {
    question: 'How does this inflation calculator work?',
    answer:
      'In Historical mode, the calculator uses US Bureau of Labor Statistics CPI-U annual averages from 1913 to the present. It divides the CPI of the target year by the CPI of the starting year, then multiplies by your original amount. In Future Projection mode, it uses the compound interest formula: Adjusted Value = Amount ÷ (1 + rate)^years to show how purchasing power erodes over time.',
  },
  {
    question: 'What is the CPI and why does it measure inflation?',
    answer:
      'The Consumer Price Index (CPI) tracks the average price of a "basket" of goods and services that typical American households buy — including food, housing, transportation, and medical care. When the CPI rises, each dollar buys less, which is what we call inflation. The US BLS CPI-U (Urban Consumers) series used here covers about 93% of the US population.',
  },
  {
    question: 'Why does inflation erode purchasing power?',
    answer:
      'When the overall price level rises, the same nominal amount of money buys fewer goods and services. For example, $100 in 1980 had the same purchasing power as roughly $374 in 2024, meaning prices have risen about 274% over that period. Savings kept in cash lose real value during inflationary periods unless they earn a return that exceeds the inflation rate.',
  },
  {
    question: 'When should I use Historical vs. Future Projection mode?',
    answer:
      'Use Historical mode to understand how prices have changed in the past — for example, comparing salaries across decades or understanding the real value of historical figures. Use Future Projection mode for financial planning: estimating how much you will need to maintain your current lifestyle in retirement, or how inflation will affect a fixed income stream over time.',
  },
  {
    question: 'How accurate is the future projection?',
    answer:
      'Future projections are estimates based on a constant annual inflation rate that you supply. Actual inflation varies year to year — the US historical average is roughly 3–4% per year over the long run, but rates can spike (as in 2021–2022) or stay very low (as in 2015). The projection is a planning tool, not a guarantee. For conservative planning, use a rate slightly above the long-run average.',
  },
];

export default function InflationCalculator() {
  const [mode, setMode] = useState<InflationMode>('historical');
  const [amount, setAmount] = useState(1000);
  const [fromYear, setFromYear] = useState(1990);
  const [toYear, setToYear] = useState(MAX_YEAR);
  const [projYears, setProjYears] = useState(20);
  const [annualRate, setAnnualRate] = useState(3.0);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = getParamString(params, 'm');
    const a = getParamNumber(params, 'a');
    const fy = getParamNumber(params, 'fy');
    const ty = getParamNumber(params, 'ty');
    const y = getParamNumber(params, 'y');
    const r = getParamNumber(params, 'r');
    if (m === 'historical' || m === 'projection') setMode(m);
    if (a !== null) setAmount(a);
    if (fy !== null) setFromYear(fy);
    if (ty !== null) setToYear(ty);
    if (y !== null) setProjYears(y);
    if (r !== null) setAnnualRate(r);
  }, []);

  const getShareUrl = useCallback(
    () =>
      buildShareUrl('/calculator/inflation', {
        m: mode,
        a: amount,
        fy: fromYear,
        ty: toYear,
        y: projYears,
        r: annualRate,
      }),
    [mode, amount, fromYear, toYear, projYears, annualRate],
  );

  const result = useMemo(() => {
    if (mode === 'historical') {
      return calculateHistoricalInflation({ amount, fromYear, toYear });
    }
    return calculateProjectedInflation({ amount, years: projYears, annualRate });
  }, [mode, amount, fromYear, toYear, projYears, annualRate]);

  useEffect(() => {
    if (tracked) return;
    if (Number.isFinite(result.adjustedValue) && result.adjustedValue > 0) {
      trackCalculatorUse('inflation');
      setTracked(true);
    }
  }, [result.adjustedValue, tracked]);

  const chartData = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        year: String(row.year),
        Value: Math.round(row.value * 100) / 100,
      })),
    [result],
  );

  // Thin out chart ticks for readability
  const tickInterval = useMemo(() => {
    const len = chartData.length;
    if (len <= 20) return 0;
    return Math.max(0, Math.floor(len / 10) - 1);
  }, [chartData.length]);

  const pageUrl = `${SITE_URL}/calculator/inflation`;

  const historicalDirection = toYear >= fromYear ? 'forward' : 'backward';
  const adjustedLabel =
    mode === 'historical'
      ? historicalDirection === 'forward'
        ? `Value in ${toYear}`
        : `Value in ${toYear} (Deflated)`
      : "Today's Purchasing Power";

  const chartTitle =
    mode === 'historical'
      ? 'Purchasing Power Over Time'
      : 'Projected Purchasing Power Erosion';
  const chartSubtitle =
    mode === 'historical'
      ? `Value of ${formatCurrency(amount)} from ${Math.min(fromYear, toYear)} to ${Math.max(fromYear, toYear)} in today's dollars`
      : `Real value of ${formatCurrency(amount)} over the next ${projYears} years at ${annualRate}% inflation`;

  return (
    <>
      <WebApplicationJsonLd
        name="Inflation Calculator"
        description="Convert past dollar amounts to today's value using US CPI data (1913–present), or project future inflation impact on your money."
        url={pageUrl}
        applicationCategory="FinanceApplication"
      />
      <FAQJsonLd questions={FAQ_ITEMS} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Calculators', url: `${SITE_URL}/calculator` },
          { name: 'Inflation Calculator', url: pageUrl },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Calculators', href: '/calculator' },
            { label: 'Inflation Calculator' },
          ]}
        />

        {/* Page Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Inflation Calculator
            </h1>
            <ShareButton getShareUrl={getShareUrl} slug="inflation" />
          </div>
          <p className="text-text-secondary text-lg">
            Convert historical dollar values using US CPI data, or project future purchasing power.
          </p>
        </div>

        {/* Top Ad */}
        <AdSense slot="header" variant="banner" />

        {/* Mode Toggle */}
        <div className="mt-6 mb-4">
          <div className="inline-flex rounded-lg border border-dark-border bg-dark-elevated p-1 gap-1">
            <button
              onClick={() => setMode('historical')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'historical'
                  ? 'bg-accent-500 text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Historical (US CPI)
            </button>
            <button
              onClick={() => setMode('projection')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'projection'
                  ? 'bg-accent-500 text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Future Projection
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Left Column - Calculator Form */}
          <div className="lg:col-span-2">
            <CalculatorForm>
              <NumberInput
                label="Amount"
                value={amount}
                onChange={setAmount}
                min={1}
                max={10000000}
                step={100}
                prefix="$"
                showSlider
              />

              {mode === 'historical' ? (
                <>
                  <NumberInput
                    label="From Year"
                    value={fromYear}
                    onChange={setFromYear}
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    step={1}
                    showSlider
                  />
                  <NumberInput
                    label="To Year"
                    value={toYear}
                    onChange={setToYear}
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    step={1}
                    showSlider
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Data source: US BLS CPI-U annual averages ({MIN_YEAR}–{MAX_YEAR})
                  </p>
                </>
              ) : (
                <>
                  <NumberInput
                    label="Years into the Future"
                    value={projYears}
                    onChange={setProjYears}
                    min={1}
                    max={100}
                    step={1}
                    suffix="years"
                    showSlider
                  />
                  <NumberInput
                    label="Annual Inflation Rate"
                    value={annualRate}
                    onChange={setAnnualRate}
                    min={0}
                    max={30}
                    step={0.1}
                    suffix="%"
                    showSlider
                  />
                </>
              )}
            </CalculatorForm>
          </div>

          {/* Right Column - Results & Ad */}
          <div className="space-y-6">
            <ResultCard
              title="Inflation Summary"
              items={[
                {
                  label: adjustedLabel,
                  value: formatCurrency(result.adjustedValue),
                  highlight: true,
                },
                {
                  label: 'Cumulative Inflation',
                  value: formatPercent(result.cumulativeInflationPct, 2),
                },
                {
                  label: 'Annualized Rate',
                  value: formatPercent(result.annualizedRatePct, 2),
                },
                ...(mode === 'projection'
                  ? [
                      {
                        label: `Future Cost in ${projYears} years`,
                        value: formatCurrency(
                          amount * Math.pow(1 + annualRate / 100, projYears),
                        ),
                        subtext: 'Same purchasing power as today',
                      },
                    ]
                  : []),
              ]}
            />

            <AdSense slot="sidebar" variant="sidebar" />
          </div>
        </div>

        {/* Chart Section (recharts lazy-loaded below the fold) */}
        <div className="mt-8">
          <InflationChart
            title={chartTitle}
            subtitle={chartSubtitle}
            chartData={chartData}
            tickInterval={tickInterval}
          />
        </div>

        {/* In-Article Ad */}
        <div className="mt-8">
          <AdSense slot="in-article" variant="in-feed" />
        </div>

        {/* SEO Content */}
        <div className="mt-12 space-y-8">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How Inflation Erodes Purchasing Power
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary space-y-4">
              <p>
                Inflation is the rate at which the general level of prices for goods and services
                rises over time. As prices increase, each unit of currency buys fewer goods and
                services — this is known as the erosion of purchasing power. For example,{' '}
                {formatCurrency(1000)} in 1990 had the same purchasing power as approximately{' '}
                {formatCurrency(
                  Math.round(
                    calculateHistoricalInflation({ amount: 1000, fromYear: 1990, toYear: MAX_YEAR })
                      .adjustedValue,
                  ),
                )}{' '}
                in {MAX_YEAR}.
              </p>
              <p>
                The US Bureau of Labor Statistics measures inflation through the Consumer Price
                Index (CPI-U), which tracks price changes in a representative basket of goods and
                services purchased by urban consumers. The CPI covers food, housing,
                transportation, medical care, recreation, and education — representing the spending
                patterns of roughly 93% of the US population.
              </p>

              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">
                The CPI Formula
              </h3>
              <div className="bg-dark-elevated border border-dark-border rounded-lg p-4 my-4">
                <p className="text-text-primary font-mono text-center text-base">
                  Adjusted Value = Original Amount × (CPI<sub>target</sub> / CPI<sub>base</sub>)
                </p>
              </div>
              <p>
                Where CPI<sub>target</sub> is the index value in the destination year and CPI
                <sub>base</sub> is the index value in the starting year. Both values use the
                1982–84 base period where CPI = 100.
              </p>

              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">
                When Projections Diverge from Reality
              </h3>
              <p>
                Future inflation projections assume a constant annual rate, but real inflation is
                volatile. The US experienced near-zero inflation in 2015 (0.1%) and over 8%
                inflation in 2022. Long-run averages — historically around 3–4% — smooth out these
                spikes but can still diverge significantly from any individual decade. Projections
                are most useful for setting a planning baseline, not for precise predictions.
              </p>
              <p>
                Supply shocks (oil embargoes, pandemics), monetary policy changes, and demand
                surges can all cause inflation to deviate sharply from any projected rate. When
                planning for retirement or long-term savings, it is prudent to model both a
                conservative scenario (3%) and a higher scenario (5–6%) to understand the range
                of outcomes.
              </p>
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

        <RelatedCalculators slug="inflation" />

        {/* Footer Ad */}
        <div className="mt-8">
          <AdSense slot="footer" variant="banner" />
        </div>
      </div>
    </>
  );
}
