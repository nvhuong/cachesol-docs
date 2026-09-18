/**
 * DataCard — generic card surface for grouped content.
 * Source: /design-system/patterns/data-display.md (Card)
 */
import { type ReactNode } from 'react';

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'flush';

export interface DataCardProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  /** Optional click handler — makes the whole card interactive. */
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function DataCard({
  title,
  description,
  action,
  footer,
  variant = 'default',
  onClick,
  children,
  className,
}: DataCardProps) {
  const isInteractive = !!onClick;
  const role = isInteractive ? 'button' : undefined;
  const tabIndex = isInteractive ? 0 : undefined;

  return (
    <div
      className={[
        'cs-card',
        `cs-card--${variant}`,
        isInteractive && 'cs-card--interactive',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={(e) => {
        if (!isInteractive) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {(title || action) && (
        <div className="cs-card__head">
          <div>
            {title && <div className="cs-card__title">{title}</div>}
            {description && <div className="cs-card__description">{description}</div>}
          </div>
          {action && <div className="cs-card__action">{action}</div>}
        </div>
      )}
      {children && <div className="cs-card__body">{children}</div>}
      {footer && <div className="cs-card__footer">{footer}</div>}
    </div>
  );
}

export default DataCard;
