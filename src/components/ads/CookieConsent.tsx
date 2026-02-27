'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
}

const CONSENT_KEY = 'cookie-consent';
const CONSENT_TIMESTAMP_KEY = 'cookie-consent-ts';

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  advertising: false,
};

function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function loadAdSense(adsenseId: string) {
  if (document.querySelector(`script[src*="adsbygoogle.js"]`)) return;
  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

function dispatchConsentChange(consent: ConsentState) {
  window.dispatchEvent(new CustomEvent('consent-change', { detail: consent }));
}

export function getConsent(): ConsentState | null {
  return getStoredConsent();
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-7151553772512263';

  const applyConsent = useCallback((c: ConsentState) => {
    if (c.advertising && adsenseId) {
      loadAdSense(adsenseId);
    }
    dispatchConsentChange(c);
  }, [adsenseId]);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
      applyConsent(stored);
    } else {
      setVisible(true);
    }

    const handleOpen = () => {
      const stored = getStoredConsent();
      if (stored) setConsent(stored);
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener('open-cookie-settings', handleOpen);
    return () => window.removeEventListener('open-cookie-settings', handleOpen);
  }, [applyConsent]);

  const saveConsent = (c: ConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
    setConsent(c);
    applyConsent(c);
    setVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true, advertising: true });
  const rejectOptional = () => saveConsent({ necessary: true, analytics: false, advertising: false });
  const saveCustom = () => saveConsent({ ...consent, necessary: true });

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      <div className="bg-dark-surface border-t border-dark-border shadow-2xl">
        <div className="container mx-auto px-4 py-5 max-w-5xl">
          {!showSettings ? (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-text-primary font-semibold text-base mb-1">Privacy Notice</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  We use cookies to enhance your experience and serve personalized ads.{' '}
                  <Link href="/privacy" className="text-accent-500 hover:text-accent-600 underline">Privacy Policy</Link>
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => setShowSettings(true)} className="px-4 py-2.5 text-sm font-medium text-text-secondary border border-dark-border rounded-lg hover:bg-dark-elevated transition-colors">
                  Manage Settings
                </button>
                <button onClick={rejectOptional} className="px-4 py-2.5 text-sm font-medium text-text-secondary border border-dark-border rounded-lg hover:bg-dark-elevated transition-colors">
                  Reject All
                </button>
                <button onClick={acceptAll} className="px-5 py-2.5 text-sm font-bold bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-primary font-semibold text-base">Cookie Preferences</h3>
                <button onClick={() => setShowSettings(false)} className="text-text-tertiary hover:text-text-primary transition-colors" aria-label="Close settings">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-5">
                <div className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
                  <div>
                    <p className="text-text-primary text-sm font-medium">Strictly Necessary</p>
                    <p className="text-text-tertiary text-xs mt-0.5">Essential for the website to function.</p>
                  </div>
                  <div className="w-11 h-6 bg-accent-500 rounded-full relative cursor-not-allowed opacity-60">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
                  <div>
                    <p className="text-text-primary text-sm font-medium">Advertising</p>
                    <p className="text-text-tertiary text-xs mt-0.5">Google AdSense delivers personalized ads.</p>
                  </div>
                  <button
                    onClick={() => setConsent(prev => ({ ...prev, advertising: !prev.advertising }))}
                    className={`w-11 h-6 rounded-full relative transition-colors ${consent.advertising ? 'bg-accent-500' : 'bg-dark-border'}`}
                    role="switch"
                    aria-checked={consent.advertising}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${consent.advertising ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={rejectOptional} className="px-4 py-2.5 text-sm font-medium text-text-secondary border border-dark-border rounded-lg hover:bg-dark-elevated transition-colors">
                  Reject All
                </button>
                <button onClick={saveCustom} className="px-5 py-2.5 text-sm font-bold bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
