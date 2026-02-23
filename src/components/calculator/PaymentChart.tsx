'use client';

import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/format';

interface PaymentChartProps {
  principal: number;
  totalInterest: number;
  schedule?: { month: number; balance: number; principal: number; interest: number }[];
  type?: 'pie' | 'area' | 'both';
}

const COLORS = ['#60a5fa', '#fb923c'];

const tooltipStyle = {
  backgroundColor: 'rgb(15 23 42)',
  border: '1px solid rgb(51 65 85)',
  borderRadius: '10px',
  padding: '10px 14px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
};

const tooltipLabelStyle = {
  color: 'rgb(148 163 184)',
  fontSize: '12px',
  marginBottom: '4px',
};

const tooltipItemStyle = {
  color: 'rgb(241 245 249)',
  fontSize: '14px',
  fontWeight: 600,
};

export default function PaymentChart({
  principal,
  totalInterest,
  schedule,
  type = 'both',
}: PaymentChartProps) {
  const pieData = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest },
  ];

  const yearlyBalance = schedule?.filter((_, i) => (i + 1) % 12 === 0).map(row => ({
    year: Math.ceil(row.month / 12),
    balance: row.balance,
  }));

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Breakdown</h3>

      <div className={`grid ${type === 'both' && yearlyBalance?.length ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {(type === 'pie' || type === 'both') && (
          <div>
            <p className="text-sm text-text-secondary mb-3 text-center">Principal vs Interest</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value))]}
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  separator=": "
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span style={{ color: 'rgb(203 213 225)', fontSize: '13px' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {(type === 'area' || type === 'both') && yearlyBalance && yearlyBalance.length > 0 && (
          <div>
            <p className="text-sm text-text-secondary mb-3 text-center">Remaining Balance</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={yearlyBalance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85)" opacity={0.5} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgb(51 65 85)' }}
                  label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: 'rgb(148 163 184)' }}
                />
                <YAxis
                  tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgb(51 65 85)' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Balance']}
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#60a5fa"
                  fill="#60a5fa"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  name="Balance"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
