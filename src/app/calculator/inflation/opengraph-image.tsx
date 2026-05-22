import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Inflation Calculator',
    description: 'Convert past dollars to today\'s value using US CPI data, or project future purchasing power.',
    icon: '📉',
  });
}
