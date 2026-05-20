'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber } from '@/lib/share';

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 50];

const FAQ_ITEMS = [
  {
    question: 'How do I calculate the sale price?',
    answer:
      'Multiply the original price by the discount percentage, divide by 100, then subtract from the original. For a $80 item at 25% off: $80 × 25 / 100 = $20 saved, final price = $80 − $20 = $60. This calculator does the math for you.',
  },
  {
    question: 'How is sales tax applied to a discounted price?',
    answer:
      'Sales tax is applied to the discounted (sale) price, not the original. If a $100 item is 20% off, the taxable amount is $80. With 8% tax that adds $6.40, for a total of $86.40. Enter your local tax rate to see the after-tax total.',
  },
  {
    question: 'How do I figure out the percent off from a sale price?',
    answer:
      'Divide the savings by the original price and multiply by 100. If something dropped from $50 to $35, you saved $15. The discount is ($15 / $50) × 100 = 30% off.',
  },
  {
    question: 'How do stacked discounts work? (50% off plus 20% off)',
    answer:
      'Stacked discounts apply one after the other, not added together. A $100 item at 50% off becomes $50. Then 20% off of $50 is $40 — a total of 60% off, not 70%. Many stores apply additional coupons this way at checkout.',
  },
];

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Utility Calculators', href: '/' },
  { label: 'Discount Calculator' },
];

const BREADCRUMB_JSON_LD_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Utility Calculators', url: SITE_URL },
  { name: 'Discount Calculator', url: `${SITE_URL}/calculator/discount` },
];

export default function DiscountCalculatorPage() {
  const [originalPrice, setOriginalPrice] = useState(80);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [taxPercent, setTaxPercent] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = getParamNumber(params, 'p');
    const d = getParamNumber(params, 'd');
    const t = getParamNumber(params, 't');
    if (p !== null) setOriginalPrice(p);
    if (d !== null) setDiscountPercent(d);
    if (t !== null) setTaxPercent(t);
  }, []);

  const getShareUrl = useCallback(
    () => buildShareUrl('/calculator/discount', { p: originalPrice, d: discountPercent, t: taxPercent }),
    [originalPrice, discountPercent, taxPercent],
  );

  const result = useMemo(() => {
    const savings = originalPrice * (discountPercent / 100);
    const salePrice = originalPrice - savings;
    const tax = salePrice * (taxPercent / 100);
    const finalPrice = salePrice + tax;
    return { savings, salePrice, tax, finalPrice };
  }, [originalPrice, discountPercent, taxPercent]);

  return (
    <>
      <WebApplicationJsonLd
        name="Discount Calculator"
        description="Free discount calculator. Find the final sale price after percent off and optional sales tax."
        url={`${SITE_URL}/calculator/discount`}
      />
      <FAQJsonLd questions={FAQ_ITEMS} />
      <BreadcrumbJsonLd items={BREADCRUMB_JSON_LD_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Discount Calculator</h1>
            <ShareButton getShareUrl={getShareUrl} />
          </div>
          <p className="text-text-secondary text-lg max-w-3xl">
            Calculate the sale price, total savings, and after-tax total for any discount.
          </p>
        </div>

        <AdSense slot="header" variant="banner" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Original Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-xl">$</span>
                <input
                  type="number"
                  value={originalPrice || ''}
                  onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-10 pr-4 py-4 text-2xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Discount
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {DISCOUNT_PRESETS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      discountPercent === pct
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
                  max={100}
                  step={1}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="flex-1 h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
                <div className="relative w-20 shrink-0">
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) =>
                      setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
                    }
                    min={0}
                    max={100}
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-3 py-2 pr-7 text-text-primary text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Sales Tax (optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={0.25}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="flex-1 h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
                <div className="relative w-20 shrink-0">
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
                    min={0}
                    max={50}
                    step={0.25}
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-3 py-2 pr-7 text-text-primary text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Final Price
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-accent-500 mb-4">
                {formatCurrency(result.finalPrice)}
              </div>

              <div className="space-y-3 pt-4 border-t border-dark-border">
                <div className="flex justify-between text-text-secondary">
                  <span>Sale price</span>
                  <span className="text-text-primary font-semibold">{formatCurrency(result.salePrice)}</span>
                </div>
                {taxPercent > 0 && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Sales tax ({taxPercent}%)</span>
                    <span className="text-text-primary font-semibold">{formatCurrency(result.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>You save</span>
                  <span className="text-emerald-400 font-semibold">{formatCurrency(result.savings)}</span>
                </div>
              </div>
            </div>

            {/* Discount Reference Table */}
            <div className="mt-6 bg-dark-surface border border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Discount Comparison</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-text-tertiary font-medium py-2">% Off</th>
                    <th className="text-right text-text-tertiary font-medium py-2">Save</th>
                    <th className="text-right text-text-tertiary font-medium py-2">Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {DISCOUNT_PRESETS.map((pct) => {
                    const save = originalPrice * (pct / 100);
                    const pay = originalPrice - save;
                    const isActive = pct === discountPercent;
                    return (
                      <tr
                        key={pct}
                        className={`border-b border-dark-border last:border-0 cursor-pointer transition-colors ${
                          isActive ? 'bg-accent-500/10' : 'hover:bg-dark-elevated'
                        }`}
                        onClick={() => setDiscountPercent(pct)}
                      >
                        <td
                          className={`py-2.5 font-medium ${
                            isActive ? 'text-accent-500' : 'text-text-primary'
                          }`}
                        >
                          {pct}%
                        </td>
                        <td
                          className={`py-2.5 text-right ${
                            isActive ? 'text-accent-500' : 'text-text-secondary'
                          }`}
                        >
                          {formatCurrency(save)}
                        </td>
                        <td
                          className={`py-2.5 text-right ${
                            isActive ? 'text-accent-500 font-semibold' : 'text-text-secondary'
                          }`}
                        >
                          {formatCurrency(pay)}
                        </td>
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
              How to Calculate a Discount
            </h2>
            <p className="text-text-secondary mb-4">
              Calculating a discount comes down to two steps: figure out the dollar amount you save,
              then subtract that from the original price. The formula is{' '}
              <strong>savings = original × (percent / 100)</strong> and{' '}
              <strong>sale price = original − savings</strong>. For example, 30% off a $50 shirt
              saves $15, so you pay $35.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Quick Mental Math Tricks
            </h3>
            <ul className="text-text-secondary space-y-2 mb-4">
              <li>
                <strong className="text-text-primary">10% off:</strong> Move the decimal one place
                left. $40 → $4 off → pay $36.
              </li>
              <li>
                <strong className="text-text-primary">25% off:</strong> Divide by 4 to find savings.
                $80 / 4 = $20 off → pay $60.
              </li>
              <li>
                <strong className="text-text-primary">50% off:</strong> Half price. $90 → pay $45.
              </li>
              <li>
                <strong className="text-text-primary">75% off:</strong> Pay one quarter of the
                original. $80 → pay $20.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Where Sales Tax Fits In
            </h3>
            <p className="text-text-secondary mb-4">
              In the United States, sales tax is applied to the discounted price, not the original.
              That means a deeper discount also reduces the tax you pay. Enter your local sales tax
              rate above to see the true checkout total. The actual rate varies by state, county,
              and sometimes city — typically 6% to 10% combined.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Stacked Discounts: 50% + 20% Is Not 70%
            </h3>
            <p className="text-text-secondary mb-4">
              When stores apply &quot;extra 20% off the sale price,&quot; the second discount works on
              the already-reduced amount. A $100 item at 50% off becomes $50; another 20% off brings
              it to $40 — a 60% total discount, not 70%. The math: 1 − (0.5 × 0.8) = 0.6, or 60% off.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              When the Discount Looks Big But Isn&apos;t
            </h3>
            <p className="text-text-secondary mb-4">
              Watch for inflated &quot;original prices.&quot; A retailer that lists a $200 MSRP and sells
              for $99 may always sell it at $99. Compare against verified historical prices or
              check competitor pricing before assuming the discount represents real savings.
            </p>
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
