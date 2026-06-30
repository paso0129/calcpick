import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Discount Calculator - Sale Price & % Off';
const DESCRIPTION =
  'Free discount calculator. Find the final price after a percentage off, calculate the amount you save, and add sales tax. Instant results for any sale, no signup.';
const CANONICAL = `${SITE_URL}/calculator/discount`;

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

export default function DiscountCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
