import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Sales Tax Calculator',
    description: 'Add tax to any price or remove tax from a total. Includes rates for all 50 US states.',
    icon: '🧾',
  });
}
