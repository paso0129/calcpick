import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Discount Calculator',
    description: 'Calculate sale price, percent off, and total savings.',
    icon: '🏷️',
  });
}
