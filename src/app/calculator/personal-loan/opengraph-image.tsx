import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Personal Loan Calculator',
    description: 'Calculate monthly payments and total interest for personal loans of any size.',
    icon: '💳',
  });
}
