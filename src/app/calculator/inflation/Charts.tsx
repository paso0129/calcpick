'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/format';

const tooltipStyle = {
  backgroundColor: 'rgb(15 23 42)',
  border: '1px solid rgb(51 65 85)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: 'rgb(241 245 249)',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
};

interface ValueRow {
  year: string;
  Value: number;
}

interface InflationChartProps {
  title: string;
  subtitle: string;
  chartData: ValueRow[];
  tickInterval: number;
}

export default function InflationChart({
  title,
  subtitle,
  chartData,
  tickInterval,
}: InflationChartProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{subtitle}</p>
      <div
        className="h-[380px]"
        role="img"
        aria-label="Line chart showing year-by-year inflation-adjusted value"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85)" opacity={0.5} />
            <XAxis
              dataKey="year"
              tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
              tickLine={{ stroke: 'rgb(71 85 105)' }}
              axisLine={{ stroke: 'rgb(71 85 105)' }}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
              tickLine={{ stroke: 'rgb(71 85 105)' }}
              axisLine={{ stroke: 'rgb(71 85 105)' }}
              tickFormatter={(value) => {
                const v = Number(value);
                return v >= 1000000
                  ? `$${(v / 1000000).toFixed(1)}M`
                  : v >= 1000
                    ? `$${(v / 1000).toFixed(0)}K`
                    : `$${v}`;
              }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [formatCurrency(Number(value)), 'Value']}
              labelStyle={{ color: 'rgb(148 163 184)', marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
