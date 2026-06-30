import { MetadataRoute } from 'next';
import { SITE_URL, CALCULATORS } from '@/lib/constants';
import { UNIT_CATEGORIES } from '@/lib/units';

// Stable lastmod date — bump intentionally when content meaningfully changes.
// Using `new Date()` on every build restamps every URL and makes Google distrust lastmod.
const LAST_MODIFIED = new Date('2026-06-30');

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorPages = CALCULATORS.map((calc) => ({
    url: `${SITE_URL}/calculator/${calc.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const unitConverterPages = UNIT_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/calculator/unit-converter/${cat.id}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...calculatorPages,
    ...unitConverterPages,
    {
      url: `${SITE_URL}/about`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
