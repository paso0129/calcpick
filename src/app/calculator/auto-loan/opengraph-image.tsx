import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Car Payment Calculator',
    description: 'Estimate your monthly car payment with trade-in value, down payment, and auto loan terms.',
    icon: '🚗',
  });
}
