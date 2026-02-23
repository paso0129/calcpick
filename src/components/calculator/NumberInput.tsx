'use client';

import { useCallback } from 'react';
import { formatNumber } from '@/lib/format';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  showSlider?: boolean;
  helpText?: string;
}

export default function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 1000000,
  step = 1,
  prefix,
  suffix,
  showSlider = false,
  helpText,
}: NumberInputProps) {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else if (raw === '' || raw === '.') {
      onChange(0);
    }
  }, [onChange, min, max]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  }, [onChange]);

  const displayValue = suffix === '%'
    ? value.toString()
    : formatNumber(value, step < 1 ? 2 : 0);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-text-secondary mb-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleInputChange}
          className={`w-full bg-dark-elevated border border-dark-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors ${
            prefix ? 'pl-7' : ''
          } ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {showSlider && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full mt-2"
        />
      )}
      {helpText && (
        <p className="text-text-tertiary text-xs mt-1">{helpText}</p>
      )}
    </div>
  );
}
