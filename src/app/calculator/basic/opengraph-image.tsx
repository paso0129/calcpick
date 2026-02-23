import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Professional Calculator',
    description: 'High-precision arithmetic calculator with scientific functions, history log, and unit converter.',
    icon: '🔢',
  });
}
