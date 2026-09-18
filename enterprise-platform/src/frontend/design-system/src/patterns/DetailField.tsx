/**
 * DetailField — label/value pair for read-only entity display.
 * Source: /design-system/patterns/data-display.md (Description list)
 */
import { type ReactNode } from 'react';
import { CopyButton } from './CopyButton';

export interface DetailFieldProps {
  label: ReactNode;
  value?: ReactNode;
  /** Optional helper text shown below value. */
  helper?: ReactNode;
  /** Layout direction. */
  layout?: 'inline' | 'stacked';
  /** Monospace value (for IDs, codes, technical values). */
  mono?: boolean;
  /** Show copy-to-clipboard button when value is text. */
  copyable?: boolean;
  /** Column span when in 2-col grid. */
  span?: 1 | 2;
}

export function DetailField({
  label,
  value,
  helper,
  layout = 'inline',
  mono,
  copyable,
  span = 1,
}: DetailFieldProps) {
  return (
    <div
      className={[
        'cs-detail-field',
        `cs-detail-field--${layout}`,
        span === 2 && 'cs-detail-field--span-2',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <dt className="cs-detail-field__label">{label}</dt>
      <dd className="cs-detail-field__value">
        {value !== undefined && value !== null && value !== '' ? (
          <span className={mono ? 'cs-detail-field__mono cs-tabular' : undefined}>
            {value}
            {copyable && typeof value === 'string' && <CopyButton text={value} />}
          </span>
        ) : (
          <span className="cs-detail-field__empty">—</span>
        )}
        {helper && <div className="cs-detail-field__helper">{helper}</div>}
      </dd>
    </div>
  );
}

export default DetailField;
