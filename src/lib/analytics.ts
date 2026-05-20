/**
 * CalcPick Analytics helpers.
 *
 * Google Analytics GA4 (G-4M9GBNY406) wrappers with Consent Mode v2 in mind.
 * All functions are SSR-safe and silently no-op when:
 *   - running on the server (typeof window === 'undefined'), or
 *   - gtag has not been loaded yet, or
 *   - user has not granted analytics consent (Consent Mode blocks dispatch
 *     downstream — these functions still call gtag, GA respects consent state).
 *
 * Calculator pages can call these to instrument key user actions.
 * NOTE: 새 calculator 페이지에 trackCalculatorUse 삽입은 이 작업의 범위 외 —
 *       라이브러리만 노출하고, 호출은 후속 작업에서 진행.
 */

type GtagFn = (...args: unknown[]) => void;

interface WindowWithGtag {
  gtag?: GtagFn;
}

function getGtag(): GtagFn | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as WindowWithGtag;
  return typeof w.gtag === 'function' ? w.gtag : null;
}

/**
 * Track a calculator usage event.
 * Fires `calculator_use` GA4 event with the calculator slug.
 *
 * @param slug — Calculator identifier (matches CALCULATORS[].slug in src/lib/constants.ts).
 */
export function trackCalculatorUse(slug: string): void {
  const gtag = getGtag();
  if (!gtag) return;
  gtag('event', 'calculator_use', {
    calculator_slug: slug,
  });
}

/**
 * Track a share action.
 * Fires `share` GA4 event with method (e.g. 'clipboard', 'twitter') and slug.
 *
 * @param method — Share channel identifier (clipboard | twitter | facebook | ...).
 * @param slug — Calculator identifier being shared.
 */
export function trackShare(method: string, slug: string): void {
  const gtag = getGtag();
  if (!gtag) return;
  gtag('event', 'share', {
    method,
    calculator_slug: slug,
  });
}
