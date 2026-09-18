/**
 * Brand palette — Modern Blue / Indigo.
 * Source of truth: /design-system/tokens/colors.md
 */
export const brand = {
  50:  '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
  950: '#172554',
} as const;

/**
 * Cool slate-based neutral palette.
 */
export const neutral = {
  0:    '#FFFFFF',
  50:   '#F8FAFC',
  100:  '#F1F5F9',
  200:  '#E2E8F0',
  300:  '#CBD5E1',
  400:  '#94A3B8',
  500:  '#64748B',
  600:  '#475569',
  700:  '#334155',
  800:  '#1E293B',
  900:  '#0F172A',
  950:  '#020617',
  1000: '#000000',
} as const;

/**
 * Success palette.
 */
export const success = {
  50:  '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  500: '#22C55E',
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
} as const;

/**
 * Warning palette.
 */
export const warning = {
  50:  '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const;

/**
 * Error palette.
 */
export const error = {
  50:  '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  500: '#EF4444',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
} as const;

/**
 * Data-viz palette. Use for charts only.
 */
export const chart = {
  1: '#2563EB', // blue
  2: '#16A34A', // green
  3: '#D97706', // amber
  4: '#DC2626', // red
  5: '#7C3AED', // purple
  6: '#0891B2', // cyan
  7: '#DB2777', // pink
  8: '#475569', // slate
} as const;

export type BrandScale = typeof brand;
export type NeutralScale = typeof neutral;
export type SemanticScale = typeof success & typeof warning & typeof error;
export type ChartPalette = typeof chart;
