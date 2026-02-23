import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${SITE_NAME}. Please read these terms carefully before using our calculators.`,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
      <p className="text-text-tertiary text-sm mb-8">Last updated: February 2026</p>

      <div className="space-y-8">
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Acceptance of Terms</h2>
          <p className="text-text-secondary leading-relaxed">
            By accessing and using {SITE_NAME} ({SITE_URL}), you accept and agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Calculator Disclaimer</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            Our calculators are provided for informational and educational purposes only. Results are
            estimates based on the information you provide and standard financial formulas.
          </p>
          <p className="text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Important:</strong> Calculator results should NOT be considered
            as financial advice, tax advice, or a guarantee of actual loan terms. Actual results may vary
            significantly based on your credit score, lender policies, fees, taxes, and other factors not
            accounted for in our calculations. Always consult with a qualified financial professional before
            making financial decisions.
          </p>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Use of Service</h2>
          <p className="text-text-secondary leading-relaxed">You agree to:</p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm mt-3">
            <li>Use the calculators only for lawful purposes</li>
            <li>Not attempt to reverse-engineer, modify, or redistribute our tools</li>
            <li>Not use automated systems to access our website in a manner that overloads our servers</li>
            <li>Verify all calculator results independently before making financial decisions</li>
          </ul>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Limitation of Liability</h2>
          <p className="text-text-secondary leading-relaxed">
            {SITE_NAME} shall not be liable for any direct, indirect, incidental, consequential, or
            punitive damages arising from your use of our calculators or reliance on their results.
            We make no warranties, express or implied, regarding the accuracy, completeness, or
            reliability of calculator outputs.
          </p>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Intellectual Property</h2>
          <p className="text-text-secondary leading-relaxed">
            All content, design, and code on {SITE_NAME} are protected by intellectual property laws.
            You may not reproduce, distribute, or create derivative works without our written permission.
          </p>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Changes to Terms</h2>
          <p className="text-text-secondary leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. Changes take effect
            immediately upon posting. Continued use of the website constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Contact</h2>
          <p className="text-text-secondary leading-relaxed">
            Questions about these Terms? Contact us at{' '}
            <a href="mailto:contact@calcpick.com" className="text-accent-500 hover:text-accent-600 underline">
              contact@calcpick.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
