'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import ResultCard from '@/components/calculator/ResultCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber } from '@/lib/share';

const TIP_PRESETS = [10, 15, 18, 20, 25];

const FAQ_ITEMS = [
  {
    question: 'How much should I tip at a restaurant?',
    answer:
      'In the United States, 15-20% is the standard tip for sit-down restaurant service. For excellent service, 20-25% is common. For quick or counter service, 10-15% is typical. Remember, servers often rely on tips as a significant portion of their income.',
  },
  {
    question: 'Is tip calculated before or after tax?',
    answer:
      'The standard practice is to calculate the tip based on the pre-tax subtotal. However, many people tip on the total bill including tax for simplicity. The difference is usually small, and either approach is acceptable.',
  },
  {
    question: 'How do you split a bill with a tip?',
    answer:
      'Add the tip to the total bill, then divide by the number of people. For example, a $100 bill with a 20% tip ($20) totals $120. Split four ways, each person pays $30. This calculator handles this math automatically with the split feature.',
  },
  {
    question: 'Should I tip on takeout orders?',
    answer:
      'While not required, tipping 10-15% on takeout is increasingly common, especially for large or complex orders. During busy times, a small tip is a nice gesture to acknowledge the staff preparing your order.',
  },
];

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Utility Calculators', href: '/' },
  { label: 'Tip Calculator' },
];

const BREADCRUMB_JSON_LD_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Utility Calculators', url: SITE_URL },
  { name: 'Tip Calculator', url: `${SITE_URL}/calculator/tip` },
];

export default function TipCalculatorPage() {
  const [billAmount, setBillAmount] = useState(85);
  const [tipPercent, setTipPercent] = useState(18);
  const [splitCount, setSplitCount] = useState(1);

  useEffect(() => {
    document.title = 'Tip Calculator - Calculate Tip & Split Bill | CalcPick';
    const params = new URLSearchParams(window.location.search);
    const b = getParamNumber(params, 'b');
    const t = getParamNumber(params, 't');
    const s = getParamNumber(params, 's');
    if (b !== null) setBillAmount(b);
    if (t !== null) setTipPercent(t);
    if (s !== null && s >= 1) setSplitCount(s);
  }, []);

  const getShareUrl = useCallback(
    () => buildShareUrl('/calculator/tip', { b: billAmount, t: tipPercent, s: splitCount }),
    [billAmount, tipPercent, splitCount]
  );

  const result = useMemo(() => {
    const tipAmount = billAmount * (tipPercent / 100);
    const total = billAmount + tipAmount;
    const perPerson = total / Math.max(splitCount, 1);
    const tipPerPerson = tipAmount / Math.max(splitCount, 1);
    return { tipAmount, total, perPerson, tipPerPerson };
  }, [billAmount, tipPercent, splitCount]);

  const resultItems = [
    {
      label: 'Tip Amount',
      value: formatCurrency(result.tipAmount),
      highlight: true,
      subtext: `${tipPercent}% of ${formatCurrency(billAmount)}`,
    },
    {
      label: 'Total',
      value: formatCurrency(result.total),
      subtext: 'Bill + Tip',
    },
    {
      label: 'Per Person',
      value: formatCurrency(result.perPerson),
      highlight: splitCount > 1,
      subtext: splitCount > 1 ? `Split ${splitCount} ways` : 'Not splitting',
    },
    {
      label: 'Tip Per Person',
      value: formatCurrency(result.tipPerPerson),
      subtext: splitCount > 1 ? `${formatCurrency(result.tipPerPerson)} each` : `${tipPercent}%`,
    },
  ];

  return (
    <>
      <WebApplicationJsonLd
        name="Tip Calculator"
        description="Quickly calculate how much to tip and split the bill. Simple, fast, and free tip calculator for restaurants, delivery, and services."
        url={`${SITE_URL}/calculator/tip`}
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
              Tip Calculator
            </h1>
            <ShareButton getShareUrl={getShareUrl} />
          </div>
          <p className="text-text-secondary text-lg max-w-3xl">
            Calculate the perfect tip and split the bill evenly among friends.
          </p>
        </div>

        {/* Top Ad */}
        <AdSense slot="header" variant="banner" />

        {/* Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Inputs */}
          <div className="space-y-6">
            {/* Bill Amount */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Bill Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-xl">$</span>
                <input
                  type="number"
                  value={billAmount || ''}
                  onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-10 pr-4 py-4 text-2xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            {/* Tip Percentage */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Tip Percentage
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {TIP_PRESETS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      tipPercent === pct
                        ? 'bg-accent-500 text-white'
                        : 'bg-dark-elevated border border-dark-border text-text-secondary hover:border-accent-500/50'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={tipPercent}
                  onChange={(e) => setTipPercent(Number(e.target.value))}
                  className="flex-1 h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
                <div className="relative w-20 shrink-0">
                  <input
                    type="number"
                    value={tipPercent}
                    onChange={(e) => setTipPercent(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                    min={0}
                    max={100}
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-3 py-2 pr-7 text-text-primary text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">%</span>
                </div>
              </div>
            </div>

            {/* Split */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Split Between
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSplitCount((c) => Math.max(1, c - 1))}
                  className="w-12 h-12 rounded-lg bg-dark-elevated border border-dark-border text-text-primary text-xl font-bold hover:border-accent-500/50 transition-colors"
                >
                  -
                </button>
                <span className="text-3xl font-bold text-text-primary w-16 text-center">
                  {splitCount}
                </span>
                <button
                  onClick={() => setSplitCount((c) => Math.min(20, c + 1))}
                  className="w-12 h-12 rounded-lg bg-dark-elevated border border-dark-border text-text-primary text-xl font-bold hover:border-accent-500/50 transition-colors"
                >
                  +
                </button>
                <span className="text-text-tertiary text-sm">
                  {splitCount === 1 ? 'person' : 'people'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            <ResultCard
              title="Tip Summary"
              items={resultItems}
            />

            {/* Quick Reference Table */}
            <div className="mt-6 bg-dark-surface border border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Quick Tip Reference
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-text-tertiary font-medium py-2">Tip %</th>
                    <th className="text-right text-text-tertiary font-medium py-2">Tip</th>
                    <th className="text-right text-text-tertiary font-medium py-2">Total</th>
                    {splitCount > 1 && (
                      <th className="text-right text-text-tertiary font-medium py-2">Per Person</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {TIP_PRESETS.map((pct) => {
                    const tip = billAmount * (pct / 100);
                    const total = billAmount + tip;
                    const isActive = pct === tipPercent;
                    return (
                      <tr
                        key={pct}
                        className={`border-b border-dark-border last:border-0 cursor-pointer transition-colors ${
                          isActive ? 'bg-accent-500/10' : 'hover:bg-dark-elevated'
                        }`}
                        onClick={() => setTipPercent(pct)}
                      >
                        <td className={`py-2.5 font-medium ${isActive ? 'text-accent-500' : 'text-text-primary'}`}>
                          {pct}%
                        </td>
                        <td className={`py-2.5 text-right ${isActive ? 'text-accent-500' : 'text-text-secondary'}`}>
                          {formatCurrency(tip)}
                        </td>
                        <td className={`py-2.5 text-right ${isActive ? 'text-accent-500 font-semibold' : 'text-text-secondary'}`}>
                          {formatCurrency(total)}
                        </td>
                        {splitCount > 1 && (
                          <td className={`py-2.5 text-right ${isActive ? 'text-accent-500' : 'text-text-secondary'}`}>
                            {formatCurrency(total / splitCount)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
              How to Calculate a Tip
            </h2>
            <p className="text-text-secondary mb-4">
              Calculating a tip is simple: multiply the bill amount by the tip percentage and
              divide by 100. For example, a 20% tip on a $50 bill is $50 x 20 / 100 = $10.
              Add the tip to the bill for the total: $50 + $10 = $60.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Standard Tipping Guidelines in the US
            </h3>
            <p className="text-text-secondary mb-4">
              For sit-down restaurant service, 15-20% is standard. Fine dining typically warrants
              20% or more. Buffets are usually 10-15%. For delivery services, $3-5 or 15-20% of
              the order total is common. Bartenders typically receive $1-2 per drink or 15-20% of
              the tab. Hairdressers and barbers usually receive 15-20%.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Splitting the Bill Fairly
            </h3>
            <p className="text-text-secondary mb-4">
              When dining with a group, the simplest approach is to split the total (bill + tip)
              evenly. If people ordered items at very different price points, you can ask for
              separate checks or use this calculator to figure out each person&apos;s fair share.
              Always calculate the tip on the full bill before splitting.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Quick Mental Math Tip Tricks
            </h3>
            <ul className="text-text-secondary space-y-2 mb-4">
              <li>
                <strong className="text-text-primary">10% tip:</strong> Move the decimal point one
                place to the left. A $45.00 bill = $4.50 tip.
              </li>
              <li>
                <strong className="text-text-primary">15% tip:</strong> Calculate 10%, then add
                half of that. $45 → $4.50 + $2.25 = $6.75.
              </li>
              <li>
                <strong className="text-text-primary">20% tip:</strong> Calculate 10% and double
                it. $45 → $4.50 x 2 = $9.00.
              </li>
              <li>
                <strong className="text-text-primary">25% tip:</strong> Calculate 10% and multiply
                by 2.5, or find 20% and add half of 10%. $45 → $9.00 + $2.25 = $11.25.
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
