import Link from 'next/link';
import { CALCULATORS, RELATED_CALCULATORS } from '@/lib/constants';
import type { CalculatorMeta } from '@/types/calculator';

interface RelatedCalculatorsProps {
  slug: string;
}

export default function RelatedCalculators({ slug }: RelatedCalculatorsProps) {
  const related = (RELATED_CALCULATORS[slug] ?? [])
    .map((s) => CALCULATORS.find((c) => c.slug === s))
    .filter((c): c is CalculatorMeta => Boolean(c));

  if (related.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-text-primary mb-3">Related Calculators</h2>
      <div className="flex flex-wrap gap-2">
        {related.map((calc) => (
          <Link
            key={calc.slug}
            href={`/calculator/${calc.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-dark-surface border border-dark-border text-text-secondary hover:text-accent-500 hover:border-accent-500/50 transition-colors"
          >
            <span aria-hidden="true">{calc.icon}</span>
            {calc.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
