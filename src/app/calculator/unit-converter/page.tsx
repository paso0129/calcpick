'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { SITE_URL } from '@/lib/constants';
import { UNIT_CATEGORIES, convert } from '@/lib/units';
import { UNIT_SEO } from '@/lib/unit-seo';

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_TITLE = 'Unit Converter - Free Online Unit Conversion Tool | CalcPick';
const PAGE_URL = `${SITE_URL}/calculator/unit-converter`;

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Calculators', href: '/' },
  { label: 'Unit Converter' },
];

const BREADCRUMB_JSON_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Calculators', url: SITE_URL },
  { name: 'Unit Converter', url: PAGE_URL },
];

const FAQ_ITEMS = [
  {
    question: 'How many unit categories does this converter support?',
    answer:
      'This unit converter supports 17 categories including Length, Weight, Temperature, Area, Volume, Speed, Time, Digital Storage, Pressure, Energy, Radiation, Frequency, Power, Angle, Force, Data Rate, and Fuel Economy. Each category has its own dedicated page with detailed conversion tables and reference information.',
  },
  {
    question: 'How does temperature conversion work differently from other units?',
    answer:
      'Temperature conversion uses non-linear formulas rather than simple multiplication. Converting between Celsius, Fahrenheit, and Kelvin requires specific formulas: °F = °C × 9/5 + 32, and K = °C + 273.15. All other unit categories use a linear base-unit ratio for conversion.',
  },
  {
    question: 'Can I convert in both directions?',
    answer:
      'Yes, the converter supports bidirectional input. You can type a value in either the left or right input field, and the other field will update automatically with the converted result. You can also use the swap button to quickly reverse the from and to units.',
  },
  {
    question: 'Are the conversions accurate for professional use?',
    answer:
      'Yes, all conversions use precise mathematical constants and formulas. Results are displayed with up to 10 significant digits of precision, suitable for engineering, scientific, and professional applications. Temperature and fuel economy conversions use their respective non-linear formulas for exact results.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function UnitConverterPage() {
  const [unitCategoryId, setUnitCategoryId] = useState(UNIT_CATEGORIES[0].id);
  const [fromUnitId, setFromUnitId] = useState(UNIT_CATEGORIES[0].units[0].id);
  const [toUnitId, setToUnitId] = useState(UNIT_CATEGORIES[0].units[1].id);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const currentCategory = UNIT_CATEGORIES.find((c) => c.id === unitCategoryId) ?? UNIT_CATEGORIES[0];

  const formatConverted = (n: number): string => {
    if (isNaN(n) || !isFinite(n)) return '';
    return parseFloat(n.toPrecision(10)).toString();
  };

  const handleFromValueChange = useCallback((value: string) => {
    setFromValue(value);
    if (value === '' || isNaN(parseFloat(value))) { setToValue(''); return; }
    setToValue(formatConverted(convert(parseFloat(value), fromUnitId, toUnitId, unitCategoryId)));
  }, [fromUnitId, toUnitId, unitCategoryId]);

  const handleToValueChange = useCallback((value: string) => {
    setToValue(value);
    if (value === '' || isNaN(parseFloat(value))) { setFromValue(''); return; }
    setFromValue(formatConverted(convert(parseFloat(value), toUnitId, fromUnitId, unitCategoryId)));
  }, [fromUnitId, toUnitId, unitCategoryId]);

  const swapUnits = useCallback(() => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    setFromValue(toValue);
    setToValue(fromValue);
  }, [fromUnitId, toUnitId, fromValue, toValue]);

  const handleCategoryChange = useCallback((catId: string) => {
    setUnitCategoryId(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId) ?? UNIT_CATEGORIES[0];
    setFromUnitId(cat.units[0].id);
    setToUnitId(cat.units.length > 1 ? cat.units[1].id : cat.units[0].id);
    setFromValue('');
    setToValue('');
  }, []);

  const handleFromUnitSelect = useCallback((unitId: string) => {
    setFromUnitId(unitId);
    if (fromValue !== '' && !isNaN(parseFloat(fromValue))) {
      setToValue(formatConverted(convert(parseFloat(fromValue), unitId, toUnitId, unitCategoryId)));
    }
  }, [fromValue, toUnitId, unitCategoryId]);

  const handleToUnitSelect = useCallback((unitId: string) => {
    setToUnitId(unitId);
    if (fromValue !== '' && !isNaN(parseFloat(fromValue))) {
      setToValue(formatConverted(convert(parseFloat(fromValue), fromUnitId, unitId, unitCategoryId)));
    }
  }, [fromValue, fromUnitId, unitCategoryId]);

  return (
    <>
      <WebApplicationJsonLd
        name="Unit Converter"
        description="Free online unit converter with 17 categories and 100+ units. Convert length, weight, temperature, radiation, frequency, power, and more."
        url={PAGE_URL}
      />
      <FAQJsonLd questions={FAQ_ITEMS} />
      <BreadcrumbJsonLd items={BREADCRUMB_JSON_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={BREADCRUMB_ITEMS} />

        <div className="mt-4">
          <AdSense slot="header" variant="banner" />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8">
            {/* Quick Converter */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-lg">
              <div className="p-6 pb-4">
                <h1 className="text-lg font-semibold text-text-primary">Unit Converter</h1>
                <p className="text-sm text-text-tertiary mt-1">
                  Convert between 100+ units across 17 categories
                </p>
              </div>

              {/* Category Tabs */}
              <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  {UNIT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        unitCategoryId === cat.id
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-dark-elevated hover:bg-dark-border text-text-secondary'
                      }`}
                    >
                      <span className="mr-1">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Converter */}
              <div className="px-6 pb-6">
                <div className="flex items-end gap-3">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs text-text-tertiary mb-1.5">From</label>
                    <select
                      value={fromUnitId}
                      onChange={(e) => handleFromUnitSelect(e.target.value)}
                      className="w-full h-10 px-3 mb-2 rounded-lg bg-dark-elevated border border-dark-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all cursor-pointer"
                    >
                      {currentCategory.units.map((u) => (
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
                  <button
                    onClick={swapUnits}
                    className="mb-2 p-3 rounded-xl bg-dark-elevated hover:bg-dark-border text-text-secondary transition-colors active:scale-[0.95]"
                    title="Swap units"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs text-text-tertiary mb-1.5">To</label>
                    <select
                      value={toUnitId}
                      onChange={(e) => handleToUnitSelect(e.target.value)}
                      className="w-full h-10 px-3 mb-2 rounded-lg bg-dark-elevated border border-dark-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all cursor-pointer"
                    >
                      {currentCategory.units.map((u) => (
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

                {fromValue && toValue && (
                  <div className="mt-4 p-3 rounded-lg bg-dark-base border border-dark-border">
                    <p className="text-xs text-text-tertiary text-center" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                      {fromValue} {currentCategory.units.find(u => u.id === fromUnitId)?.symbol} = {toValue} {currentCategory.units.find(u => u.id === toUnitId)?.symbol}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Category Grid */}
            <div className="mt-6">
              <h2 className="text-base font-semibold text-text-primary mb-4">All Unit Converters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {UNIT_CATEGORIES.map((cat) => {
                  const seo = UNIT_SEO[cat.id];
                  return (
                    <Link
                      key={cat.id}
                      href={`/calculator/unit-converter/${cat.id}`}
                      className="bg-dark-surface border border-dark-border rounded-xl p-4 hover:border-indigo-500/30 hover:bg-dark-elevated/50 transition-all group"
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <h3 className="text-sm font-medium text-text-primary mt-2 group-hover:text-indigo-400 transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-text-tertiary mt-1">
                        {cat.units.length} units
                      </p>
                      {seo && (
                        <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                          {cat.units.map(u => u.symbol).join(', ')}
                        </p>
                      )}
                    </Link>
                  );
                })}
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
          <h2>Free Online Unit Converter</h2>
          <p>
            CalcPick&apos;s unit converter covers 17 measurement categories with over 100 individual units.
            Each category has a dedicated converter page with detailed reference tables, conversion formulas,
            and frequently asked questions. Whether you need everyday conversions like miles to kilometers
            or specialized conversions like sieverts to rem, every tool is free and works instantly in your browser.
          </p>

          <h2>Available Conversion Categories</h2>
          <p>
            <strong>Everyday Units:</strong> Length (meters, feet, miles), Weight (kilograms, pounds, ounces),
            Temperature (Celsius, Fahrenheit, Kelvin), Volume (liters, gallons, cups), Time (seconds to years),
            and Speed (km/h, mph, knots).
          </p>
          <p>
            <strong>Engineering &amp; Science:</strong> Pressure (Pascal, PSI, bar), Energy (joules, kWh, BTU),
            Power (watts, horsepower), Force (newtons, pound-force), Angle (degrees, radians), and
            Radiation (sieverts, rem, grays).
          </p>
          <p>
            <strong>Technology &amp; Transport:</strong> Digital Storage (bytes to petabytes), Data Rate
            (Mbps, GB/s), Fuel Economy (MPG, L/100km), and Frequency (Hz, MHz, GHz).
          </p>
          <p>
            Area (square meters, acres, hectares) rounds out the collection for real estate and land measurement needs.
          </p>

          <h2>Frequently Asked Questions</h2>
          {FAQ_ITEMS.map((faq, idx) => (
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
