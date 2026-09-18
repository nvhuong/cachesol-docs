/**
 * LoadingState — page / section / table skeleton.
 * Source: /design-system/patterns/feedback.md (Loading)
 */
import { type ReactNode } from 'react';
import { Skeleton, Spin } from 'antd';

export type LoadingShape = 'page' | 'section' | 'table' | 'inline';

export interface LoadingStateProps {
  shape?: LoadingShape;
  /** Number of skeleton rows (table) or sections. */
  rows?: number;
  /** Inline label shown next to spinner. */
  label?: ReactNode;
  /** Custom height for each skeleton row. */
  height?: number;
}

export function LoadingState({
  shape = 'section',
  rows = 4,
  label,
  height,
}: LoadingStateProps) {
  if (shape === 'inline') {
    return (
      <span className="cs-loading-inline">
        <Spin size="small" />
        {label && <span className="cs-loading-inline__label">{label}</span>}
      </span>
    );
  }

  if (shape === 'table') {
    return (
      <div className="cs-loading-table" aria-busy="true" aria-live="polite">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            active
            paragraph={{ rows: 1, width: '100%' as unknown as number }}
            style={height ? { height } : undefined}
          />
        ))}
      </div>
    );
  }

  if (shape === 'page') {
    return (
      <div className="cs-loading-page" aria-busy="true" aria-live="polite">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className="cs-loading-section" aria-busy="true" aria-live="polite">
      <Skeleton active paragraph={{ rows }} />
    </div>
  );
}

export default LoadingState;
