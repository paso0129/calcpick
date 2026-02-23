import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Compound Interest Calculator',
    description: 'See how your investments grow over time with the power of compound interest.',
    icon: '📈',
  });
}
