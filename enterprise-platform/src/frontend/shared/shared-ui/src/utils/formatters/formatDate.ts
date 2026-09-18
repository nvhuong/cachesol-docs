/**
 * Format a date / datetime.
 * @example formatDate(new Date('2026-09-18'), 'DD MMM YYYY') → "18 Sep 2026"
 * @example formatDate(new Date(), 'DD/MM/YYYY HH:mm') → "18/09/2026 14:30"
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  format: string = 'DD MMM YYYY',
  locale: string = 'en-GB',
): string {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';

  const pad = (n: number) => String(n).padStart(2, '0');
  const MONTHS_SHORT: Record<string, string> = {
    en: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
    vi: 'Thg1 Thg2 Thg3 Thg4 Thg5 Thg6 Thg7 Thg8 Thg9 Thg10 Thg11 Thg12'.split(' '),
  };
  const lang = locale.startsWith('vi') ? 'vi' : 'en';
  const months = MONTHS_SHORT[lang];
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());

  return format
    .replace('YYYY', String(y))
    .replace('MM', pad(m + 1))
    .replace('MMM', months[m])
    .replace('DD', pad(day))
    .replace('HH', h)
    .replace('mm', min);
}

/**
 * Format a date relative to now.
 * @example formatRelative(new Date(Date.now() - 3600000)) → "1h ago"
 * @example formatRelative(new Date(Date.now() - 86400000)) → "1d ago"
 */
export function formatRelative(
  date: Date | string | number | null | undefined,
  locale: string = 'en-GB',
): string {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';

  const diff = Date.now() - d.getTime();
  const min = 60 * 1000;
  const hour = 60 * min;
  const day = 24 * hour;

  if (diff < min) return locale.startsWith('vi') ? 'vừa xong' : 'just now';
  if (diff < hour) {
    const m = Math.floor(diff / min);
    return locale.startsWith('vi') ? `${m} phút trước` : `${m}m ago`;
  }
  if (diff < day) {
    const h = Math.floor(diff / hour);
    return locale.startsWith('vi') ? `${h} giờ trước` : `${h}h ago`;
  }
  if (diff < 7 * day) {
    const days = Math.floor(diff / day);
    return locale.startsWith('vi') ? `${days} ngày trước` : `${days}d ago`;
  }
  return formatDate(d, 'DD MMM YYYY', locale);
}
