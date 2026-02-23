import { generateOGImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
  return generateOGImage({
    title: 'Student Loan Calculator',
    description: 'Compare repayment plans and calculate your monthly student loan payments.',
    icon: '🎓',
  });
}
