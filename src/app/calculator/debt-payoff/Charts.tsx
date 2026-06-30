'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/format';

interface BalanceRow {
  month: number;
  avalanche: number;
  snowball: number;
}

interface DebtPayoffChartProps {
  chartData: BalanceRow[];
}

export default function DebtPayoffChart({ chartData }: DebtPayoffChartProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Remaining Balance Over Time
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAvalanche" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSnowball" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85)" opacity={0.5} />
            <XAxis
              dataKey="month"
              stroke="rgb(51 65 85)"
              tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
              label={{
                value: 'Month',
                position: 'insideBottomRight',
                offset: -5,
                fill: 'rgb(148 163 184)',
                fontSize: 12,
              }}
            />
            <YAxis
              stroke="rgb(51 65 85)"
              tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
              tickFormatter={(value) =>
                `$${(Number(value) / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(15 23 42)',
                border: '1px solid rgb(51 65 85)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#f9fafb',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
              }}
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                name === 'avalanche' ? 'Avalanche' : 'Snowball',
              ]}
              labelFormatter={(label) => `Month ${label}`}
            />
            <Legend
              formatter={(value: string) =>
                value === 'avalanche' ? 'Avalanche' : 'Snowball'
              }
            />
            <Area
              type="monotone"
              dataKey="avalanche"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAvalanche)"
            />
            <Area
              type="monotone"
              dataKey="snowball"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSnowball)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
