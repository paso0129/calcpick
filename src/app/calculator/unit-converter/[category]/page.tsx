'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { SITE_URL } from '@/lib/constants';
import { UNIT_CATEGORIES, convert } from '@/lib/units';
import { UNIT_SEO } from '@/lib/unit-seo';

export default function UnitCategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const seo = UNIT_SEO[categorySlug];
  const category = UNIT_CATEGORIES.find((c) => c.id === categorySlug);

  const [fromUnitId, setFromUnitId] = useState('');
  const [toUnitId, setToUnitId] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  // Initialize units when category loads
  useEffect(() => {
    if (category) {
      setFromUnitId(category.units[0].id);
      setToUnitId(category.units.length > 1 ? category.units[1].id : category.units[0].id);
      setFromValue('');
      setToValue('');
    }
  }, [category]);

  useEffect(() => {
    if (seo) document.title = seo.pageTitle;

    const linkId = 'roboto-mono-font';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, [seo]);

  const formatConverted = (n: number): string => {
    if (isNaN(n) || !isFinite(n)) return '';
    return parseFloat(n.toPrecision(10)).toString();
  };

  const handleFromValueChange = useCallback((value: string) => {
    setFromValue(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setToValue('');
      return;
    }
    const converted = convert(parseFloat(value), fromUnitId, toUnitId, categorySlug);
    setToValue(formatConverted(converted));
  }, [fromUnitId, toUnitId, categorySlug]);

  const handleToValueChange = useCallback((value: string) => {
    setToValue(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setFromValue('');
      return;
    }
    const converted = convert(parseFloat(value), toUnitId, fromUnitId, categorySlug);
    setFromValue(formatConverted(converted));
  }, [fromUnitId, toUnitId, categorySlug]);

  const swapUnits = useCallback(() => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    setFromValue(toValue);
    setToValue(fromValue);
  }, [fromUnitId, toUnitId, fromValue, toValue]);

  const handleFromUnitSelect = useCallback((unitId: string) => {
    setFromUnitId(unitId);
    if (fromValue !== '' && !isNaN(parseFloat(fromValue))) {
      const converted = convert(parseFloat(fromValue), unitId, toUnitId, categorySlug);
      setToValue(formatConverted(converted));
    }
  }, [fromValue, toUnitId, categorySlug]);

  const handleToUnitSelect = useCallback((unitId: string) => {
    setToUnitId(unitId);
    if (fromValue !== '' && !isNaN(parseFloat(fromValue))) {
      const converted = convert(parseFloat(fromValue), fromUnitId, unitId, categorySlug);
      setToValue(formatConverted(converted));
    }
  }, [fromValue, fromUnitId, categorySlug]);

  // 404 fallback
  if (!seo || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Category Not Found</h1>
        <p className="text-text-secondary mb-6">The unit category &quot;{categorySlug}&quot; does not exist.</p>
        <Link href="/calculator/unit-converter" className="text-indigo-400 hover:text-indigo-300 underline">
          Back to Unit Converter
        </Link>
      </div>
    );
  }

  const PAGE_URL = `${SITE_URL}/calculator/unit-converter/${categorySlug}`;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/' },
    { label: 'Unit Converter', href: '/calculator/unit-converter' },
    { label: seo.h1 },
  ];

  const breadcrumbJsonItems = [
    { name: 'Home', url: SITE_URL },
    { name: 'Calculators', url: SITE_URL },
    { name: 'Unit Converter', url: `${SITE_URL}/calculator/unit-converter` },
    { name: seo.h1, url: PAGE_URL },
  ];

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  return (
    <>
      <WebApplicationJsonLd
        name={seo.h1}
        description={seo.description}
        url={PAGE_URL}
      />
      <FAQJsonLd questions={seo.faqs} />
      <BreadcrumbJsonLd items={breadcrumbJsonItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-4">
          <AdSense slot="header" variant="banner" />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8">
            <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-lg">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{category.icon}</span>
                  <h1 className="text-lg font-semibold text-text-primary">{seo.h1}</h1>
                </div>
                <p className="text-sm text-text-tertiary">{seo.subtitle}</p>
              </div>

              {/* Converter */}
              <div className="px-6 pb-6">
                <div className="flex items-end gap-3">
                  {/* From */}
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs text-text-tertiary mb-1.5">From</label>
                    <select
                      value={fromUnitId}
                      onChange={(e) => handleFromUnitSelect(e.target.value)}
                      className="w-full h-10 px-3 mb-2 rounded-lg bg-dark-elevated border border-dark-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all cursor-pointer"
                    >
                      {category.units.map((u) => (
                        <option key={u.id} value={u.id}>{u.label} ({u.symbol})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      placeholder="0"
                      className="w-full h-14 px-4 rounded-xl bg-dark-base border border-dark-border text-text-primary text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                      style={{ fontFamily: "'Roboto Mono', monospace" }}
                    />
                  </div>

                  {/* Swap */}
                  <button
                    onClick={swapUnits}
                    className="mb-2 p-3 rounded-xl bg-dark-elevated hover:bg-dark-border text-text-secondary transition-colors active:scale-[0.95]"
                    title="Swap units"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>

                  {/* To */}
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs text-text-tertiary mb-1.5">To</label>
                    <select
                      value={toUnitId}
                      onChange={(e) => handleToUnitSelect(e.target.value)}
                      className="w-full h-10 px-3 mb-2 rounded-lg bg-dark-elevated border border-dark-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all cursor-pointer"
                    >
                      {category.units.map((u) => (
                        <option key={u.id} value={u.id}>{u.label} ({u.symbol})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={toValue}
                      onChange={(e) => handleToValueChange(e.target.value)}
                      placeholder="0"
                      className="w-full h-14 px-4 rounded-xl bg-dark-base border border-dark-border text-text-primary text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                      style={{ fontFamily: "'Roboto Mono', monospace" }}
                    />
                  </div>
                </div>

                {/* Conversion result */}
                {fromValue && toValue && fromUnit && toUnit && (
                  <div className="mt-4 p-3 rounded-lg bg-dark-base border border-dark-border">
                    <p className="text-xs text-text-tertiary text-center" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                      {fromValue} {fromUnit.symbol} = {toValue} {toUnit.symbol}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick reference table */}
              <div className="px-6 pb-6">
                <h2 className="text-sm font-semibold text-text-primary mb-3">Quick Reference</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="py-2 px-3 text-left text-text-tertiary font-medium">Unit</th>
                        <th className="py-2 px-3 text-left text-text-tertiary font-medium">Symbol</th>
                        <th className="py-2 px-3 text-right text-text-tertiary font-medium">
                          = 1 {category.units[0]?.symbol}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.units.map((u) => {
                        const val = convert(1, category.units[0].id, u.id, categorySlug);
                        return (
                          <tr key={u.id} className="border-b border-dark-border/50 hover:bg-dark-elevated/30">
                            <td className="py-2 px-3 text-text-secondary">{u.label}</td>
                            <td className="py-2 px-3 text-text-tertiary">{u.symbol}</td>
                            <td className="py-2 px-3 text-right text-text-primary" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                              {formatConverted(val)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Other categories */}
            <div className="mt-6 bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-lg p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Other Unit Converters</h2>
              <div className="flex flex-wrap gap-2">
                {UNIT_CATEGORIES.filter((c) => c.id !== categorySlug).map((c) => (
                  <Link
                    key={c.id}
                    href={`/calculator/unit-converter/${c.id}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-dark-elevated hover:bg-dark-border text-text-secondary transition-colors"
                  >
                    <span className="mr-1">{c.icon}</span>
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <AdSense slot="sidebar" variant="sidebar" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AdSense slot="in-article" variant="in-feed" />
        </div>

        {/* SEO Content */}
        <article className="mt-12 max-w-4xl mx-auto prose prose-slate dark:prose-invert prose-headings:text-text-primary prose-p:text-text-secondary prose-li:text-text-secondary">
          {seo.article.map((section, idx) => (
            <div key={idx}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>
          ))}

          <h2>Frequently Asked Questions</h2>
          {seo.faqs.map((faq, idx) => (
            <div key={idx}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </article>
      </div>
    </>
  );
}
