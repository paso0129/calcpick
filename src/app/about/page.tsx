import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, CALCULATORS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_NAME} — free, accurate financial calculators for mortgages, loans, investments, and debt repayment. Our mission is to empower smarter money decisions.`,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-secondary mb-6">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">About</span>
      </nav>

      <h1 className="text-3xl font-bold text-text-primary mb-2">About {SITE_NAME}</h1>
      <p className="text-text-tertiary text-sm mb-8">
        Free financial calculators you can trust.
      </p>

      <div className="space-y-8">
        {/* Mission */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            At {SITE_NAME}, we believe that everyone deserves access to professional-grade financial
            tools — without paying a dime or navigating confusing interfaces.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Our mission is simple: provide free, accurate, and easy-to-use financial calculators
            that help you make smarter money decisions. Whether you are buying your first home,
            financing a car, planning investments, or tackling debt, {SITE_NAME} gives you the
            numbers you need to move forward with confidence.
          </p>
        </section>

        {/* What We Offer */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">What We Offer</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {SITE_NAME} offers a growing suite of financial calculators designed for real-world
            decisions:
          </p>
          <ul className="space-y-3">
            {CALCULATORS.map((calc) => (
              <li key={calc.slug} className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{calc.icon}</span>
                <div>
                  <Link
                    href={`/calculator/${calc.slug}`}
                    className="text-text-primary font-medium hover:text-accent-500 transition-colors"
                  >
                    {calc.title}
                  </Link>
                  <p className="text-text-secondary text-sm mt-0.5">
                    {calc.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-text-secondary leading-relaxed mt-4">
            We regularly add new calculators based on user feedback and emerging financial needs.
            Have a suggestion?{' '}
            <Link href="/contact" className="text-accent-500 hover:text-accent-600 underline">
              Let us know
            </Link>.
          </p>
        </section>

        {/* Accuracy Commitment */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Our Commitment to Accuracy</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            Every calculator on {SITE_NAME} uses industry-standard financial formulas — the same
            amortization schedules, compound interest equations, and repayment models used by banks
            and lending institutions.
          </p>
          <p className="text-text-secondary leading-relaxed mb-3">
            All computations run entirely in your browser. Your financial data never leaves your
            device, which means complete privacy with every calculation.
          </p>
          <div className="bg-accent-500/5 border border-accent-500/20 rounded-lg p-4 mt-4">
            <p className="text-text-secondary text-sm leading-relaxed">
              <strong className="text-text-primary">Disclaimer:</strong> While we strive for
              precision, our calculators provide estimates for informational and educational purposes
              only. Results should not be considered financial advice. Actual loan terms, interest
              rates, and payments may vary based on your credit profile, lender policies, and market
              conditions. We recommend consulting a qualified financial advisor for personalized
              guidance.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Our Story</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            {SITE_NAME} was born from a simple frustration: finding a reliable, no-nonsense
            financial calculator online was harder than it should be. Too many sites were cluttered
            with ads, required sign-ups, or produced questionable results.
          </p>
          <p className="text-text-secondary leading-relaxed mb-3">
            We set out to build something better — a clean, fast, and trustworthy toolkit that
            puts the numbers first. Built by a small team of developers and finance enthusiasts,
            {SITE_NAME} is designed to load instantly, calculate accurately, and respect your
            privacy completely.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Every feature we ship is guided by one question:{' '}
            <em className="text-text-primary">does this help our users make better financial decisions?</em>
          </p>
        </section>

        {/* Contact CTA */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Get in Touch</h2>
          <p className="text-text-secondary leading-relaxed">
            Have questions, feedback, or ideas for new calculators? We would love to hear from you.{' '}
            <Link href="/contact" className="text-accent-500 hover:text-accent-600 underline">
              Contact us
            </Link>{' '}
            and we will get back to you as soon as possible.
          </p>
        </section>
      </div>
    </div>
  );
}
