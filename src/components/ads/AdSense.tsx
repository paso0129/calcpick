'use client';

import { useEffect, useRef, useState } from 'react';
import { getConsent } from './CookieConsent';

interface AdSenseProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  variant?: 'banner' | 'sidebar' | 'in-feed';
  style?: React.CSSProperties;
}

const variantStyles: Record<string, string> = {
  banner: 'h-[90px] my-6',
  sidebar: 'h-[250px] mb-6',
  'in-feed': 'h-[90px] my-4',
};

export default function AdSense({
  slot = 'header',
  format = 'auto',
  responsive = true,
  variant = 'banner',
  style = {},
}: AdSenseProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  const slotId = getSlotId(slot);

  useEffect(() => {
    const checkConsent = () => {
      const consent = getConsent();
      setHasConsent(consent?.advertising === true);
    };
    checkConsent();
    window.addEventListener('consent-change', checkConsent);
    return () => window.removeEventListener('consent-change', checkConsent);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && clientId && slotId && hasConsent && !pushed.current) {
      try {
        const adEl = adRef.current;
        if (adEl && !adEl.getAttribute('data-adsbygoogle-status')) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((window as unknown as Record<string, any>).adsbygoogle = (window as unknown as Record<string, any>).adsbygoogle || []).push({});
          pushed.current = true;
        }
        setTimeout(() => {
          const adEl = adRef.current;
          if (adEl) {
            setAdLoaded(adEl.getAttribute('data-adsbygoogle-status') === 'done');
          }
        }, 3000);
      } catch {
        // Silently ignore
      }
    }
  }, [clientId, slotId, hasConsent]);

  if (!clientId || !slotId || !hasConsent) return null;

  return (
    <div className="adsense-container text-center" style={style}>
      <p className="text-text-tertiary text-[10px] uppercase tracking-wider text-center mb-1">Advertisement</p>
      <div className="relative">
        {!adLoaded && (
          <div className={`bg-dark-surface border border-dark-border rounded-lg flex items-center justify-center ${variantStyles[variant]}`}>
            <p className="text-text-tertiary text-xs">Ad</p>
          </div>
        )}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}

function getSlotId(position: string): string | null {
  const slots: Record<string, string | undefined> = {
    header: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER,
    'in-article': process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE,
    footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  };
  return slots[position] || null;
}
