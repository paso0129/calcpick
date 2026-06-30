import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Sales Tax Calculator by State';
const DESCRIPTION =
  'Free US sales tax calculator. Add tax to a pre-tax price or reverse-calculate the pre-tax amount from a total. Includes average rates for all 50 states.';
const CANONICAL = `${SITE_URL}/calculator/sales-tax`;

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

export default function SalesTaxCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
