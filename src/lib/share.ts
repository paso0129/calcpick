import { SITE_URL } from '@/lib/constants';

export function buildShareUrl(pathname: string, params: Record<string, string | number>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== null && value !== undefined) {
      sp.set(key, String(value));
    }
  }
  return `${SITE_URL}${pathname}?${sp.toString()}`;
}

export function getParamNumber(params: URLSearchParams, key: string): number | null {
  const v = params.get(key);
  if (v === null) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

export function getParamString(params: URLSearchParams, key: string): string | null {
  return params.get(key);
}

export function getParamJson<T>(params: URLSearchParams, key: string): T | null {
  const v = params.get(key);
  if (v === null) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}
