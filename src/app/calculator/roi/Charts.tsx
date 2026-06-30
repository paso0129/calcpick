'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
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

interface GrowthRow {
  year: string;
  Value: number;
  'Cumulative Return': number;
}

interface BarRow {
  name: string;
  Initial: number;
  'Net Profit': number;
  Loss: number;
}

interface ROIChartsProps {
  chartData: GrowthRow[];
  barData: BarRow[];
  isProfit: boolean;
  initialInvestment: number;
  years: number;
}

export default function ROICharts({
  chartData,
  barData,
  isProfit,
  initialInvestment,
  years,
}: ROIChartsProps) {
  return (
    <div className="mt-8 space-y-8">
      {/* Area Chart - Investment Growth */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Investment Value Over Time
        </h3>
        <div
          className="h-[380px]"
          role="img"
          aria-label="Area chart showing investment value growth year by year"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="roiValueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isProfit ? '#22c55e' : '#ef4444'}
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor={isProfit ? '#22c55e' : '#ef4444'}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85)" opacity={0.5} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
                tickLine={{ stroke: 'rgb(71 85 105)' }}
                axisLine={{ stroke: 'rgb(71 85 105)' }}
                interval={Math.max(0, Math.floor(years / 10) - 1)}
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
              <ReferenceLine
                y={initialInvestment}
                stroke="rgb(100 116 139)"
                strokeDasharray="4 4"
                label={{
                  value: 'Initial',
                  fill: 'rgb(100 116 139)',
                  fontSize: 11,
                  position: 'insideTopRight',
                }}
              />
              <Area
                type="monotone"
                dataKey="Value"
                stroke={isProfit ? '#22c55e' : '#ef4444'}
                strokeWidth={2}
                fill="url(#roiValueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart - Profit / Loss Breakdown */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Return Breakdown
        </h3>
        <div
          className="h-[280px]"
          role="img"
          aria-label="Bar chart comparing initial investment and net profit or loss"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgb(51 65 85)"
                opacity={0.5}
                horizontal={false}
              />
              <XAxis
                type="number"
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
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => formatCurrency(Number(value))}
                labelStyle={{ color: 'rgb(148 163 184)', marginBottom: 4 }}
              />
              <Bar dataKey="Initial" fill="#3b82f6" radius={[0, 4, 4, 0]} stackId="a" />
              <Bar
                dataKey="Net Profit"
                fill="#22c55e"
                radius={[0, 4, 4, 0]}
                stackId="a"
              />
              <Bar dataKey="Loss" fill="#ef4444" radius={[0, 4, 4, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
