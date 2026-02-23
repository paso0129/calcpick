import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your data, including our use of Google Analytics, Google AdSense, and cookies.`,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="text-sm text-dark-secondary mb-6">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-dark-primary">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
      <p className="text-text-tertiary text-sm mb-8">Last updated: February 23, 2026</p>

      <div className="space-y-8">
        {/* Overview */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Overview</h2>
          <p className="text-text-secondary leading-relaxed">
            {SITE_NAME} ({SITE_URL}) is committed to protecting your privacy. This Privacy Policy
            explains what information we collect, how we use it, and your rights regarding that
            information. All calculator computations are performed client-side in your browser — we
            do not collect, store, or transmit any financial data you enter into our calculators.
          </p>
        </section>

        {/* Information Collection */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Information We Collect</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            We collect minimal information necessary to operate and improve our website. The types
            of information we may collect include:
          </p>

          <h3 className="text-lg font-medium text-text-primary mb-2">Automatically Collected Information</h3>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm mb-4">
            <li>
              <strong className="text-text-primary">Usage Data:</strong> Pages visited, time spent
              on pages, referral sources, browser type, operating system, device type, and screen
              resolution.
            </li>
            <li>
              <strong className="text-text-primary">IP Address:</strong> Your IP address may be
              collected by our analytics and advertising partners. IP addresses are anonymized where
              possible.
            </li>
            <li>
              <strong className="text-text-primary">Cookies and Similar Technologies:</strong> Small
              text files and tracking pixels stored on your device to enable functionality, analytics,
              and advertising.
            </li>
          </ul>

          <h3 className="text-lg font-medium text-text-primary mb-2">Voluntarily Provided Information</h3>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
            <li>
              <strong className="text-text-primary">Contact Information:</strong> If you contact us
              via email at{' '}
              <a href="mailto:contact@calcpick.com" className="text-accent-500 hover:text-accent-600 underline">
                contact@calcpick.com
              </a>, we collect your email address and any information you include in your message.
            </li>
          </ul>
        </section>

        {/* Google Analytics */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Google Analytics (GA4)</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            We use Google Analytics 4 (GA4) to understand how visitors interact with our website.
            Google Analytics collects the following types of data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm mb-4">
            <li>Page views and navigation paths</li>
            <li>Session duration and bounce rate</li>
            <li>Geographic location (country/region level)</li>
            <li>Device type, browser, and operating system</li>
            <li>Traffic sources and referral URLs</li>
            <li>User interactions and events on the website</li>
          </ul>
          <p className="text-text-secondary leading-relaxed mb-3">
            Google Analytics uses cookies to distinguish unique users and sessions. The data collected
            is aggregated and anonymized. We have enabled IP anonymization to ensure your full IP
            address is not stored by Google.
          </p>
          <p className="text-text-secondary leading-relaxed">
            You can opt out of Google Analytics by installing the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-500 hover:text-accent-600 underline"
            >
              Google Analytics Opt-out Browser Add-on
            </a>. For more information, see{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-500 hover:text-accent-600 underline"
            >
              Google&apos;s Privacy Policy
            </a>.
          </p>
        </section>

        {/* Google AdSense */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Google AdSense and Advertising</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            We use Google AdSense to display advertisements on our website. Google AdSense uses
            cookies and web beacons to serve ads based on your prior visits to our website and other
            websites on the Internet.
          </p>
          <p className="text-text-secondary leading-relaxed mb-3">
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based on
            your browsing patterns. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm mb-4">
            <li>
              Google uses the DoubleClick cookie to serve ads based on your visits to this and other
              websites.
            </li>
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on your prior
              visits to this website.
            </li>
            <li>
              Advertising partners may collect information about your online activities over time and
              across different websites.
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            You can opt out of personalized advertising by visiting{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-500 hover:text-accent-600 underline"
            >
              Google Ads Settings
            </a>{' '}
            or the{' '}
            <a
              href="https://optout.networkadvertising.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-500 hover:text-accent-600 underline"
            >
              Network Advertising Initiative opt-out page
            </a>.
          </p>
        </section>

        {/* Cookie Policy */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Cookie Policy</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Cookies are small text files placed on your device when you visit a website. We use the
            following types of cookies:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-1">Strictly Necessary Cookies</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                These cookies are essential for the website to function properly. They include cookies
                for theme preferences (dark/light mode) stored in localStorage and cookie consent
                preferences. These cookies do not collect personal information and cannot be disabled.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-text-primary mb-1">Analytics Cookies</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Google Analytics cookies (e.g., <code className="text-accent-500">_ga</code>,{' '}
                <code className="text-accent-500">_ga_*</code>) help us understand how visitors use
                our website by collecting anonymous usage statistics. These cookies typically expire
                after 2 years.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-text-primary mb-1">Advertising Cookies</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Google AdSense cookies (e.g., <code className="text-accent-500">__gads</code>,{' '}
                <code className="text-accent-500">__gpi</code>) are used to serve relevant
                advertisements and track ad performance. These cookies may be set by third-party
                advertising networks.
              </p>
            </div>
          </div>

          <p className="text-text-secondary leading-relaxed mt-4">
            You can manage your cookie preferences at any time using the &quot;Manage Privacy
            Settings&quot; link in our footer, or by adjusting your browser settings to refuse or
            delete cookies. Note that disabling certain cookies may affect website functionality.
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Third-Party Services</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            We use the following third-party services that may collect information about you:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
            <li>
              <strong className="text-text-primary">Google Analytics:</strong> Web analytics service.
              Subject to{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-500 hover:text-accent-600 underline"
              >
                Google&apos;s Privacy Policy
              </a>.
            </li>
            <li>
              <strong className="text-text-primary">Google AdSense:</strong> Advertising service.
              Subject to{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-500 hover:text-accent-600 underline"
              >
                Google&apos;s Privacy Policy
              </a>.
            </li>
            <li>
              <strong className="text-text-primary">Vercel:</strong> Website hosting platform.
              Subject to{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-500 hover:text-accent-600 underline"
              >
                Vercel&apos;s Privacy Policy
              </a>.
            </li>
            <li>
              <strong className="text-text-primary">Cloudflare:</strong> DNS and CDN services.
              Subject to{' '}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-500 hover:text-accent-600 underline"
              >
                Cloudflare&apos;s Privacy Policy
              </a>.
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-3">
            We do not control the privacy practices of these third-party services. We encourage you
            to review their respective privacy policies.
          </p>
        </section>

        {/* Data Security */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Data Security</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            We take reasonable measures to protect information collected through our website:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
            <li>Our website is served exclusively over HTTPS with TLS encryption.</li>
            <li>All calculator computations occur locally in your browser, ensuring your financial data never leaves your device.</li>
            <li>We do not store personal financial information on our servers.</li>
            <li>We regularly review our data collection practices to minimize the information we collect.</li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-3">
            While we strive to protect your information, no method of transmission over the Internet
            or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        {/* GDPR Compliance */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            GDPR Compliance (European Economic Area)
          </h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            If you are located in the European Economic Area (EEA), you have certain data protection
            rights under the General Data Protection Regulation (GDPR). These include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm mb-4">
            <li><strong className="text-text-primary">Right of Access:</strong> You can request a copy of the personal data we hold about you.</li>
            <li><strong className="text-text-primary">Right to Rectification:</strong> You can request correction of any inaccurate personal data.</li>
            <li><strong className="text-text-primary">Right to Erasure:</strong> You can request deletion of your personal data under certain conditions.</li>
            <li><strong className="text-text-primary">Right to Restrict Processing:</strong> You can request restriction of processing of your personal data.</li>
            <li><strong className="text-text-primary">Right to Data Portability:</strong> You can request transfer of your personal data in a machine-readable format.</li>
            <li><strong className="text-text-primary">Right to Object:</strong> You can object to the processing of your personal data for certain purposes, including direct marketing.</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            Our legal basis for processing personal data includes legitimate interests (website
            analytics and improvement) and consent (advertising cookies). You may withdraw consent
            at any time through our cookie consent manager.
          </p>
        </section>

        {/* CCPA Compliance */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            CCPA Compliance (California Residents)
          </h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            If you are a California resident, the California Consumer Privacy Act (CCPA) provides you
            with additional rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm mb-4">
            <li><strong className="text-text-primary">Right to Know:</strong> You can request disclosure of the categories and specific pieces of personal information we have collected about you.</li>
            <li><strong className="text-text-primary">Right to Delete:</strong> You can request deletion of personal information we have collected from you.</li>
            <li><strong className="text-text-primary">Right to Opt-Out:</strong> You can opt out of the sale or sharing of your personal information. We do not sell personal information in the traditional sense, but the use of advertising cookies may constitute &quot;sharing&quot; under the CCPA.</li>
            <li><strong className="text-text-primary">Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            To exercise your CCPA rights, please contact us at{' '}
            <a href="mailto:contact@calcpick.com" className="text-accent-500 hover:text-accent-600 underline">
              contact@calcpick.com
            </a>.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            Children&apos;s Privacy (COPPA Compliance)
          </h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            {SITE_NAME} is not directed at children under the age of 13 and does not knowingly collect
            personal information from children under 13 years of age, in compliance with the
            Children&apos;s Online Privacy Protection Act (COPPA).
          </p>
          <p className="text-text-secondary leading-relaxed">
            If we become aware that we have inadvertently collected personal information from a child
            under 13, we will take steps to delete that information as soon as possible. If you
            believe that a child under 13 has provided us with personal information, please contact
            us at{' '}
            <a href="mailto:contact@calcpick.com" className="text-accent-500 hover:text-accent-600 underline">
              contact@calcpick.com
            </a>.
          </p>
        </section>

        {/* Changes to This Policy */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Changes to This Privacy Policy</h2>
          <p className="text-text-secondary leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. When we make changes, we will update the
            &quot;Last updated&quot; date at the top of this page. We encourage you to review this
            Privacy Policy periodically to stay informed about how we protect your information.
            Continued use of the website after changes are posted constitutes your acceptance of the
            revised policy.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Contact Us</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our
            data practices, please contact us:
          </p>
          <ul className="list-none space-y-2 text-text-secondary text-sm">
            <li>
              <strong className="text-text-primary">Email:</strong>{' '}
              <a href="mailto:contact@calcpick.com" className="text-accent-500 hover:text-accent-600 underline">
                contact@calcpick.com
              </a>
            </li>
            <li>
              <strong className="text-text-primary">Website:</strong>{' '}
              <a href={SITE_URL} className="text-accent-500 hover:text-accent-600 underline">
                {SITE_URL}
              </a>
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-3">
            We will respond to your inquiry within 30 days.
          </p>
        </section>
      </div>
    </div>
  );
}
