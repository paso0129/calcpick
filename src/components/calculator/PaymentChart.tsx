'use client';

import dynamic from 'next/dynamic';
import type { PaymentChartProps } from './PaymentChartImpl';

// recharts is heavy; load it lazily (charts sit below the fold) so it stays
// out of the initial finance-page bundle. Reserve height to avoid layout shift.
const PaymentChartImpl = dynamic(() => import('./PaymentChartImpl'), {
  ssr: false,
  loading: () => (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4 sm:p-6">
      <div className="h-7 w-44 bg-dark-elevated rounded mb-4" />
      <div className="h-[280px] rounded-lg bg-dark-elevated/40 animate-pulse" />
    </div>
  ),
});

export default function PaymentChart(props: PaymentChartProps) {
  return <PaymentChartImpl {...props} />;
}
