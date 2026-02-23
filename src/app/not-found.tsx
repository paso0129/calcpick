import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-7xl font-bold text-accent-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-text-primary mb-4">
        Page Not Found
      </h2>
      <p className="text-text-secondary max-w-md mx-auto mb-8">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 border border-dark-border text-text-secondary hover:text-accent-500 hover:border-accent-500 font-medium px-6 py-3 rounded-lg transition-colors"
        >
          About Us
        </Link>
      </div>
    </div>
  );
}
