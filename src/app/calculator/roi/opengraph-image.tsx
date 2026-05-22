import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'ROI Calculator',
    description: 'Calculate total return, net profit, and annualized CAGR for any investment.',
    icon: '💰',
  });
}
