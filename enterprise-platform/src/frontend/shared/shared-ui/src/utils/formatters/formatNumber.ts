/**
 * Format a number with locale-aware thousands separator.
 * @example formatNumber(1234567, 'en-US') → "1,234,567"
 * @example formatNumber(1234567, 'vi-VN') → "1.234.567"
 */
export function formatNumber(
  value: number | string | undefined | null,
  locale: string = 'en-US',
): string {
  if (value === null || value === undefined || value === '') return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format a large number with K/M/B suffix.
 * @example formatCompact(1234567) → "1.2M"
 * @example formatCompact(1234) → "1.2K"
 */
export function formatCompact(
  value: number | string | undefined | null,
  _locale: string = 'en-US',
): string {
  if (value === null || value === undefined || value === '') return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';

  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs}`;
}

/**
 * Format a percentage.
 * @example formatPercent(0.1234, 'en-US') → "12.3%"
 */
export function formatPercent(
  value: number | string | undefined | null,
  locale: string = 'en-US',
  decimals: number = 1,
): string {
  if (value === null || value === undefined || value === '') return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
