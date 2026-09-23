/**
 * @cachesol/shared-ui
 *
 * Utility library — formatters, hooks, and shared types.
 * All UI components live in @cachesol/design-system.
 * All API/shared types live in @cachesol/shared-types.
 */

// ── Formatters ───────────────────────────────────
export { formatCurrency } from './utils/formatters/formatCurrency';
export { formatDate, formatDateTime, formatRelative } from './utils/formatters/formatDate';
export { formatNumber, formatCompact, formatPercent } from './utils/formatters/formatNumber';

// ── Hooks ─────────────────────────────────────────
export { useDebounce } from './hooks/useDebounce';
export { usePagination } from './hooks/usePagination';

// ── Shared types (generic, not domain-specific) ─────
export type { BaseComponentProps, BaseEntity } from './types';
