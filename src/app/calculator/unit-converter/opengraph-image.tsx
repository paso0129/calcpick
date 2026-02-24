import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Unit Converter',
    description: 'Convert 60+ units across 10 categories: length, weight, temperature, area, volume, speed, time, digital storage, pressure, and energy.',
    icon: '🔄',
  });
}
