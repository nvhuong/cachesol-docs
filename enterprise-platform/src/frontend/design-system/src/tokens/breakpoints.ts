/**
 * Breakpoints.
 * Source of truth: /design-system/README.md (Responsive Philosophy)
 */
export const breakpoints = {
  xs:  0,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
