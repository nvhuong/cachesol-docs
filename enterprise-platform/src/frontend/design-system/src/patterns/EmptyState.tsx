/**
 * EmptyState — pattern for "no data" placeholders.
 * Source: /design-system/patterns/feedback.md (Empty State)
 */
import { type ReactNode } from 'react';

export type EmptyStateType =
  | 'no-data'        // New / fresh list
  | 'no-results'     // Search returned nothing
  | 'permission'     // User lacks access
  | 'error'          // System error
  | 'not-found';     // Resource does not exist

export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

const DEFAULTS: Record<EmptyStateType, { title: string; description: string }> = {
  'no-data': {
    title: 'No data yet',
    description: 'Get started by creating your first record.',
  },
  'no-results': {
    title: 'No results found',
    description: 'Try a different search or clear filters.',
  },
  'permission': {
    title: "You don't have access",
    description: 'Contact your admin to request access.',
  },
  'error': {
    title: 'Something went wrong',
    description: 'Please try again or contact support.',
  },
  'not-found': {
    title: 'Not found',
    description: 'The resource you are looking for does not exist.',
  },
};


const DEFAULT_ICONS: Record<EmptyStateType, string> = {
  'no-data': '📋',
  'no-results': '🔍',
  'permission': '🔒',
  'error': '⚠',
  'not-found': '🔎',
};

export function EmptyState({
  type = 'no-data',
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  const defaults = DEFAULTS[type];
  return (
    <div className={`cs-empty-state cs-empty-state--${type}`} role="status">
      <div className="cs-empty-state__icon" aria-hidden="true">
        {icon ?? DEFAULT_ICONS[type]}
      </div>
      <h3 className="cs-empty-state__title">{title ?? defaults.title}</h3>
      <p className="cs-empty-state__description">{description ?? defaults.description}</p>
      {action && <div className="cs-empty-state__action">{action}</div>}
    </div>
  );
}

export default EmptyState;
