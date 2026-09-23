/**
 * Button — wrapper around Ant Design Button.
 * Source: /design-system/components/button.md
 *
 * Variants:
 *   primary | secondary | tertiary | ghost | destructive | link
 * Sizes: sm | md | lg
 *
 * One primary button per region. Action labels are verbs.
 */
import { forwardRef, type ReactNode, type MouseEvent } from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import { Space } from 'antd';

import type { Density } from '../tokens/spacing';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'destructive'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

/** Allow native HTML form submission. `type` field trên AntD Button bị omit vì conflict với variant. */
type AntButtonWithoutType = Omit<AntButtonProps, 'type' | 'size' | 'variant'> & {
  /** HTML button type — submit / button / reset. */
  htmlType?: 'submit' | 'button' | 'reset';
};

export interface ButtonProps extends AntButtonWithoutType {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  density?: Density;
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

/**
 * Map our variant → Ant Design type / danger / ghost.
 */
function resolveAntType(variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return { type: 'primary' as const, danger: false, ghost: false };
    case 'secondary':
      return { type: 'default' as const, danger: false, ghost: false };
    case 'tertiary':
      return { type: 'text' as const, danger: false, ghost: false };
    case 'ghost':
      return { type: 'default' as const, danger: false, ghost: true };
    case 'destructive':
      return { type: 'primary' as const, danger: true, ghost: false };
    case 'link':
      return { type: 'link' as const, danger: false, ghost: false };
  }
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    iconLeading,
    iconTrailing,
    fullWidth,
    loading,
    disabled,
    htmlType,
    children,
    onClick,
    className,
    ...rest
  },
  ref,
) {
  const { type, danger, ghost } = resolveAntType(variant);
  const antSize = size === 'md' ? 'middle' : size === 'sm' ? 'small' : 'large';
  const isIconOnly = !children && (iconLeading || iconTrailing);

  return (
    <AntButton
      ref={ref as never}
      type={type}
      danger={danger}
      ghost={ghost}
      size={antSize}
      loading={loading}
      disabled={disabled}
      block={fullWidth}
      onClick={onClick}
      htmlType={htmlType}
      className={['cs-btn', `cs-btn--${variant}`, isIconOnly && 'cs-btn--icon-only', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {(iconLeading || iconTrailing) && !loading ? (
        <Space size={8}>
          {iconLeading}
          {children && <span>{children}</span>}
          {iconTrailing}
        </Space>
      ) : (
        children
      )}
    </AntButton>
  );
});

export default Button;
