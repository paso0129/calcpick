'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber, getParamString } from '@/lib/share';
import { trackCalculatorUse } from '@/lib/analytics';

type Mode = 'percent-of' | 'is-what-percent' | 'change';

const MODES: { id: Mode; label: string; shortLabel: string }[] = [
  { id: 'percent-of', label: 'What is X% of Y?', shortLabel: '% of a number' },
  { id: 'is-what-percent', label: 'X is what % of Y?', shortLabel: '% of total' },
  { id: 'change', label: '% change from A to B', shortLabel: '% change' },
];

const FAQ_ITEMS = [
  {
    question: 'How do I calculate a percentage of a number?',
    answer:
      'Multiply the number by the percentage, then divide by 100. For example, 15% of 200 is (200 × 15) / 100 = 30. This calculator does it automatically — just enter the percentage and the number.',
  },
  {
    question: 'How do I find what percentage one number is of another?',
    answer:
      'Divide the part by the whole, then multiply by 100. For example, if 25 is part of 200, the percentage is (25 / 200) × 100 = 12.5%. Use the "X is what % of Y?" mode for this.',
  },
  {
    question: 'How do I calculate percentage increase or decrease?',
    answer:
      'Subtract the original value from the new value, divide by the original, then multiply by 100. For example, from 80 to 100: (100 − 80) / 80 × 100 = 25% increase. A negative result means a decrease.',
  },
  {
    question: 'What is the difference between percentage points and percent?',
    answer:
      'A percentage point is an absolute difference between two percentages, while a percent is relative. If a rate goes from 10% to 15%, that is a 5 percentage point increase, but a 50% relative increase. This calculator returns relative percent change.',
  },
];

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Calculators', href: '/calculator' },
  { label: 'Percentage Calculator' },
];

const BREADCRUMB_JSON_LD_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Calculators', url: `${SITE_URL}/calculator` },
  { name: 'Percentage Calculator', url: `${SITE_URL}/calculator/percentage` },
];

function formatResult(n: number): string {
  if (!Number.isFinite(n)) return '—';
  // Round to 4 decimals, trim trailing zeros
  const rounded = Math.round(n * 10000) / 10000;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState<Mode>('percent-of');
  const [tracked, setTracked] = useState(false);

  // percent-of: what is A% of B?
  const [percent, setPercent] = useState(15);
  const [base, setBase] = useState(200);

  // is-what-percent: part is what % of whole?
  const [part, setPart] = useState(25);
  const [whole, setWhole] = useState(200);

  // change: from -> to
  const [fromValue, setFromValue] = useState(80);
  const [toValue, setToValue] = useState(100);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = getParamString(params, 'm');
    if (m === 'percent-of' || m === 'is-what-percent' || m === 'change') setMode(m);

    const p = getParamNumber(params, 'p');
    const b = getParamNumber(params, 'b');
    if (p !== null) setPercent(p);
    if (b !== null) setBase(b);

    const pa = getParamNumber(params, 'pa');
    const w = getParamNumber(params, 'w');
    if (pa !== null) setPart(pa);
    if (w !== null) setWhole(w);

    const f = getParamNumber(params, 'f');
    const t = getParamNumber(params, 't');
    if (f !== null) setFromValue(f);
    if (t !== null) setToValue(t);
  }, []);

  const getShareUrl = useCallback(() => {
    const shared: Record<string, string | number> = { m: mode };
    if (mode === 'percent-of') {
      shared.p = percent;
      shared.b = base;
    } else if (mode === 'is-what-percent') {
      shared.pa = part;
      shared.w = whole;
    } else {
      shared.f = fromValue;
      shared.t = toValue;
    }
    return buildShareUrl('/calculator/percentage', shared);
  }, [mode, percent, base, part, whole, fromValue, toValue]);

  const percentOfResult = useMemo(() => (base * percent) / 100, [percent, base]);
  const isWhatPercentResult = useMemo(() => (whole === 0 ? NaN : (part / whole) * 100), [part, whole]);
  const changeResult = useMemo(
    () => (fromValue === 0 ? NaN : ((toValue - fromValue) / fromValue) * 100),
    [fromValue, toValue],
  );

  useEffect(() => {
    if (tracked) return;
    const activeResult =
      mode === 'percent-of'
        ? percentOfResult
        : mode === 'is-what-percent'
          ? isWhatPercentResult
          : changeResult;
    if (Number.isFinite(activeResult)) {
      trackCalculatorUse('percentage');
      setTracked(true);
    }
  }, [mode, percentOfResult, isWhatPercentResult, changeResult, tracked]);

  return (
    <>
      <WebApplicationJsonLd
        name="Percentage Calculator"
        description="Free percentage calculator for finding percentages, percentage of a total, and percentage change."
        url={`${SITE_URL}/calculator/percentage`}
        applicationCategory="UtilitiesApplication"
      />
      <FAQJsonLd questions={FAQ_ITEMS} />
      <BreadcrumbJsonLd items={BREADCRUMB_JSON_LD_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Percentage Calculator</h1>
            <ShareButton getShareUrl={getShareUrl} slug="percentage" />
          </div>
          <p className="text-text-secondary text-lg max-w-3xl">
            Three percentage modes in one calculator: find a percentage of a number, work out what
            percentage one value is of another, or measure increase and decrease between two values.
          </p>
        </div>

        <AdSense slot="header" variant="banner" />

        {/* Mode tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === m.id
                  ? 'bg-accent-500 text-white'
                  : 'bg-dark-elevated border border-dark-border text-text-secondary hover:border-accent-500/50'
              }`}
            >
              {m.shortLabel}
            </button>
          ))}
        </div>

        {/* Active mode */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              {MODES.find((m) => m.id === mode)?.label}
            </h2>

            {mode === 'percent-of' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                    Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={percent}
                      onChange={(e) => setPercent(parseFloat(e.target.value) || 0)}
                      step="any"
                      className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-4 pr-10 py-3 text-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary text-lg">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                    Of
                  </label>
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => setBase(parseFloat(e.target.value) || 0)}
                    step="any"
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 text-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>
            )}

            {mode === 'is-what-percent' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                    Part
                  </label>
                  <input
                    type="number"
                    value={part}
                    onChange={(e) => setPart(parseFloat(e.target.value) || 0)}
                    step="any"
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 text-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                    Of (whole)
                  </label>
                  <input
                    type="number"
                    value={whole}
                    onChange={(e) => setWhole(parseFloat(e.target.value) || 0)}
                    step="any"
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 text-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>
            )}

            {mode === 'change' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                    From
                  </label>
                  <input
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(parseFloat(e.target.value) || 0)}
                    step="any"
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 text-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                    To
                  </label>
                  <input
                    type="number"
                    value={toValue}
                    onChange={(e) => setToValue(parseFloat(e.target.value) || 0)}
                    step="any"
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 text-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div>
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Result
              </div>

              {mode === 'percent-of' && (
                <>
                  <div className="text-4xl sm:text-5xl font-bold text-accent-500 mb-2">
                    {formatResult(percentOfResult)}
                  </div>
                  <div className="text-text-secondary">
                    {percent}% of {base.toLocaleString('en-US')} ={' '}
                    <span className="text-text-primary font-semibold">{formatResult(percentOfResult)}</span>
                  </div>
                </>
              )}

              {mode === 'is-what-percent' && (
                <>
                  <div className="text-4xl sm:text-5xl font-bold text-accent-500 mb-2">
                    {formatResult(isWhatPercentResult)}
                    <span className="text-2xl ml-1">%</span>
                  </div>
                  <div className="text-text-secondary">
                    {part.toLocaleString('en-US')} is{' '}
                    <span className="text-text-primary font-semibold">
                      {formatResult(isWhatPercentResult)}%
                    </span>{' '}
                    of {whole.toLocaleString('en-US')}
                  </div>
                </>
              )}

              {mode === 'change' && (
                <>
                  <div
                    className={`text-4xl sm:text-5xl font-bold mb-2 ${
                      Number.isFinite(changeResult) && changeResult < 0 ? 'text-rose-400' : 'text-accent-500'
                    }`}
                  >
                    {Number.isFinite(changeResult) && changeResult > 0 ? '+' : ''}
                    {formatResult(changeResult)}
                    <span className="text-2xl ml-1">%</span>
                  </div>
                  <div className="text-text-secondary">
                    From {fromValue.toLocaleString('en-US')} to {toValue.toLocaleString('en-US')}:{' '}
                    <span className="text-text-primary font-semibold">
                      {Number.isFinite(changeResult)
                        ? changeResult >= 0
                          ? `${formatResult(changeResult)}% increase`
                          : `${formatResult(Math.abs(changeResult))}% decrease`
                        : 'undefined (cannot divide by zero)'}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <AdSense slot="sidebar" variant="sidebar" format="rectangle" />
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 mb-8">
          <article className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How Percentage Calculations Work
            </h2>
            <p className="text-text-secondary mb-4">
              A percentage is a way of expressing a number as a fraction of 100. The word percent
              literally means &quot;per hundred.&quot; Most everyday percentage problems fall into one of
              three categories, and this calculator covers all three.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              1. Finding a Percentage of a Number
            </h3>
            <p className="text-text-secondary mb-4">
              When you want to find a portion — like 15% of a $200 bill, 8% sales tax on a $35
              purchase, or a 5% raise on your salary — multiply the number by the percentage and
              divide by 100. The formula is <strong>result = (number × percent) / 100</strong>.
              Quick mental trick: 10% is just the number with the decimal moved one place left.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              2. Working Out What Percentage One Number Is of Another
            </h3>
            <p className="text-text-secondary mb-4">
              Use this when you have a part and a whole and want to know the ratio as a percentage.
              Test score 47 out of 50? Sales of $1,250 against a $5,000 quota? The formula is
              <strong> percent = (part / whole) × 100</strong>. The answer can be greater than 100% if
              the part is larger than the whole.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              3. Percentage Change Between Two Values
            </h3>
            <p className="text-text-secondary mb-4">
              Percentage change measures how much something has grown or shrunk relative to the
              starting value. The formula is
              <strong> percent change = ((new − old) / old) × 100</strong>. A positive result is an
              increase, a negative result is a decrease. Used for stock returns, year-over-year
              growth, price markdowns, and inflation.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Common Real-World Uses
            </h3>
            <ul className="text-text-secondary space-y-2 mb-4">
              <li>
                <strong className="text-text-primary">Tax and tip:</strong> Find the dollar amount of
                a percentage applied to a bill.
              </li>
              <li>
                <strong className="text-text-primary">Discounts and sales:</strong> Calculate the
                final price after a percentage off (see also the Discount Calculator).
              </li>
              <li>
                <strong className="text-text-primary">Grades and scores:</strong> Convert raw scores
                into percentage grades.
              </li>
              <li>
                <strong className="text-text-primary">Growth and decline:</strong> Compare two
                periods to see year-over-year, quarter-over-quarter, or week-over-week change.
              </li>
              <li>
                <strong className="text-text-primary">Investing:</strong> Compute returns as a
                percent of the original investment.
              </li>
            </ul>
          </article>
        </div>

        {/* FAQ */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="border-b border-dark-border pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-text-primary mb-2">{faq.question}</h3>
                <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <AdSense slot="footer" variant="banner" />
      </div>
    </>
  );
}
