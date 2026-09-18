/**
 * @cachesol/design-system — Public API
 * CacheSol Enterprise Platform design system tokens & React component library.
 *
 * Layer architecture (mirrors /design-system/ docs):
 *   Tokens       → from './tokens'
 *   Components   → from './components'
 *   Patterns     → from './patterns'
 *   Templates    → from './templates'
 *   Theme        → AntD theme bridged to CacheSol tokens
 *   Hooks        → useDensity, useBreakpoint
 */

// ── Tokens ─────────────────────────────────────────
export * from './tokens';

// ── Components ─────────────────────────────────────
export * from './components';

// ── Patterns ───────────────────────────────────────
export * from './patterns';

// ── Templates ──────────────────────────────────────
export * from './templates';

// ── Theme ──────────────────────────────────────────
export { cachesolTheme, default as default } from './theme';

// ── Hooks ──────────────────────────────────────────
export * from './hooks';

export const VERSION = '1.0.0';
