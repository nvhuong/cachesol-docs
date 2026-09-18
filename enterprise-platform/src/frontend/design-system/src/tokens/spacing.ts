/**
 * Spacing scale (4px base).
 * Source of truth: /design-system/tokens/spacing.md
 *
 * Use spacing() helper in component code:
 *   padding: spacing(4)  → '16px'
 *   padding: spacing(1.5) → '6px'
 */
export const spacing = {
  0:    0,
  '0.5': 2,
  1:    4,
  '1.5': 6,
  2:    8,
  3:    12,
  4:    16,
  5:    20,
  6:    24,
  8:    32,
  10:   40,
  12:   48,
  16:   64,
  20:   80,
  24:   96,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Convert a token name to its CSS value (string with px).
 */
export function spacingValue(token: SpacingToken): string {
  return `${spacing[token]}px`;
}

/**
 * Border radius.
 * Source of truth: /design-system/tokens/radius.md
 */
export const radius = {
  none: 0,
  xs:   2,
  sm:   4,
  md:   6,
  lg:   8,
  xl:   12,
  '2xl': 16,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;

export function radiusValue(token: RadiusToken): string {
  return token === 'full' ? '9999px' : `${radius[token]}px`;
}

/**
 * Border width.
 */
export const borderWidth = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
} as const;

/**
 * Control sizes (buttons, inputs).
 */
export const controlSize = {
  sm: 32,
  md: 40,
  lg: 48,
} as const;

/**
 * Icon sizes.
 */
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

/**
 * Avatar sizes.
 */
export const avatarSize = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64,
} as const;

/**
 * Modal max-widths.
 */
export const modalSize = {
  sm: 400,
  md: 560,
  lg: 720,
  xl: 960,
} as const;

/**
 * Density modes for tables and dense layouts.
 */
export const density = {
  comfortable: {
    rowHeight: 56,
    cellPaddingX: 16,
    cellPaddingY: 12,
  },
  default: {
    rowHeight: 48,
    cellPaddingX: 16,
    cellPaddingY: 8,
  },
  compact: {
    rowHeight: 36,
    cellPaddingX: 12,
    cellPaddingY: 4,
  },
} as const;

export type Density = keyof typeof density;

/**
 * Page horizontal padding by breakpoint.
 */
export const pagePaddingX = {
  mobile:  16,
  tablet:  24,
  desktop: 32,
} as const;
