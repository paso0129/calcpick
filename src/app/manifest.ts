import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CalcPick - Free Financial Calculators',
    short_name: 'CalcPick',
    description: 'Free online financial calculators for mortgage, auto loans, compound interest, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
