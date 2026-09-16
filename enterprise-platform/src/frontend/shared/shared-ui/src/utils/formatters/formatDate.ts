import dayjs from 'dayjs';

export function formatDate(date: string | Date | undefined | null, format = 'DD/MM/YYYY'): string {
  if (!date) return '-';
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return '-';
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
}
