import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_NAME} - free, accurate financial calculators to help you make smarter money decisions.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary mb-6">About {SITE_NAME}</h1>

      <div className="prose prose-lg max-w-none">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed">
            {SITE_NAME} provides free, easy-to-use financial calculators to help you make informed decisions
            about mortgages, loans, investments, and debt repayment. We believe everyone deserves access to
            professional-grade financial tools without cost or complexity.
          </p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-3">How Our Calculators Work</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            All calculations are performed directly in your browser using industry-standard financial formulas.
            This means your data never leaves your device - we don&apos;t store, transmit, or have access to any
            numbers you enter.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Our calculators use the same amortization formulas employed by banks and lending institutions,
            including proper compound interest calculations and standard loan amortization schedules.
          </p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Accuracy Disclaimer</h2>
          <p className="text-text-secondary leading-relaxed">
            While we strive for accuracy, our calculators provide estimates for informational and educational
            purposes only. Results should not be considered as financial advice. Actual loan terms, interest rates,
            and payments may vary based on your credit profile, lender policies, and market conditions. We recommend
            consulting with a qualified financial advisor for personalized guidance.
          </p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Contact Us</h2>
          <p className="text-text-secondary leading-relaxed">
            Have questions, feedback, or suggestions for new calculators?{' '}
            <Link href="/contact" className="text-accent-500 hover:text-accent-600 underline">
              Get in touch
            </Link>{' '}
            - we&apos;d love to hear from you.
          </p>
        </div>
      </div>
    </div>
  );
}
