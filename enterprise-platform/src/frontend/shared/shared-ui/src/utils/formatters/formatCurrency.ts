export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = 'VND',
  locale: string = 'vi-VN'
): string {
  if (amount === null || amount === undefined) return '-';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(numAmount);
}
