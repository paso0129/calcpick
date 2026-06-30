import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'ROI Calculator - Return on Investment & CAGR';
const DESCRIPTION =
  'Free ROI calculator. Calculate total return, net profit, and annualized return (CAGR) for any investment. Visualize growth year by year.';
const CANONICAL = `${SITE_URL}/calculator/roi`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ROILayout({ children }: { children: React.ReactNode }) {
  return children;
}
