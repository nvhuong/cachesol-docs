/**
 * Format a number as currency.
 * @example formatCurrency(1234000, 'VND', 'vi-VN') → "1.234.000 ₫"
 * @example formatCurrency(1234.56, 'USD', 'en-US') → "$1,234.56"
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = 'VND',
  locale: string = 'vi-VN',
): string {
  if (amount === null || amount === undefined || amount === '') return '—';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(num);
}
