import { MetadataRoute } from 'next';
import { SITE_URL, CALCULATORS } from '@/lib/constants';
import { UNIT_CATEGORIES } from '@/lib/units';

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorPages = CALCULATORS.map((calc) => ({
    url: `${SITE_URL}/calculator/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const unitConverterPages = UNIT_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/calculator/unit-converter/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...calculatorPages,
    ...unitConverterPages,
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
