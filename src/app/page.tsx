import Link from 'next/link';
import { CALCULATORS, SITE_NAME } from '@/lib/constants';
import AdSense from '@/components/ads/AdSense';

const utilityCalcs = CALCULATORS.filter((c) => c.category === 'Utility');
const financeCalcs = CALCULATORS.filter((c) => c.category === 'Finance');

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-500/10 to-transparent border-b border-dark-border">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Free Online Calculators &amp; Tools
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            From unit conversions to mortgage planning &mdash; accurate, instant calculators
            for everyday math and smarter financial decisions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="#tools"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Explore All Tools
            </Link>
          </div>
        </div>
      </section>

      <AdSense slot="header" variant="banner" />

      {/* Utility Tools */}
      <section id="tools" className="container mx-auto px-4 pt-12 pb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Utility Tools</h2>
        <p className="text-text-secondary mb-8">
          Essential everyday calculators and unit converters for quick, accurate results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {utilityCalcs.map((calc) => (
            <Link
              key={calc.slug}
              href={`/calculator/${calc.slug}`}
              className="group bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-500/5 transition-all"
            >
              <div className="text-3xl mb-3">{calc.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-500 transition-colors mb-2">
                {calc.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {calc.description}
              </p>
              <div className="mt-4 flex items-center text-accent-500 text-sm font-medium">
                Try it
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Finance Calculators */}
      <section id="calculators" className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Finance Calculators</h2>
        <p className="text-text-secondary mb-8">
          Powerful tools to help you plan loans, investments, and debt repayment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeCalcs.map((calc) => (
            <Link
              key={calc.slug}
              href={`/calculator/${calc.slug}`}
              className="group bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-500/5 transition-all"
            >
              <div className="text-3xl mb-3">{calc.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-500 transition-colors mb-2">
                {calc.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {calc.description}
              </p>
              <div className="mt-4 flex items-center text-accent-500 text-sm font-medium">
                Try Calculator
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AdSense slot="in-article" variant="in-feed" />

      {/* Why CalcPick */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
          Why Use {SITE_NAME}?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-text-primary font-semibold mb-2">Instant Results</h3>
            <p className="text-text-secondary text-sm">
              Get real-time calculations as you adjust inputs. No page reloads or waiting.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-text-primary font-semibold mb-2">Accurate Formulas</h3>
            <p className="text-text-secondary text-sm">
              Industry-standard formulas and precise conversion constants for reliable results.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-text-primary font-semibold mb-2">100% Private</h3>
            <p className="text-text-secondary text-sm">
              All calculations happen in your browser. Your data never leaves your device.
            </p>
          </div>
        </div>
      </section>

      <AdSense slot="footer" variant="banner" />
    </div>
  );
}
