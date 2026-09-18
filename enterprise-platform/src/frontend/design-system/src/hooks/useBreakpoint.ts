/**
 * useBreakpoint — observes the current breakpoint by matching window.innerWidth
 * against the design system breakpoints.
 *
 * Source: /design-system/README.md (Breakpoints)
 *
 * Usage:
 *   const bp = useBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 */
import { useEffect, useState } from 'react';
import { breakpoints, type Breakpoint } from '../tokens/breakpoints';

function currentBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl)    return 'xl';
  if (width >= breakpoints.lg)    return 'lg';
  if (width >= breakpoints.md)    return 'md';
  if (width >= breakpoints.sm)    return 'sm';
  return 'xs';
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window === 'undefined'
      ? 'lg'
      : currentBreakpoint(window.innerWidth),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setBp(currentBreakpoint(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return bp;
}

/**
 * Predicate: true when current breakpoint is at or above the threshold.
 */
export function useBreakpointAtLeast(threshold: Breakpoint): boolean {
  const bp = useBreakpoint();
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  return order.indexOf(bp) >= order.indexOf(threshold);
}
