/**
 * Typography tokens.
 * Source of truth: /design-system/tokens/typography.md
 */

export const fontFamily = {
  sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const;

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

export const fontSize = {
  'display-lg': 36,
  'display-md': 30,
  'heading-xl': 24,
  'heading-lg': 20,
  'heading-md': 18,
  'heading-sm': 16,
  'body-lg':    16,
  'body-md':    14,
  'body-sm':    13,
  'label-md':   14,
  'label-sm':   12,
  caption:      12,
  code:         13,
} as const;

export const lineHeight = {
  'display-lg': '44px',
  'display-md': '38px',
  'heading-xl': '32px',
  'heading-lg': '28px',
  'heading-md': '26px',
  'heading-sm': '24px',
  'body-lg':    '24px',
  'body-md':    '20px',
  'body-sm':    '18px',
  'label-md':   '20px',
  'label-sm':   '16px',
  caption:      '16px',
  code:         '20px',
} as const;

/**
 * 1.2–1.5 line-height multipliers for body copy.
 */
export const lineHeightRatio = {
  display: 1.22,
  heading: 1.33,
  body:    1.43,
  label:   1.43,
  caption: 1.33,
  code:    1.54,
} as const;

export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
