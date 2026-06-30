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
  BarChart,
  Bar,
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
  Contributions: number;
  Interest: number;
  Balance: number;
}

interface InterestRow {
  year: string;
  'Interest Earned': number;
}

interface CompoundInterestChartsProps {
  chartData: GrowthRow[];
  interestPerYearData: InterestRow[];
  years: number;
}

export default function CompoundInterestCharts({
  chartData,
  interestPerYearData,
  years,
}: CompoundInterestChartsProps) {
  return (
    <div className="mt-8 space-y-8">
      {/* Stacked Area Chart - Growth Over Time */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Investment Growth Over Time
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                formatter={(value) => formatCurrency(Number(value))}
                labelStyle={{ color: 'rgb(148 163 184)', marginBottom: 4 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                iconType="rect"
              />
              <Area
                type="monotone"
                dataKey="Contributions"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="Interest"
                stackId="1"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart - Interest Earned Per Year */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Interest Earned Per Year
        </h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={interestPerYearData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
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
                formatter={(value) => formatCurrency(Number(value))}
                labelStyle={{ color: 'rgb(148 163 184)', marginBottom: 4 }}
              />
              <Bar dataKey="Interest Earned" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
