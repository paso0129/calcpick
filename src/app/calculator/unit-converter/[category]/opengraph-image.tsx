import { generateOGImage, size, contentType } from '@/lib/og-image';
import { UNIT_SEO } from '@/lib/unit-seo';
import { UNIT_CATEGORIES } from '@/lib/units';

export { size, contentType };
export const runtime = 'edge';

export function generateStaticParams() {
  return Object.keys(UNIT_SEO).map((category) => ({ category }));
}

export default function Image({ params }: { params: { category: string } }) {
  const seo = UNIT_SEO[params.category];
  const cat = UNIT_CATEGORIES.find((c) => c.id === params.category);

  return generateOGImage({
    title: seo?.h1 ?? 'Unit Converter',
    description: seo?.description ?? 'Convert between measurement units',
    icon: cat?.icon ?? '🔄',
  });
}
