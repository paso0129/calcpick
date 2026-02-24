'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { WebApplicationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import AdSense from '@/components/ads/AdSense';
import { SITE_URL } from '@/lib/constants';

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_TITLE = 'Professional Calculator - Free Online Scientific Calculator | CalcPick';
const PAGE_URL = `${SITE_URL}/calculator/basic`;

const BREADCRUMB_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Calculators', href: '/' },
  { label: 'Professional Calculator' },
];

const BREADCRUMB_JSON_ITEMS = [
  { name: 'Home', url: SITE_URL },
  { name: 'Calculators', url: SITE_URL },
  { name: 'Professional Calculator', url: PAGE_URL },
];

const FAQ_ITEMS = [
  {
    question: 'Is this calculator free to use?',
    answer:
      'Yes, this professional calculator is completely free to use with no registration required. It includes standard arithmetic operations, scientific functions, calculation history, and a built-in unit converter. You can access all features from any device with a web browser.',
  },
  {
    question: 'Does the calculator support keyboard input?',
    answer:
      'Yes, full keyboard support is available. Use number keys (0-9) for digits, standard operators (+, -, *, /) for arithmetic, Enter or = for equals, Escape for clear (AC), Backspace to delete the last digit, and the period key for decimals. This makes the calculator as fast and intuitive as a desktop application.',
  },
  {
    question: 'How accurate are the calculations?',
    answer:
      'The calculator uses JavaScript double-precision floating-point arithmetic (IEEE 754), which provides approximately 15-17 significant decimal digits of precision. For everyday calculations, this level of accuracy is more than sufficient. The calculator also applies rounding corrections to mitigate common floating-point display artifacts like 0.1 + 0.2 showing as 0.30000000000000004.',
  },
  {
    question: 'Can I use the scientific functions on mobile?',
    answer:
      'Absolutely. The scientific mode toggle is fully responsive and works on all screen sizes. Tap the "Scientific" button to reveal trigonometric functions (sin, cos, tan), logarithms (log, ln), square root, power, and constants like pi and e. The expanded panel is optimized for touch input with appropriately sized buttons.',
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface HistoryEntry {
  equation: string;
  result: string;
}

type UnitCategory = 'length' | 'weight' | 'temperature';

// ─── Utility Functions ───────────────────────────────────────────────────────

function formatDisplayNumber(value: string): string {
  if (value === 'Error' || value === 'Infinity' || value === '-Infinity' || value === 'NaN') {
    return value;
  }

  const parts = value.split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  const isNegative = intPart.startsWith('-');
  const absInt = isNegative ? intPart.slice(1) : intPart;
  const formatted = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let result = isNegative ? '-' + formatted : formatted;
  if (decPart !== undefined) {
    result += '.' + decPart;
  }
  return result;
}

function safeEval(a: number, op: string, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function roundResult(value: number): number {
  if (!isFinite(value)) return value;
  return parseFloat(value.toPrecision(15));
}

function convertUnit(value: number, category: UnitCategory, direction: 'forward' | 'reverse'): number {
  switch (category) {
    case 'length':
      return direction === 'forward' ? value * 1.60934 : value / 1.60934;
    case 'weight':
      return direction === 'forward' ? value * 0.453592 : value / 0.453592;
    case 'temperature':
      return direction === 'forward'
        ? (value - 32) * (5 / 9)
        : value * (9 / 5) + 32;
    default:
      return value;
  }
}

const unitLabels: Record<UnitCategory, [string, string]> = {
  length: ['Miles', 'Kilometers'],
  weight: ['Pounds', 'Kilograms'],
  temperature: ['°F', '°C'],
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function BasicCalculatorPage() {
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // UI state
  const [scientificMode, setScientificMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('calcpick-history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [copied, setCopied] = useState(false);

  // Unit converter state
  const [unitCategory, setUnitCategory] = useState<UnitCategory>('length');
  const [unitFrom, setUnitFrom] = useState('');
  const [unitTo, setUnitTo] = useState('');
  const [unitReversed, setUnitReversed] = useState(false);

  const displayRef = useRef<HTMLDivElement>(null);

  // ─── Persist history to localStorage ────────────────────────────────────

  useEffect(() => {
    try { localStorage.setItem('calcpick-history', JSON.stringify(history)); }
    catch { /* quota exceeded */ }
  }, [history]);

  // ─── Load Roboto Mono & set document title ──────────────────────────────

  useEffect(() => {
    document.title = PAGE_TITLE;

    const linkId = 'roboto-mono-font';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // ─── Calculator Logic ───────────────────────────────────────────────────

  const clearAll = useCallback(() => {
    setDisplay('0');
    setEquation('');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay((prev) => (prev === '0' ? digit : prev + digit));
    }
  }, [waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  }, [waitingForOperand, display]);

  const handleBackspace = useCallback(() => {
    if (waitingForOperand) return;
    setDisplay((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) return '0';
      return prev.slice(0, -1);
    });
  }, [waitingForOperand]);

  const toggleSign = useCallback(() => {
    setDisplay((prev) => {
      if (prev === '0') return '0';
      return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
    });
  }, []);

  const handlePercentage = useCallback(() => {
    const current = parseFloat(display);
    if (isNaN(current)) return;
    const result = roundResult(current / 100);
    setDisplay(String(result));
  }, [display]);

  const handleOperator = useCallback((nextOp: string) => {
    const current = parseFloat(display);

    const opSymbol: Record<string, string> = { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7' };

    if (previousValue !== null && operator && !waitingForOperand) {
      const result = roundResult(safeEval(previousValue, operator, current));
      setDisplay(String(result));
      setPreviousValue(result);
      setEquation(`${result} ${opSymbol[nextOp] || nextOp}`);
    } else {
      setPreviousValue(current);
      setEquation(`${current} ${opSymbol[nextOp] || nextOp}`);
    }

    setOperator(nextOp);
    setWaitingForOperand(true);
  }, [display, previousValue, operator, waitingForOperand]);

  const handleEquals = useCallback(() => {
    const current = parseFloat(display);
    if (previousValue === null || !operator) return;

    const result = roundResult(safeEval(previousValue, operator, current));
    const opSymbol: Record<string, string> = { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7' };
    const fullEquation = `${previousValue} ${opSymbol[operator] || operator} ${current}`;

    const resultStr = isNaN(result) ? 'Error' : String(result);

    setHistory((prev) => {
      const entry: HistoryEntry = { equation: fullEquation, result: resultStr };
      const updated = [entry, ...prev];
      return updated.slice(0, 20);
    });

    setDisplay(resultStr);
    setEquation(fullEquation + ' =');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, previousValue, operator]);

  // ─── Scientific Functions ───────────────────────────────────────────────

  const applyScientific = useCallback((fn: string) => {
    const current = parseFloat(display);
    if (isNaN(current) && fn !== 'pi' && fn !== 'e') return;

    let result: number;
    let label: string;

    switch (fn) {
      case 'sin':
        result = roundResult(Math.sin(current));
        label = `sin(${current})`;
        break;
      case 'cos':
        result = roundResult(Math.cos(current));
        label = `cos(${current})`;
        break;
      case 'tan':
        result = roundResult(Math.tan(current));
        label = `tan(${current})`;
        break;
      case 'log':
        result = roundResult(Math.log10(current));
        label = `log(${current})`;
        break;
      case 'ln':
        result = roundResult(Math.log(current));
        label = `ln(${current})`;
        break;
      case 'sqrt':
        result = roundResult(Math.sqrt(current));
        label = `\u221a(${current})`;
        break;
      case 'pow':
        result = roundResult(current * current);
        label = `(${current})\u00b2`;
        break;
      case 'pi':
        result = Math.PI;
        label = '\u03c0';
        break;
      case 'e':
        result = Math.E;
        label = 'e';
        break;
      default:
        return;
    }

    const resultStr = isNaN(result) || !isFinite(result) ? 'Error' : String(result);
    setDisplay(resultStr);
    setEquation(`${label} =`);
    setWaitingForOperand(true);
  }, [display]);

  // ─── Clipboard ──────────────────────────────────────────────────────────

  const copyToClipboard = useCallback(() => {
    const raw = display.replace(/,/g, '');
    navigator.clipboard.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      /* silently ignore */
    });
  }, [display]);

  // ─── Keyboard Support ──────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field (unit converter)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const { key } = e;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        inputDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (key === '*') {
        e.preventDefault();
        handleOperator('*');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('/');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Escape') {
        e.preventDefault();
        clearAll();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === '%') {
        e.preventDefault();
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, handleOperator, handleEquals, clearAll, handleBackspace, handlePercentage]);

  // ─── Unit Converter Logic ──────────────────────────────────────────────

  const handleUnitFromChange = useCallback((value: string) => {
    setUnitFrom(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setUnitTo('');
      return;
    }
    const num = parseFloat(value);
    const converted = convertUnit(num, unitCategory, unitReversed ? 'reverse' : 'forward');
    setUnitTo(isNaN(converted) ? '' : converted.toFixed(4).replace(/\.?0+$/, ''));
  }, [unitCategory, unitReversed]);

  const handleUnitToChange = useCallback((value: string) => {
    setUnitTo(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setUnitFrom('');
      return;
    }
    const num = parseFloat(value);
    const converted = convertUnit(num, unitCategory, unitReversed ? 'forward' : 'reverse');
    setUnitFrom(isNaN(converted) ? '' : converted.toFixed(4).replace(/\.?0+$/, ''));
  }, [unitCategory, unitReversed]);

  const swapUnits = useCallback(() => {
    setUnitReversed((prev) => !prev);
    const temp = unitFrom;
    setUnitFrom(unitTo);
    setUnitTo(temp);
  }, [unitFrom, unitTo]);

  const handleCategoryChange = useCallback((cat: UnitCategory) => {
    setUnitCategory(cat);
    setUnitFrom('');
    setUnitTo('');
    setUnitReversed(false);
  }, []);

  // ─── Derived ────────────────────────────────────────────────────────────

  const clearLabel = display === '0' && !operator ? 'AC' : 'C';
  const formattedDisplay = formatDisplayNumber(display);

  // Dynamic font size for the display
  const displayFontSize = formattedDisplay.length > 14
    ? 'text-2xl'
    : formattedDisplay.length > 10
    ? 'text-3xl'
    : formattedDisplay.length > 7
    ? 'text-4xl'
    : 'text-5xl';

  const fromLabel = unitReversed ? unitLabels[unitCategory][1] : unitLabels[unitCategory][0];
  const toLabel = unitReversed ? unitLabels[unitCategory][0] : unitLabels[unitCategory][1];

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      {/* Structured Data */}
      <WebApplicationJsonLd
        name="Professional Calculator"
        description="Free online professional calculator with scientific functions, calculation history, and unit converter. Supports keyboard input and high-precision arithmetic."
        url={PAGE_URL}
      />
      <FAQJsonLd questions={FAQ_ITEMS} />
      <BreadcrumbJsonLd items={BREADCRUMB_JSON_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={BREADCRUMB_ITEMS} />

        {/* Top Ad */}
        <div className="mt-4">
          <AdSense slot="header" variant="banner" />
        </div>

        {/* Main Grid: Calculator + Sidebar */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calculator Column */}
          <div className="lg:col-span-8">
            <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-lg">
              {/* ── Display Area ─────────────────────────────────────── */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-lg font-semibold text-text-primary">Professional Calculator</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowHistory((prev) => !prev)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        showHistory
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-dark-elevated hover:bg-dark-border text-text-secondary'
                      }`}
                      title="Toggle history"
                    >
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        History
                      </span>
                    </button>
                    <button
                      onClick={() => setScientificMode((prev) => !prev)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        scientificMode
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-dark-elevated hover:bg-dark-border text-text-secondary'
                      }`}
                    >
                      Scientific
                    </button>
                  </div>
                </div>

                {/* Display */}
                <div className="bg-dark-base rounded-xl p-5 min-h-[120px] flex flex-col justify-end relative">
                  {/* Copy button */}
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-3 right-3 p-1.5 rounded-md bg-dark-elevated/60 hover:bg-dark-elevated text-text-tertiary hover:text-text-secondary transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                  {/* Copied tooltip */}
                  {copied && (
                    <span className="absolute top-3 right-12 text-xs text-green-400 bg-dark-elevated px-2 py-1 rounded-md animate-fade-in">
                      Copied!
                    </span>
                  )}

                  {/* Sub-display (equation) */}
                  <div
                    className="text-sm text-text-tertiary text-right mb-1 truncate h-5"
                    style={{ fontFamily: "'Roboto Mono', monospace" }}
                  >
                    {equation || '\u00a0'}
                  </div>
                  {/* Main display */}
                  <div
                    ref={displayRef}
                    className={`${displayFontSize} font-semibold text-text-primary text-right truncate transition-all duration-150`}
                    style={{ fontFamily: "'Roboto Mono', monospace" }}
                  >
                    {formattedDisplay}
                  </div>
                </div>
              </div>

              {/* ── Scientific Panel ─────────────────────────────────── */}
              {scientificMode && (
                <div className="px-6 pb-2 animate-fade-in">
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'sin', fn: 'sin' },
                      { label: 'cos', fn: 'cos' },
                      { label: 'tan', fn: 'tan' },
                      { label: 'log', fn: 'log' },
                      { label: 'ln', fn: 'ln' },
                      { label: '\u221a', fn: 'sqrt' },
                      { label: 'x\u00b2', fn: 'pow' },
                      { label: '\u03c0', fn: 'pi' },
                      { label: 'e', fn: 'e' },
                    ].map((item) => (
                      <button
                        key={item.fn}
                        onClick={() => applyScientific(item.fn)}
                        className="h-11 rounded-xl text-sm font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all duration-150 active:scale-[0.95]"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Keypad ───────────────────────────────────────────── */}
              <div className="p-6 pt-3">
                <div className="grid grid-cols-4 gap-3">
                  {/* Row 1: AC, +/-, %, ÷ */}
                  <button
                    onClick={clearLabel === 'AC' ? clearAll : () => { setDisplay('0'); setWaitingForOperand(false); }}
                    className="h-16 rounded-xl text-xl font-medium bg-slate-500/30 hover:bg-slate-500/40 text-text-primary transition-all duration-150 active:scale-[0.95]"
                  >
                    {clearLabel}
                  </button>
                  <button
                    onClick={toggleSign}
                    className="h-16 rounded-xl text-xl font-medium bg-slate-500/30 hover:bg-slate-500/40 text-text-primary transition-all duration-150 active:scale-[0.95]"
                  >
                    +/&minus;
                  </button>
                  <button
                    onClick={handlePercentage}
                    className="h-16 rounded-xl text-xl font-medium bg-slate-500/30 hover:bg-slate-500/40 text-text-primary transition-all duration-150 active:scale-[0.95]"
                  >
                    %
                  </button>
                  <button
                    onClick={() => handleOperator('/')}
                    className={`h-16 rounded-xl text-xl font-medium transition-all duration-150 active:scale-[0.95] ${
                      operator === '/' && waitingForOperand
                        ? 'bg-white text-slate-600 dark:bg-white dark:text-slate-700'
                        : 'bg-slate-300 hover:bg-slate-400 text-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white'
                    }`}
                  >
                    &divide;
                  </button>

                  {/* Row 2: 7, 8, 9, × */}
                  {['7', '8', '9'].map((d) => (
                    <button
                      key={d}
                      onClick={() => inputDigit(d)}
                      className="h-16 rounded-xl text-xl font-medium bg-dark-elevated hover:bg-dark-border text-text-primary transition-all duration-150 active:scale-[0.95]"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    onClick={() => handleOperator('*')}
                    className={`h-16 rounded-xl text-xl font-medium transition-all duration-150 active:scale-[0.95] ${
                      operator === '*' && waitingForOperand
                        ? 'bg-white text-slate-600 dark:bg-white dark:text-slate-700'
                        : 'bg-slate-300 hover:bg-slate-400 text-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white'
                    }`}
                  >
                    &times;
                  </button>

                  {/* Row 3: 4, 5, 6, − */}
                  {['4', '5', '6'].map((d) => (
                    <button
                      key={d}
                      onClick={() => inputDigit(d)}
                      className="h-16 rounded-xl text-xl font-medium bg-dark-elevated hover:bg-dark-border text-text-primary transition-all duration-150 active:scale-[0.95]"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    onClick={() => handleOperator('-')}
                    className={`h-16 rounded-xl text-xl font-medium transition-all duration-150 active:scale-[0.95] ${
                      operator === '-' && waitingForOperand
                        ? 'bg-white text-slate-600 dark:bg-white dark:text-slate-700'
                        : 'bg-slate-300 hover:bg-slate-400 text-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white'
                    }`}
                  >
                    &minus;
                  </button>

                  {/* Row 4: 1, 2, 3, + */}
                  {['1', '2', '3'].map((d) => (
                    <button
                      key={d}
                      onClick={() => inputDigit(d)}
                      className="h-16 rounded-xl text-xl font-medium bg-dark-elevated hover:bg-dark-border text-text-primary transition-all duration-150 active:scale-[0.95]"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    onClick={() => handleOperator('+')}
                    className={`h-16 rounded-xl text-xl font-medium transition-all duration-150 active:scale-[0.95] ${
                      operator === '+' && waitingForOperand
                        ? 'bg-white text-slate-600 dark:bg-white dark:text-slate-700'
                        : 'bg-slate-300 hover:bg-slate-400 text-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white'
                    }`}
                  >
                    +
                  </button>

                  {/* Row 5: 0 (span 2), ., = */}
                  <button
                    onClick={() => inputDigit('0')}
                    className="h-16 rounded-xl text-xl font-medium bg-dark-elevated hover:bg-dark-border text-text-primary transition-all duration-150 active:scale-[0.95] col-span-2 text-left pl-7"
                  >
                    0
                  </button>
                  <button
                    onClick={inputDecimal}
                    className="h-16 rounded-xl text-xl font-medium bg-dark-elevated hover:bg-dark-border text-text-primary transition-all duration-150 active:scale-[0.95]"
                  >
                    .
                  </button>
                  <button
                    onClick={handleEquals}
                    className="h-16 rounded-xl text-xl font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-150 active:scale-[0.95]"
                  >
                    =
                  </button>
                </div>
              </div>

              {/* Keyboard shortcut hint */}
              <div className="px-6 pb-4 hidden sm:block">
                <p className="text-xs text-text-tertiary text-center">
                  Keyboard supported: 0-9, +, -, *, /, Enter, Escape, Backspace
                </p>
              </div>
            </div>

            {/* ── Unit Converter ────────────────────────────────────── */}
            <div className="mt-6 bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-dark-border">
                <h2 className="text-sm font-semibold text-text-primary mb-3">Unit Converter</h2>
                <div className="flex gap-2">
                  {(['length', 'weight', 'temperature'] as UnitCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                        unitCategory === cat
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-dark-elevated hover:bg-dark-border text-text-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {/* From */}
                  <div className="flex-1">
                    <label className="block text-xs text-text-tertiary mb-1.5">{fromLabel}</label>
                    <input
                      type="number"
                      value={unitFrom}
                      onChange={(e) => handleUnitFromChange(e.target.value)}
                      placeholder="0"
                      className="w-full h-12 px-4 rounded-xl bg-dark-base border border-dark-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                      style={{ fontFamily: "'Roboto Mono', monospace" }}
                    />
                  </div>
                  {/* Swap Button */}
                  <button
                    onClick={swapUnits}
                    className="mt-5 p-2.5 rounded-xl bg-dark-elevated hover:bg-dark-border text-text-secondary transition-colors active:scale-[0.95]"
                    title="Swap units"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                  {/* To */}
                  <div className="flex-1">
                    <label className="block text-xs text-text-tertiary mb-1.5">{toLabel}</label>
                    <input
                      type="number"
                      value={unitTo}
                      onChange={(e) => handleUnitToChange(e.target.value)}
                      placeholder="0"
                      className="w-full h-12 px-4 rounded-xl bg-dark-base border border-dark-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
                      style={{ fontFamily: "'Roboto Mono', monospace" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              {/* ── History Panel ─────────────────────────────────── */}
              {showHistory && (
                <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 border-b border-dark-border flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-text-primary">Calculation History</h2>
                    {history.length > 0 && (
                      <button
                        onClick={() => setHistory([])}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="max-h-[250px] lg:max-h-[400px] overflow-y-auto">
                    {history.length === 0 ? (
                      <div className="p-6 text-center text-text-tertiary text-sm">
                        No calculations yet.
                      </div>
                    ) : (
                      <ul className="divide-y divide-dark-border">
                        {history.map((entry, idx) => (
                          <li key={idx} className="px-4 py-3 hover:bg-dark-elevated/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-text-tertiary truncate" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                                  {entry.equation}
                                </p>
                                <p className="text-sm font-semibold text-text-primary" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                                  = {formatDisplayNumber(entry.result)}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setDisplay(entry.result);
                                  setWaitingForOperand(true);
                                  setEquation('');
                                  setPreviousValue(null);
                                  setOperator(null);
                                }}
                                className="ml-3 px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors flex-shrink-0"
                              >
                                Re-use
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
              <AdSense slot="sidebar" variant="sidebar" />
            </div>
          </div>
        </div>

        {/* In-content Ad */}
        <div className="mt-8">
          <AdSense slot="in-article" variant="in-feed" />
        </div>

        {/* ── SEO Content ──────────────────────────────────────────── */}
        <article className="mt-12 max-w-4xl mx-auto prose prose-slate dark:prose-invert prose-headings:text-text-primary prose-p:text-text-secondary prose-li:text-text-secondary">
          <h2>How to Use This Professional Calculator</h2>
          <p>
            This professional calculator is designed to provide a seamless calculation experience whether
            you are working on simple everyday arithmetic or more advanced mathematical operations. The
            intuitive layout follows the familiar four-column grid used by desktop and mobile calculators
            worldwide, ensuring you can get started immediately without any learning curve. Simply click
            or tap the number and operator buttons to build your expression, then press the equals button
            to see the result.
          </p>
          <p>
            For power users, full keyboard support is built in. Use the number keys (0 through 9) along
            with the standard arithmetic operators (+, -, *, /) to input calculations quickly. Press
            Enter or the equals key to evaluate, Escape to clear, and Backspace to delete the last digit.
            This makes the calculator just as efficient as a native desktop application, letting you keep
            your hands on the keyboard for rapid data entry.
          </p>
          <p>
            The Scientific mode unlocks trigonometric functions (sine, cosine, tangent), logarithms (base-10
            log and natural log), square root, squaring, and mathematical constants pi and e. Toggle it on
            with a single click to reveal the expanded function panel. Each scientific function applies to
            the current display value and shows the applied operation in the equation sub-display so you
            always know exactly what was computed.
          </p>
          <p>
            The History panel keeps a running log of your most recent 20 calculations, displaying each
            equation alongside its result. This is invaluable when working through multi-step problems or
            when you need to reference a previous answer. Click the Re-use button on any history entry to
            instantly load that result back into the calculator display, saving time and reducing errors
            from manual re-entry.
          </p>

          <h2>The Importance of Precision in Mathematical Tools</h2>
          <p>
            Precision matters in every calculation, whether you are balancing a household budget, engineering
            a structural component, or analyzing scientific data. Modern digital calculators use IEEE 754
            double-precision floating-point representation, which supports approximately 15 to 17 significant
            decimal digits. This level of precision handles virtually all practical computation needs, from
            simple addition to complex scientific formulas involving very large or very small numbers.
          </p>
          <p>
            However, floating-point arithmetic is not without its quirks. The classic example is that 0.1 + 0.2
            evaluates to 0.30000000000000004 in raw binary floating-point representation rather than exactly 0.3.
            This calculator applies intelligent rounding to mitigate these display artifacts, ensuring the
            results you see are clean and human-readable. Behind the scenes, every intermediate calculation
            is carried out at full machine precision before being formatted for display.
          </p>
          <p>
            Reliable calculators are essential tools in education, finance, engineering, and science. A
            miscalculation in a loan amortization schedule, a structural load analysis, or a chemical dosage
            computation can have serious real-world consequences. By providing a transparent, well-tested
            calculation engine with clear equation history, this tool helps users verify their work and build
            confidence in their results.
          </p>

          <h2>Common Unit Conversions: Metric vs Imperial</h2>
          <p>
            The metric and imperial measurement systems are used across the globe, often creating confusion when
            converting between them. The United States primarily uses the imperial system for everyday
            measurements, while most other countries use the metric system. Common conversions such as miles to
            kilometers (1 mile equals approximately 1.609 km), pounds to kilograms (1 pound equals approximately
            0.454 kg), and Fahrenheit to Celsius arise frequently in travel, commerce, cooking, and science.
          </p>
          <p>
            The built-in unit converter above provides instant, real-time conversions across three essential
            categories: length, weight, and temperature. Simply select a category, type a value in either field,
            and see the converted result update live. The swap button lets you quickly reverse the conversion
            direction. Whether you are planning an international trip, following a recipe from another country,
            or working on a cross-border project, having a reliable unit converter alongside your calculator
            eliminates the need to search for separate conversion tools.
          </p>
          <p>
            Temperature conversion deserves special mention because it uses a non-linear formula. While length and
            weight conversions involve simple multiplication, converting between Fahrenheit and Celsius requires
            subtracting 32 and then multiplying by 5/9 (or the reverse). This calculator handles the math
            correctly in both directions, so you can convert body temperatures, weather readings, or cooking
            temperatures with complete accuracy.
          </p>

          {/* FAQ Section */}
          <h2>Frequently Asked Questions</h2>
          {FAQ_ITEMS.map((faq, idx) => (
            <div key={idx}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </article>
      </div>

      {/* Fade-in animation style */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
