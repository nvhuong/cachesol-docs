/**
 * Tag — chip / badge with semantic variants.
 * Source: /design-system/patterns/data-display.md
 */
import { forwardRef, type ReactNode } from 'react';
import { Tag as AntTag } from 'antd';
import type { TagProps as AntTagProps } from 'antd';

export type TagVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'processing';

export interface TagProps extends Omit<AntTagProps, 'color'> {
  variant?: TagVariant;
  /** Dot indicator (used for status). */
  dot?: boolean;
  /** Removable — shows × button. */
  removable?: boolean;
  /** Pill shape (radius.full). */
  pill?: boolean;
  children?: ReactNode;
}

function resolveColor(variant: TagVariant): string {
  switch (variant) {
    case 'success':    return 'success';
    case 'warning':    return 'warning';
    case 'error':      return 'error';
    case 'info':       return 'processing';
    case 'processing': return 'processing';
    default:           return 'default';
  }
}

export const Tag = forwardRef<HTMLElement, TagProps>(function Tag(
  { variant = 'default', dot, removable, pill, children, className, ...rest },
  _ref,
) {
  return (
    <AntTag
      color={resolveColor(variant)}
      bordered={variant === 'default'}
      className={[
        'cs-tag',
        `cs-tag--${variant}`,
        pill && 'cs-tag--pill',
        dot && 'cs-tag--dot',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="cs-tag__dot"
        />
      )}
      {children}
      {removable && (
        <button
          type="button"
          aria-label="Remove"
          className="cs-tag__close"
        >
          ×
        </button>
      )}
    </AntTag>
  );
});

export default Tag;
