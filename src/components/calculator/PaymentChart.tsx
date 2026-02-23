'use client';

import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/format';

interface PaymentChartProps {
  principal: number;
  totalInterest: number;
  schedule?: { month: number; balance: number; principal: number; interest: number }[];
  type?: 'pie' | 'area' | 'both';
}

const COLORS = ['#3b82f6', '#f97316'];

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
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Breakdown</h3>

      <div className={`grid ${type === 'both' && yearlyBalance?.length ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {(type === 'pie' || type === 'both') && (
          <div>
            <p className="text-sm text-text-secondary mb-3 text-center">Principal vs Interest</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: 'rgb(30 41 59)',
                    border: '1px solid rgb(71 85 105)',
                    borderRadius: '8px',
                    color: 'rgb(241 245 249)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {(type === 'area' || type === 'both') && yearlyBalance && yearlyBalance.length > 0 && (
          <div>
            <p className="text-sm text-text-secondary mb-3 text-center">Remaining Balance</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={yearlyBalance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(71 85 105)" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgb(71 85 105)' }}
                  label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: 'rgb(148 163 184)' }}
                />
                <YAxis
                  tick={{ fill: 'rgb(148 163 184)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgb(71 85 105)' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: 'rgb(30 41 59)',
                    border: '1px solid rgb(71 85 105)',
                    borderRadius: '8px',
                    color: 'rgb(241 245 249)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
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
