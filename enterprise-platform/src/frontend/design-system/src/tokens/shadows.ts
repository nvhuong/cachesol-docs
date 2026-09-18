/**
 * Elevation tokens.
 * Source of truth: /design-system/tokens/shadows.md
 */
export const shadow = {
  none: 'none',
  xs:   '0 1px 2px rgba(15, 23, 42, 0.05)',
  sm:   '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
  md:   '0 4px 8px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
  lg:   '0 12px 24px -8px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.06)',
  xl:   '0 24px 48px -12px rgba(15, 23, 42, 0.18), 0 8px 16px -4px rgba(15, 23, 42, 0.08)',
  '2xl': '0 32px 64px -16px rgba(15, 23, 42, 0.24)',
} as const;

export type ShadowToken = keyof typeof shadow;

export const shadowByPurpose = {
  dropdown:   shadow.sm,
  popover:    shadow.sm,
  tooltip:    shadow.sm,
  toast:      shadow.lg,
  sticky:     shadow.sm,
  modal:      shadow.lg,
  drawer:     shadow.lg,
  cardHover:  shadow.md,
} as const;
