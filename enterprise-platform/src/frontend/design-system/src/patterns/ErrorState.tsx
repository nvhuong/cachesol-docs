/**
 * ErrorState — page / section error with retry.
 * Source: /design-system/patterns/feedback.md (Error States)
 */
import { type ReactNode } from 'react';
import { Button } from '../components/Button';

export type ErrorKind = 'network' | 'permission' | 'not-found' | 'server' | 'generic';

export interface ErrorStateProps {
  kind?: ErrorKind;
  title?: ReactNode;
  description?: ReactNode;
  onRetry?: () => void;
  /** Custom retry label. */
  retryLabel?: ReactNode;
  /** Optional reference ID (e.g. trace id) shown to user. */
  referenceId?: string;
}

const DEFAULTS: Record<ErrorKind, { title: string; description: string }> = {
  network: {
    title: 'Connection lost',
    description: 'Check your internet connection and try again.',
  },
  permission: {
    title: 'Access restricted',
    description: "You don't have permission to view this content.",
  },
  'not-found': {
    title: 'Not found',
    description: 'This resource may have been removed or does not exist.',
  },
  server: {
    title: 'Server error',
    description: 'Something went wrong on our end. Try again in a moment.',
  },
  generic: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Try again or contact support.',
  },
};

const ICONS: Record<ErrorKind, string> = {
  network:    '⚠',
  permission: '🔒',
  'not-found': '🔍',
  server:     '⚠',
  generic:    '⚠',
};

export function ErrorState({
  kind = 'generic',
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  referenceId,
}: ErrorStateProps) {
  const defaults = DEFAULTS[kind];
  const showRetry = kind !== 'permission' && kind !== 'not-found';
  return (
    <div className={`cs-error-state cs-error-state--${kind}`} role="alert">
      <div className="cs-error-state__icon" aria-hidden="true">{ICONS[kind]}</div>
      <h3 className="cs-error-state__title">{title ?? defaults.title}</h3>
      <p className="cs-error-state__description">{description ?? defaults.description}</p>
      {referenceId && (
        <p className="cs-error-state__ref">
          Reference: <code>{referenceId}</code>
        </p>
      )}
      {showRetry && onRetry && (
        <Button variant="primary" size="md" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
