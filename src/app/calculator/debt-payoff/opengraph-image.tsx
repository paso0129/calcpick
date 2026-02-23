import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Debt Payoff Calculator',
    description: 'Compare snowball vs avalanche strategies to find the fastest way to become debt-free.',
    icon: '🎯',
  });
}
