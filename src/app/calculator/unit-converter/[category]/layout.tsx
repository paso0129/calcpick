import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import { UNIT_SEO } from '@/lib/unit-seo';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  const { category } = await params;
  const seo = UNIT_SEO[category];

  if (!seo) {
    return {
      title: 'Unit Converter | CalcPick',
    };
  }

  const canonical = `${SITE_URL}/calculator/unit-converter/${category}`;

  return {
    title: seo.pageTitle,
    description: seo.description,
    alternates: { canonical },
    openGraph: {
      title: seo.pageTitle,
      description: seo.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.pageTitle,
      description: seo.description,
    },
  };
}

export default function UnitCategoryLayout({ children }: CategoryLayoutProps) {
  return children;
}
