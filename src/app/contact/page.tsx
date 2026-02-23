import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with the ${SITE_NAME} team. Send us feedback, bug reports, feature requests, or general inquiries.`,
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="text-sm text-text-secondary mb-6">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Contact</span>
      </nav>

      <h1 className="text-3xl font-bold text-text-primary mb-6">Contact Us</h1>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
        <p className="text-text-secondary leading-relaxed mb-6">
          We&apos;d love to hear from you. Whether you have a question about one of our calculators,
          found a bug, or just want to share your thoughts, don&apos;t hesitate to reach out.
        </p>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-accent-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-text-primary font-semibold mb-1">Email</h2>
            <a
              href="mailto:contact@calcpick.com"
              className="text-accent-500 hover:text-accent-600 transition-colors"
            >
              contact@calcpick.com
            </a>
          </div>
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4">What You Can Contact Us About</h2>
        <ul className="space-y-3 text-text-secondary text-sm">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full shrink-0" />
            <strong className="text-text-primary">Bug Reports</strong> — Found something that doesn&apos;t work correctly? Let us know so we can fix it.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full shrink-0" />
            <strong className="text-text-primary">Feature Requests</strong> — Have an idea for a new calculator or feature? We&apos;re always looking to improve.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full shrink-0" />
            <strong className="text-text-primary">General Inquiries</strong> — Questions about our calculators, how they work, or anything else.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full shrink-0" />
            <strong className="text-text-primary">Feedback</strong> — Tell us what you like, what could be better, or share your experience.
          </li>
        </ul>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-accent-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-text-primary font-semibold mb-1">Response Time</h2>
            <p className="text-text-secondary text-sm">
              We typically respond within 1-2 business days. Thank you for your patience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
