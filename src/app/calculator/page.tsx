import type { Metadata } from 'next';
import Link from 'next/link';
import { CALCULATORS, SITE_URL } from '@/lib/constants';
import type { CalculatorMeta } from '@/types/calculator';

const TITLE = 'All Calculators';
const DESCRIPTION =
  'Browse every free CalcPick calculator and unit converter in one place — mortgage, auto loan, personal loan, compound interest, sales tax, percentage, tip, and more.';
const CANONICAL = `${SITE_URL}/calculator`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const financeCalcs = CALCULATORS.filter((c) => c.category === 'Finance');
const utilityCalcs = CALCULATORS.filter((c) => c.category === 'Utility');

function CalculatorGrid({ items }: { items: CalculatorMeta[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((calc) => (
        <Link
          key={calc.slug}
          href={`/calculator/${calc.slug}`}
          className="group bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-500/5 transition-all"
        >
          <div className="text-3xl mb-3">{calc.icon}</div>
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-500 transition-colors mb-2">
            {calc.title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">{calc.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default function CalculatorHubPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
        Free Financial &amp; Utility Calculators
      </h1>
      <p className="text-text-secondary text-lg max-w-2xl mb-10">
        Every CalcPick tool in one place — accurate, instant, and free. Pick a calculator below to get started.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Finance Calculators</h2>
        <CalculatorGrid items={financeCalcs} />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Utility Tools</h2>
        <CalculatorGrid items={utilityCalcs} />
      </section>
    </div>
  );
}
