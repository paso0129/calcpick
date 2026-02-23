import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Mortgage Calculator',
    description: 'Calculate your monthly mortgage payment, total interest, and view a detailed amortization schedule.',
    icon: '🏠',
  });
}
