import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'CalcPick',
    description: 'Free, accurate financial calculators to help you make smarter money decisions.',
  });
}
