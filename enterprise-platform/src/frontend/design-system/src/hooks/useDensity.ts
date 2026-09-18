/**
 * useDensity — read user density preference from localStorage and expose it
 * across the app. Defaults to "default".
 *
 * Source: /design-system/README.md (Density Philosophy)
 */
import { useEffect, useState, useCallback } from 'react';
import type { Density } from '../tokens/spacing';

const STORAGE_KEY = 'cachesol:density';

const VALID: Density[] = ['comfortable', 'default', 'compact'];

function readInitial(): Density {
  if (typeof window === 'undefined') return 'default';
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return VALID.includes(raw as Density) ? (raw as Density) : 'default';
}

export function useDensity(): {
  density: Density;
  setDensity: (next: Density) => void;
} {
  const [density, setDensityState] = useState<Density>(readInitial);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  const setDensity = useCallback((next: Density) => {
    setDensityState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore quota / privacy errors */
    }
  }, []);

  return { density, setDensity };
}
