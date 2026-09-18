/**
 * Alert — inline persistent message.
 * Source: /design-system/patterns/feedback.md
 */
import { forwardRef, type ReactNode } from 'react';
import { Alert as AntAlert } from 'antd';
import type { AlertProps as AntAlertProps } from 'antd';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface AlertProps extends Omit<AntAlertProps, 'type' | 'message' | 'description'> {
  variant?: AlertType;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  banner?: boolean;
}

export const Alert = forwardRef<HTMLElement, AlertProps>(function Alert(
  { variant = 'info', title, description, action, closable, onClose, banner, className, ...rest },
  _ref,
) {
  return (
    <AntAlert
      type={variant}
      message={title}
      description={description}
      closable={closable}
      onClose={onClose}
      banner={banner}
      action={action}
      className={['cs-alert', `cs-alert--${variant}`, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export default Alert;
