import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Tip Calculator',
    description: 'Quickly calculate how much to tip and split the bill.',
    icon: '💰',
  });
}
