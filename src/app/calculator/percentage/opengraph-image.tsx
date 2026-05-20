import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Percentage Calculator',
    description: 'Find percentages, percentage of a total, and percentage change.',
    icon: '💯',
  });
}
