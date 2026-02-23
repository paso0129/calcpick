'use client';

import { useState } from 'react';
import { AmortizationRow } from '@/types/calculator';
import { formatCurrency } from '@/lib/format';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  showYearly?: boolean;
}

export default function AmortizationTable({ schedule, showYearly = false }: AmortizationTableProps) {
  const [view, setView] = useState<'monthly' | 'yearly'>(showYearly ? 'yearly' : 'monthly');
  const [expanded, setExpanded] = useState(false);

  const yearlyData = schedule.reduce<AmortizationRow[]>((acc, row) => {
    const yearIndex = Math.ceil(row.month / 12) - 1;
    if (!acc[yearIndex]) {
      acc[yearIndex] = { month: yearIndex + 1, payment: 0, principal: 0, interest: 0, balance: 0 };
    }
    acc[yearIndex].payment += row.payment;
    acc[yearIndex].principal += row.principal;
    acc[yearIndex].interest += row.interest;
    acc[yearIndex].balance = row.balance;
    return acc;
  }, []);

  const data = view === 'yearly' ? yearlyData : schedule;
  const displayData = expanded ? data : data.slice(0, view === 'yearly' ? 10 : 12);

  const handleDownloadCSV = () => {
    const header = view === 'yearly'
      ? 'Year,Payment,Principal,Interest,Balance'
      : 'Month,Payment,Principal,Interest,Balance';
    const rows = data.map(row =>
      `${row.month},${row.payment.toFixed(2)},${row.principal.toFixed(2)},${row.interest.toFixed(2)},${row.balance.toFixed(2)}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amortization-schedule-${view}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-dark-border">
        <h3 className="text-lg font-semibold text-text-primary">Amortization Schedule</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-dark-elevated rounded-lg p-0.5">
            <button
              onClick={() => setView('monthly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === 'monthly' ? 'bg-accent-500 text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setView('yearly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === 'yearly' ? 'bg-accent-500 text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Yearly
            </button>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-dark-border rounded-lg hover:bg-dark-elevated transition-colors"
          >
            CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left text-text-tertiary font-medium px-4 py-3">
                {view === 'yearly' ? 'Year' : 'Month'}
              </th>
              <th className="text-right text-text-tertiary font-medium px-4 py-3">Payment</th>
              <th className="text-right text-text-tertiary font-medium px-4 py-3">Principal</th>
              <th className="text-right text-text-tertiary font-medium px-4 py-3">Interest</th>
              <th className="text-right text-text-tertiary font-medium px-4 py-3">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, index) => (
              <tr key={index} className="border-b border-dark-border/50 hover:bg-dark-elevated/50">
                <td className="px-4 py-2.5 text-text-primary">{row.month}</td>
                <td className="px-4 py-2.5 text-right text-text-secondary">{formatCurrency(row.payment)}</td>
                <td className="px-4 py-2.5 text-right text-success-500">{formatCurrency(row.principal)}</td>
                <td className="px-4 py-2.5 text-right text-red-400">{formatCurrency(row.interest)}</td>
                <td className="px-4 py-2.5 text-right text-text-primary font-medium">{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > displayData.length && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 text-sm text-accent-500 hover:text-accent-600 font-medium transition-colors border-t border-dark-border"
        >
          {expanded ? 'Show Less' : `Show All ${data.length} ${view === 'yearly' ? 'Years' : 'Months'}`}
        </button>
      )}
    </div>
  );
}
