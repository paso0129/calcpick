import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE = 'Unit Converter - 100+ Units, 17 Categories';
const DESCRIPTION =
  'Free online unit converter for length, weight, volume, temperature, area, speed, time, energy, and 10 more categories. Instant conversions, 100+ units, no signup.';
const CANONICAL = `${SITE_URL}/calculator/unit-converter`;

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

export default function UnitConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
