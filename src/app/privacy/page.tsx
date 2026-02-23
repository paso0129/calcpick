import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_NAME}. Learn how we handle your data and protect your privacy.`,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
      <p className="text-text-tertiary text-sm mb-8">Last updated: February 2026</p>

      <div className="space-y-8">
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Overview</h2>
          <p className="text-text-secondary leading-relaxed">
            {SITE_NAME} ({SITE_URL}) respects your privacy. This Privacy Policy explains how we collect,
            use, and protect information when you use our website. All calculator computations are performed
            client-side in your browser - we do not collect, store, or transmit any financial data you enter
            into our calculators.
          </p>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Information We Collect</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            We may collect the following types of information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
            <li><strong className="text-text-primary">Usage Data:</strong> Pages visited, time spent, browser type, and device information through analytics tools.</li>
            <li><strong className="text-text-primary">Cookies:</strong> Small text files stored on your device for functionality and advertising purposes.</li>
            <li><strong className="text-text-primary">Contact Information:</strong> Only if you voluntarily contact us via email.</li>
          </ul>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Cookies and Tracking</h2>
          <p className="text-text-secondary leading-relaxed mb-3">We use cookies for:</p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
            <li><strong className="text-text-primary">Strictly Necessary:</strong> Theme preference (dark/light mode) stored in localStorage.</li>
            <li><strong className="text-text-primary">Advertising:</strong> Google AdSense may use cookies to serve personalized ads based on your browsing history. You can manage this through our cookie consent banner or at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-600 underline">Google Ads Settings</a>.</li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-3">
            You can manage your cookie preferences at any time using the &quot;Manage Privacy Settings&quot; link in our footer.
          </p>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Third-Party Services</h2>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
            <li><strong className="text-text-primary">Google AdSense:</strong> Serves advertisements. Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-600 underline">Google&apos;s Privacy Policy</a>.</li>
            <li><strong className="text-text-primary">Vercel:</strong> Hosts our website. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-600 underline">Vercel&apos;s Privacy Policy</a>.</li>
          </ul>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Your Rights</h2>
          <p className="text-text-secondary leading-relaxed">
            Under GDPR and similar regulations, you have the right to access, correct, delete, or restrict
            processing of your personal data. Since we do not collect personal financial data, this primarily
            applies to any contact information you may have provided. To exercise your rights, contact us at{' '}
            <a href="mailto:contact@calcpick.com" className="text-accent-500 hover:text-accent-600 underline">
              contact@calcpick.com
            </a>.
          </p>
        </section>

        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Changes to This Policy</h2>
          <p className="text-text-secondary leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated revision date.
          </p>
        </section>
      </div>
    </div>
  );
}
