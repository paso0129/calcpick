'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import RelatedCalculators from '@/components/RelatedCalculators';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { buildShareUrl, getParamNumber } from '@/lib/share';
import { trackCalculatorUse } from '@/lib/analytics';

type Mode = 'add' | 'remove';

interface StateRate {
  name: string;
  rate: number;
}

const US_STATE_RATES: StateRate[] = [
  { name: 'Alabama', rate: 9.29 },
  { name: 'Alaska', rate: 1.76 },
  { name: 'Arizona', rate: 8.40 },
  { name: 'Arkansas', rate: 9.45 },
  { name: 'California', rate: 8.85 },
  { name: 'Colorado', rate: 7.81 },
  { name: 'Connecticut', rate: 6.35 },
  { name: 'Delaware', rate: 0.00 },
  { name: 'District of Columbia', rate: 6.00 },
  { name: 'Florida', rate: 7.00 },
  { name: 'Georgia', rate: 7.38 },
  { name: 'Hawaii', rate: 4.50 },
  { name: 'Idaho', rate: 6.03 },
  { name: 'Illinois', rate: 8.86 },
  { name: 'Indiana', rate: 7.00 },
  { name: 'Iowa', rate: 6.94 },
  { name: 'Kansas', rate: 8.75 },
  { name: 'Kentucky', rate: 6.00 },
  { name: 'Louisiana', rate: 9.56 },
  { name: 'Maine', rate: 5.50 },
  { name: 'Maryland', rate: 6.00 },
  { name: 'Massachusetts', rate: 6.25 },
  { name: 'Michigan', rate: 6.00 },
  { name: 'Minnesota', rate: 8.04 },
  { name: 'Mississippi', rate: 7.07 },
  { name: 'Missouri', rate: 8.39 },
  { name: 'Montana', rate: 0.00 },
  { name: 'Nebraska', rate: 6.97 },
  { name: 'Nevada', rate: 8.24 },
  { name: 'New Hampshire', rate: 0.00 },
  { name: 'New Jersey', rate: 6.63 },
  { name: 'New Mexico', rate: 7.62 },
  { name: 'New York', rate: 8.53 },
  { name: 'North Carolina', rate: 7.00 },
  { name: 'North Dakota', rate: 7.04 },
  { name: 'Ohio', rate: 7.24 },
  { name: 'Oklahoma', rate: 8.99 },
  { name: 'Oregon', rate: 0.00 },
  { name: 'Pennsylvania', rate: 6.34 },
  { name: 'Rhode Island', rate: 7.00 },
  { name: 'South Carolina', rate: 7.50 },
  { name: 'South Dakota', rate: 6.40 },
  { name: 'Tennessee', rate: 9.56 },
  { name: 'Texas', rate: 8.20 },
  { name: 'Utah', rate: 7.25 },
  { name: 'Vermont', rate: 6.36 },
  { name: 'Virginia', rate: 5.77 },
  { name: 'Washington', rate: 9.38 },
  { name: 'West Virginia', rate: 6.57 },
  { name: 'Wisconsin', rate: 5.43 },
  { name: 'Wyoming', rate: 5.44 },
];

const FAQ_ITEMS = [
  {
    question: 'How do I add sales tax to a price?',
    answer:
      'Multiply the pre-tax price by the tax rate and add the result. For a $50 item with 8% tax: $50 × 0.08 = $4 tax, total = $54. Use the "Add Tax" mode above to do this instantly.',
  },
  {
    question: 'How do I remove sales tax from a total?',
    answer:
      'Divide the tax-inclusive total by (1 + tax rate). For a $54 total at 8% tax: $54 / 1.08 = $50 pre-tax price. The "Remove Tax" mode above handles this calculation for you.',
  },
  {
    question: 'Which US states have no sales tax?',
    answer:
      'Five states charge no general sales tax: Alaska, Delaware, Montana, New Hampshire, and Oregon. However, some localities in Alaska do collect local sales taxes.',
  },
  {
    question: 'Why does the state rate shown differ from what I was charged?',
    answer:
      'This calculator shows average combined rates (state + average local). Your actual rate depends on the specific city and county where you made the purchase. Rates can vary significantly even within the same state.',
  },
  {
    question: 'Is sales tax applied before or after a discount?',
    answer:
      'Sales tax is applied to the discounted (sale) price, not the original price. If a $100 item is 20% off, tax is calculated on the $80 sale price.',
  },
];

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Calculators', href: '/calculator' },
  { label: 'Sales Tax Calculator' },
];

const BREADCRUMB_JSON_LD_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Calculators', url: `${SITE_URL}/calculator` },
  { name: 'Sales Tax Calculator', url: `${SITE_URL}/calculator/sales-tax` },
];

interface AddTaxResult {
  taxAmount: number;
  totalPrice: number;
}

interface RemoveTaxResult {
  preTaxPrice: number;
  taxAmount: number;
}

function calcAddTax(price: number, rate: number): AddTaxResult {
  const taxAmount = price * (rate / 100);
  return { taxAmount, totalPrice: price + taxAmount };
}

function calcRemoveTax(total: number, rate: number): RemoveTaxResult {
  const preTaxPrice = total / (1 + rate / 100);
  return { preTaxPrice, taxAmount: total - preTaxPrice };
}

export default function SalesTaxCalculatorPage() {
  const [mode, setMode] = useState<Mode>('add');
  const [price, setPrice] = useState(100);
  const [taxRate, setTaxRate] = useState(8);
  const [selectedState, setSelectedState] = useState('');
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = getParamNumber(params, 'p');
    const r = getParamNumber(params, 'r');
    const rawMode = params.get('m');
    if (p !== null) setPrice(p);
    if (r !== null) setTaxRate(r);
    if (rawMode === 'add' || rawMode === 'remove') setMode(rawMode);
  }, []);

  const getShareUrl = useCallback(
    () => buildShareUrl('/calculator/sales-tax', { p: price, r: taxRate, m: mode }),
    [price, taxRate, mode],
  );

  const handleStateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    if (stateName) {
      const found = US_STATE_RATES.find((s) => s.name === stateName);
      if (found) setTaxRate(found.rate);
    }
  }, []);

  const addResult = useMemo(() => calcAddTax(price, taxRate), [price, taxRate]);
  const removeResult = useMemo(() => calcRemoveTax(price, taxRate), [price, taxRate]);

  const outputTotal = mode === 'add' ? addResult.totalPrice : removeResult.preTaxPrice;

  useEffect(() => {
    if (tracked) return;
    if (Number.isFinite(outputTotal) && price > 0) {
      trackCalculatorUse('sales-tax');
      setTracked(true);
    }
  }, [outputTotal, price, tracked]);

  const inputLabel = mode === 'add' ? 'Pre-Tax Price' : 'Tax-Inclusive Total';
  const outputLabel = mode === 'add' ? 'Total (with tax)' : 'Pre-Tax Price';
  const taxAmountValue = mode === 'add' ? addResult.taxAmount : removeResult.taxAmount;
  const outputValue = mode === 'add' ? addResult.totalPrice : removeResult.preTaxPrice;

  return (
    <>
      <WebApplicationJsonLd
        name="Sales Tax Calculator"
        description="Free US sales tax calculator. Add tax to a pre-tax price or reverse-calculate the pre-tax amount from a total."
        url={`${SITE_URL}/calculator/sales-tax`}
        applicationCategory="FinanceApplication"
      />
      <FAQJsonLd questions={FAQ_ITEMS} />
      <BreadcrumbJsonLd items={BREADCRUMB_JSON_LD_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Sales Tax Calculator</h1>
            <ShareButton getShareUrl={getShareUrl} slug="sales-tax" />
          </div>
          <p className="text-text-secondary text-lg max-w-3xl">
            Add sales tax to a price or reverse-calculate the pre-tax amount from a tax-inclusive total.
          </p>
        </div>

        <AdSense slot="header" variant="banner" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Mode Toggle */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-2 flex gap-1">
              <button
                onClick={() => setMode('add')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'add'
                    ? 'bg-accent-500 text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Add Tax
              </button>
              <button
                onClick={() => setMode('remove')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'remove'
                    ? 'bg-accent-500 text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Remove Tax
              </button>
            </div>

            {/* Price Input */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                {inputLabel}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-xl">$</span>
                <input
                  type="number"
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-10 pr-4 py-4 text-2xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            {/* Tax Rate */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <label className="block text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Tax Rate
              </label>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={0.25}
                  value={taxRate}
                  onChange={(e) => {
                    setTaxRate(Number(e.target.value));
                    setSelectedState('');
                  }}
                  className="flex-1 h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
                <div className="relative w-24 shrink-0">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => {
                      setTaxRate(Math.min(50, Math.max(0, Number(e.target.value) || 0)));
                      setSelectedState('');
                    }}
                    min={0}
                    max={50}
                    step={0.01}
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-3 py-2 pr-7 text-text-primary text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">%</span>
                </div>
              </div>

              {/* State Picker */}
              <div>
                <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
                  Or pick a US state
                </label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Select state…</option>
                  {US_STATE_RATES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} — {s.rate === 0 ? 'No tax' : `${s.rate}%`}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-text-tertiary">
                  Approximate average rates. Local rates vary by city/county.
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
              <div className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                {outputLabel}
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-accent-500 mb-4">
                {formatCurrency(outputValue)}
              </div>

              <div className="space-y-3 pt-4 border-t border-dark-border">
                {mode === 'add' ? (
                  <>
                    <div className="flex justify-between text-text-secondary">
                      <span>Pre-tax price</span>
                      <span className="text-text-primary font-semibold">{formatCurrency(price)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Tax ({taxRate}%)</span>
                      <span className="text-text-primary font-semibold">{formatCurrency(taxAmountValue)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary border-t border-dark-border pt-3">
                      <span className="font-semibold text-text-primary">Total</span>
                      <span className="text-accent-500 font-bold">{formatCurrency(outputValue)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-text-secondary">
                      <span>Tax-inclusive total</span>
                      <span className="text-text-primary font-semibold">{formatCurrency(price)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Tax amount ({taxRate}%)</span>
                      <span className="text-text-primary font-semibold">{formatCurrency(taxAmountValue)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary border-t border-dark-border pt-3">
                      <span className="font-semibold text-text-primary">Pre-tax price</span>
                      <span className="text-accent-500 font-bold">{formatCurrency(outputValue)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* State Rate Reference Table */}
            <div className="mt-6 bg-dark-surface border border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Highest &amp; Lowest State Rates</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-text-tertiary font-medium py-2">State</th>
                    <th className="text-right text-text-tertiary font-medium py-2">Avg Combined Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[...US_STATE_RATES]
                    .sort((a, b) => b.rate - a.rate)
                    .slice(0, 5)
                    .concat(
                      [...US_STATE_RATES].sort((a, b) => a.rate - b.rate).slice(0, 5)
                    )
                    .map((s) => (
                      <tr
                        key={s.name}
                        className={`border-b border-dark-border last:border-0 cursor-pointer transition-colors hover:bg-dark-elevated ${
                          selectedState === s.name ? 'bg-accent-500/10' : ''
                        }`}
                        onClick={() => {
                          setSelectedState(s.name);
                          setTaxRate(s.rate);
                        }}
                      >
                        <td className={`py-2.5 font-medium ${selectedState === s.name ? 'text-accent-500' : 'text-text-primary'}`}>
                          {s.name}
                        </td>
                        <td className={`py-2.5 text-right ${selectedState === s.name ? 'text-accent-500' : 'text-text-secondary'}`}>
                          {s.rate === 0 ? 'No tax' : `${s.rate}%`}
                        </td>
                      </tr>
                    ))}
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
              How Sales Tax Works in the United States
            </h2>
            <p className="text-text-secondary mb-4">
              Sales tax is a consumption tax collected by retailers at the point of sale and remitted
              to state and local governments. Unlike VAT (value-added tax) used in most other countries,
              US sales tax is added on top of the listed price — so a $100 item plus 8% tax costs $108
              at checkout.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Tax-Exclusive vs. Tax-Inclusive Pricing
            </h3>
            <p className="text-text-secondary mb-4">
              <strong className="text-text-primary">Tax-exclusive</strong> (standard in the US): The
              listed price does not include tax. Tax is calculated on top of the displayed amount.
              Formula: <strong>total = price × (1 + rate / 100)</strong>.
            </p>
            <p className="text-text-secondary mb-4">
              <strong className="text-text-primary">Tax-inclusive</strong> (common in Europe): The
              listed price already includes tax. To find the pre-tax amount, divide by (1 + rate / 100).
              Use the &quot;Remove Tax&quot; mode above for this calculation.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Why Rates Vary by State — and Within States
            </h3>
            <p className="text-text-secondary mb-4">
              The US has no federal sales tax. Each state sets its own base rate, and counties and
              cities can add local taxes on top. Louisiana and Tennessee consistently rank among the
              highest combined rates (around 9.5%), while five states — Oregon, Montana, New Hampshire,
              Delaware, and Alaska — have no statewide sales tax at all. Alaska allows local taxes,
              so some Alaskan cities do collect sales tax.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              What Is Typically Exempt from Sales Tax?
            </h3>
            <p className="text-text-secondary mb-4">
              Exemptions vary widely by state but commonly include unprepared groceries, prescription
              drugs, and medical equipment. Some states exempt clothing below a price threshold, and
              many offer periodic &quot;tax holidays&quot; on school supplies or energy-efficient appliances.
              Always verify your state&apos;s rules for the specific category of goods you are buying.
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

        <RelatedCalculators slug="sales-tax" />

        <AdSense slot="footer" variant="banner" />
      </div>
    </>
  );
}
