/**
 * Modal — wraps Ant Design Modal with CacheSol sizing + variants.
 * Source: /design-system/components/modal.md
 */
import { forwardRef, type ReactNode } from 'react';
import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';
import { modalSize } from '../tokens/spacing';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalVariant = 'standard' | 'confirmation' | 'destructive' | 'form';

export interface ModalProps extends Omit<AntModalProps, 'width'> {
  variant?: ModalVariant;
  size?: ModalSize;
  /** When true, disables backdrop click + Escape close. */
  persistent?: boolean;
  /** Loading state — disables footer buttons + shows spinner in primary. */
  loading?: boolean;
  /** Title displayed in modal header. */
  title?: ReactNode;
  /** Description below the title. */
  description?: ReactNode;
  /** Body content. */
  children?: ReactNode;
}

function resolveWidth(size: ModalSize): number | string {
  if (size === 'xl') return modalSize.xl;
  return modalSize[size];
}

function resolveOkButtonDanger(variant: ModalVariant) {
  return variant === 'destructive';
}

export const Modal = forwardRef<HTMLElement, ModalProps>(function Modal(
  {
    variant = 'standard',
    size = 'md',
    persistent,
    loading,
    title,
    description,
    children,
    open,
    onCancel,
    okText,
    cancelText = 'Cancel',
    okButtonProps,
    cancelButtonProps,
    footer,
    ...rest
  },
  _ref,
) {
  const isDestructive = variant === 'destructive';

  return (
    <AntModal
      open={open}
      width={resolveWidth(size)}
      title={title}
      onCancel={(e) => {
        if (persistent) return;
        onCancel?.(e);
      }}
      maskClosable={!persistent}
      keyboard={!persistent}
      confirmLoading={loading}
      okText={okText ?? (isDestructive ? 'Delete' : 'Confirm')}
      cancelText={cancelText}
      okButtonProps={{
        danger: resolveOkButtonDanger(variant),
        ...okButtonProps,
      }}
      cancelButtonProps={cancelButtonProps}
      footer={
        footer !== undefined
          ? footer
          : [
              <button
                key="cancel"
                className="cs-btn cs-btn--secondary cs-btn--md"
                onClick={(e) => onCancel?.(e as never)}
              >
                {cancelText}
              </button>,
              <button
                key="ok"
                className={
                  isDestructive
                    ? 'cs-btn cs-btn--destructive cs-btn--md'
                    : 'cs-btn cs-btn--primary cs-btn--md'
                }
                disabled={loading}
              >
                {okText ?? (isDestructive ? 'Delete' : 'Confirm')}
              </button>,
            ]
      }
      {...rest}
    >
      {description && <p className="cs-modal__description">{description}</p>}
      {children}
    </AntModal>
  );
});

export default Modal;
