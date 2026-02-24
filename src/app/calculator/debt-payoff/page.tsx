'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import ResultCard from '@/components/calculator/ResultCard';
import ComparisonPanel from '@/components/calculator/ComparisonPanel';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ShareButton from '@/components/ui/ShareButton';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { calculateDebtPayoff } from '@/lib/calculators/debt-payoff';
import { formatCurrency } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { DebtItem } from '@/types/calculator';
import { buildShareUrl, getParamNumber, getParamString, getParamJson } from '@/lib/share';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const FAQ_ITEMS = [
  {
    question: 'What is the difference between the snowball and avalanche methods?',
    answer:
      'The snowball method pays off debts from smallest balance to largest, giving you quick psychological wins. The avalanche method targets the highest interest rate first, which typically saves you more money in total interest over time. Both methods apply all extra payments to one target debt while making minimum payments on the rest.',
  },
  {
    question: 'How much extra should I pay toward my debt each month?',
    answer:
      'Any extra amount helps, but even $50-$200 per month can significantly reduce your payoff timeline and total interest paid. Use the calculator above to see how different extra payment amounts affect your results. The key is to choose an amount you can sustain consistently.',
  },
  {
    question: 'Which debt payoff strategy is better?',
    answer:
      'The avalanche method is mathematically optimal because it minimizes total interest paid. However, the snowball method can be more motivating because you eliminate individual debts faster. The best strategy is the one you will stick with. If you need motivation, start with snowball; if you want to save the most money, choose avalanche.',
  },
  {
    question: 'Can I switch between snowball and avalanche strategies mid-way?',
    answer:
      'Yes, you can switch strategies at any time. Some people start with the snowball method to build momentum by paying off a few small debts, then switch to avalanche to minimize interest on larger, higher-rate debts. The important thing is to keep making consistent extra payments regardless of the method.',
  },
];

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Finance Calculators', href: '/' },
  { label: 'Debt Payoff Calculator' },
];

const BREADCRUMB_JSON_LD_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Finance Calculators', url: SITE_URL },
  { name: 'Debt Payoff Calculator', url: `${SITE_URL}/calculator/debt-payoff` },
];

let nextId = 3;

export default function DebtPayoffCalculatorPage() {
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: '1', name: 'Credit Card', balance: 5000, rate: 18.99, minPayment: 100 },
    { id: '2', name: 'Personal Loan', balance: 10000, rate: 8.5, minPayment: 250 },
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

  useEffect(() => {
    document.title = 'Debt Payoff Calculator - Snowball vs Avalanche | CalcPick';
    const params = new URLSearchParams(window.location.search);
    const ep = getParamNumber(params, 'ep');
    const s = getParamString(params, 's');
    const d = getParamJson<{ n: string; b: number; r: number; m: number }[]>(params, 'debts');
    if (ep !== null) setExtraPayment(ep);
    if (s === 'avalanche' || s === 'snowball') setStrategy(s);
    if (d && Array.isArray(d) && d.length > 0) {
      const loaded = d.map((item, i) => ({
        id: String(i + 1),
        name: item.n || '',
        balance: item.b || 0,
        rate: item.r || 0,
        minPayment: item.m || 0,
      }));
      setDebts(loaded);
      nextId = loaded.length + 1;
    }
  }, []);

  const getShareUrl = useCallback(() => {
    const compactDebts = debts.map((d) => ({ n: d.name, b: d.balance, r: d.rate, m: d.minPayment }));
    return buildShareUrl('/calculator/debt-payoff', {
      debts: JSON.stringify(compactDebts),
      ep: extraPayment,
      s: strategy,
    });
  }, [debts, extraPayment, strategy]);

  const avalancheResult = useMemo(() => {
    if (debts.length === 0) return null;
    return calculateDebtPayoff(debts, extraPayment, 'avalanche');
  }, [debts, extraPayment]);

  const snowballResult = useMemo(() => {
    if (debts.length === 0) return null;
    return calculateDebtPayoff(debts, extraPayment, 'snowball');
  }, [debts, extraPayment]);

  const selectedResult = strategy === 'avalanche' ? avalancheResult : snowballResult;
  const otherResult = strategy === 'avalanche' ? snowballResult : avalancheResult;

  const updateDebt = (id: string, field: keyof DebtItem, value: string | number) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const removeDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const addDebt = () => {
    setDebts((prev) => [
      ...prev,
      { id: String(nextId++), name: '', balance: 0, rate: 0, minPayment: 0 },
    ]);
  };

  // Build chart data: total remaining balance per month for both strategies
  const chartData = useMemo(() => {
    if (!avalancheResult || !snowballResult) return [];

    const maxMonths = Math.max(
      avalancheResult.schedule.length,
      snowballResult.schedule.length
    );

    const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);

    const data = [{ month: 0, avalanche: totalBalance, snowball: totalBalance }];

    for (let i = 0; i < maxMonths; i++) {
      const avalancheMonth = avalancheResult.schedule[i];
      const snowballMonth = snowballResult.schedule[i];

      const avalancheBalance = avalancheMonth
        ? avalancheMonth.debts.reduce((sum, d) => sum + d.balance, 0)
        : 0;
      const snowballBalance = snowballMonth
        ? snowballMonth.debts.reduce((sum, d) => sum + d.balance, 0)
        : 0;

      data.push({
        month: i + 1,
        avalanche: Math.max(0, Math.round(avalancheBalance * 100) / 100),
        snowball: Math.max(0, Math.round(snowballBalance * 100) / 100),
      });
    }

    return data;
  }, [avalancheResult, snowballResult, debts]);

  // Comparison items
  const comparisonItems = useMemo(() => {
    if (!avalancheResult || !snowballResult) return [];

    const interestHighlight =
      snowballResult.totalInterest <= avalancheResult.totalInterest ? 0 : 1;
    const paymentHighlight =
      snowballResult.totalPayment <= avalancheResult.totalPayment ? 0 : 1;
    const monthsHighlight =
      snowballResult.payoffMonths <= avalancheResult.payoffMonths ? 0 : 1;

    return [
      {
        label: 'Total Interest',
        values: [
          formatCurrency(snowballResult.totalInterest),
          formatCurrency(avalancheResult.totalInterest),
        ],
        highlight: interestHighlight,
      },
      {
        label: 'Total Payment',
        values: [
          formatCurrency(snowballResult.totalPayment),
          formatCurrency(avalancheResult.totalPayment),
        ],
        highlight: paymentHighlight,
      },
      {
        label: 'Months to Payoff',
        values: [
          `${snowballResult.payoffMonths} months`,
          `${avalancheResult.payoffMonths} months`,
        ],
        highlight: monthsHighlight,
      },
      {
        label: 'Payoff Date',
        values: [snowballResult.payoffDate, avalancheResult.payoffDate],
        highlight: monthsHighlight,
      },
    ];
  }, [avalancheResult, snowballResult]);

  // Selected strategy result card items
  const resultItems = useMemo(() => {
    if (!selectedResult || !otherResult) return [];

    const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);
    const savings = Math.abs(otherResult.totalInterest - selectedResult.totalInterest);
    const otherLabel = strategy === 'avalanche' ? 'snowball' : 'avalanche';

    return [
      {
        label: 'Monthly Payment',
        value: formatCurrency(totalMinPayments + extraPayment),
        highlight: true,
        subtext: `Min ${formatCurrency(totalMinPayments)} + ${formatCurrency(extraPayment)} extra`,
      },
      {
        label: 'Debt-Free Date',
        value: selectedResult.payoffDate,
        subtext: `${selectedResult.payoffMonths} months`,
      },
      {
        label: 'Total Interest',
        value: formatCurrency(selectedResult.totalInterest),
      },
      {
        label: `vs ${otherLabel}`,
        value: savings > 0 ? formatCurrency(savings) : '$0.00',
        subtext: savings > 0 ? 'saved' : 'Same cost',
      },
    ];
  }, [selectedResult, otherResult, debts, extraPayment, strategy]);

  return (
    <>
      <WebApplicationJsonLd
        name="Debt Payoff Calculator"
        description="Compare snowball vs avalanche debt payoff strategies. Calculate your payoff timeline, total interest, and find the fastest way to become debt-free."
        url={`${SITE_URL}/calculator/debt-payoff`}
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
              Debt Payoff Calculator
            </h1>
            <ShareButton getShareUrl={getShareUrl} />
          </div>
          <p className="text-text-secondary text-lg max-w-3xl">
            Compare snowball vs avalanche strategies to find the fastest way to become debt-free.
          </p>
        </div>

        {/* Top Ad */}
        <AdSense slot="header" variant="banner" />

        {/* Debt Entry Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Your Debts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {debts.map((debt) => (
              <div
                key={debt.id}
                className="bg-dark-elevated border border-dark-border rounded-lg p-4 relative"
              >
                {/* Delete Button */}
                {debts.length > 1 && (
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    aria-label={`Remove ${debt.name || 'debt'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Debt Name */}
                <div className="mb-3 pr-8">
                  <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">
                    Debt Name
                  </label>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                    placeholder="e.g., Credit Card, Car Loan"
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* Balance, Rate, Min Payment */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">
                      Balance
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">$</span>
                      <input
                        type="number"
                        value={debt.balance || ''}
                        onChange={(e) =>
                          updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                        min={0}
                        className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-7 pr-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">
                      Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={debt.rate || ''}
                        onChange={(e) =>
                          updateDebt(debt.id, 'rate', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                        min={0}
                        max={100}
                        step={0.01}
                        className="w-full bg-dark-elevated border border-dark-border rounded-lg px-3 py-2 pr-7 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">
                      Min. Payment
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">$</span>
                      <input
                        type="number"
                        value={debt.minPayment || ''}
                        onChange={(e) =>
                          updateDebt(debt.id, 'minPayment', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                        min={0}
                        className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-7 pr-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Debt Button */}
          <button
            onClick={addDebt}
            className="mt-4 w-full py-3 border-2 border-dashed border-dark-border rounded-lg text-text-secondary hover:text-accent-500 hover:border-accent-500/50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Debt
          </button>
        </div>

        {/* Extra Payment + Strategy Toggle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Extra Monthly Payment */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Extra Monthly Payment
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl font-bold text-accent-500">
                {formatCurrency(extraPayment)}
              </span>
              <span className="text-text-tertiary text-sm">/ month</span>
            </div>
            <input
              type="range"
              min={0}
              max={2000}
              step={25}
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-full h-2 bg-dark-elevated rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-text-tertiary mt-1">
              <span>$0</span>
              <span>$500</span>
              <span>$1,000</span>
              <span>$1,500</span>
              <span>$2,000</span>
            </div>
          </div>

          {/* Strategy Toggle */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Payoff Strategy
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStrategy('avalanche')}
                className={`p-4 rounded-lg border-2 transition-all text-left active:scale-95 ${
                  strategy === 'avalanche'
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-dark-border hover:border-accent-500/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">&#9650;</span>
                  <span
                    className={`font-semibold ${
                      strategy === 'avalanche' ? 'text-accent-500' : 'text-text-primary'
                    }`}
                  >
                    Avalanche
                  </span>
                </div>
                <p className="text-text-tertiary text-xs">Highest rate first</p>
              </button>
              <button
                onClick={() => setStrategy('snowball')}
                className={`p-4 rounded-lg border-2 transition-all text-left active:scale-95 ${
                  strategy === 'snowball'
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-dark-border hover:border-accent-500/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">&#9679;</span>
                  <span
                    className={`font-semibold ${
                      strategy === 'snowball' ? 'text-accent-500' : 'text-text-primary'
                    }`}
                  >
                    Snowball
                  </span>
                </div>
                <p className="text-text-tertiary text-xs">Smallest balance first</p>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {avalancheResult && snowballResult && (
          <>
            {/* Comparison Panel */}
            <div className="mb-8">
              <ComparisonPanel
                title="Snowball vs Avalanche Comparison"
                headers={['Snowball', 'Avalanche']}
                items={comparisonItems}
              />
            </div>

            {/* Selected Strategy Result Card */}
            <div className="mb-8">
              <ResultCard
                title={`${strategy === 'avalanche' ? 'Avalanche' : 'Snowball'} Strategy Summary`}
                items={resultItems}
              />
            </div>

            {/* Ad */}
            <AdSense slot="sidebar" variant="sidebar" format="rectangle" />

            {/* Chart */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Remaining Balance Over Time
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAvalanche" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSnowball" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85)" opacity={0.5} />
                    <XAxis
                      dataKey="month"
                      stroke="rgb(51 65 85)"
                      tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
                      label={{
                        value: 'Month',
                        position: 'insideBottomRight',
                        offset: -5,
                        fill: 'rgb(148 163 184)',
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      stroke="rgb(51 65 85)"
                      tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
                      tickFormatter={(value) =>
                        `$${(Number(value) / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(15 23 42)',
                        border: '1px solid rgb(51 65 85)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#f9fafb',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                      }}
                      formatter={(value, name) => [
                        formatCurrency(Number(value)),
                        name === 'avalanche' ? 'Avalanche' : 'Snowball',
                      ]}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Legend
                      formatter={(value: string) =>
                        value === 'avalanche' ? 'Avalanche' : 'Snowball'
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="avalanche"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAvalanche)"
                    />
                    <Area
                      type="monotone"
                      dataKey="snowball"
                      stroke="#f97316"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSnowball)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* In-Article Ad */}
        <AdSense slot="in-article" variant="in-feed" />

        {/* SEO Content */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 mb-8">
          <article className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              How Does Debt Payoff Work?
            </h2>
            <p className="text-text-secondary mb-4">
              Paying off debt faster requires a strategic approach. The two most popular
              methods are the <strong className="text-text-primary">debt snowball</strong> and
              the <strong className="text-text-primary">debt avalanche</strong>. Both strategies
              involve making minimum payments on all debts and directing any extra money toward
              one target debt at a time. The difference lies in how you choose which debt to
              target first.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              The Snowball Method
            </h3>
            <p className="text-text-secondary mb-4">
              With the snowball method, you order your debts from smallest balance to largest
              and focus extra payments on the smallest debt first. Once that debt is eliminated,
              you roll its minimum payment into the next smallest debt -- creating a
              &quot;snowball&quot; effect. This method is powerful for motivation because you see
              individual debts disappear quickly, keeping you on track.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              The Avalanche Method
            </h3>
            <p className="text-text-secondary mb-4">
              The avalanche method orders debts by interest rate from highest to lowest. You
              direct all extra payments toward the debt with the highest interest rate first.
              This approach is mathematically optimal because it minimizes the total interest
              you pay over the life of your debts. However, if your highest-rate debt also has
              a large balance, it may take longer before you fully eliminate your first debt.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Which Strategy Should You Choose?
            </h3>
            <p className="text-text-secondary mb-4">
              If saving the most money is your priority, the avalanche method is the better
              choice. If staying motivated matters more to you, the snowball method provides
              faster psychological wins. In practice, the difference in total interest between
              the two methods is often small. The most important factor is consistently making
              extra payments -- regardless of which strategy you choose.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Tips for Accelerating Debt Payoff
            </h3>
            <ul className="text-text-secondary space-y-2 mb-4">
              <li>
                <strong className="text-text-primary">Automate your payments</strong> to ensure
                you never miss a minimum payment or forget to apply extra funds.
              </li>
              <li>
                <strong className="text-text-primary">Use windfalls wisely</strong> -- apply tax
                refunds, bonuses, and unexpected income directly to your debt.
              </li>
              <li>
                <strong className="text-text-primary">Avoid taking on new debt</strong> while
                paying off existing balances. Cut up credit cards if needed.
              </li>
              <li>
                <strong className="text-text-primary">Consider balance transfers</strong> to a
                lower interest rate card, but watch out for transfer fees and promotional rate
                expiration dates.
              </li>
              <li>
                <strong className="text-text-primary">Track your progress</strong> monthly.
                Seeing balances decrease keeps you motivated and accountable.
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
