/**
 * Input — text input wrapper with label, helper text, and error state.
 * Source: /design-system/components/input.md
 */
import { forwardRef, type ReactNode } from 'react';
import { Input as AntInput, Form } from 'antd';
import type { InputProps as AntInputProps, InputRef } from 'antd';

export interface InputProps extends Omit<AntInputProps, 'size' | 'prefix' | 'suffix'> {
  /** Visible label. Required — placeholder is never a label. */
  label?: ReactNode;
  /** Required field marker. Adds " *" to label and aria-required. */
  required?: boolean;
  /** Helper text shown below input. Replaced by error message when error=true. */
  helperText?: ReactNode;
  /** When true, applies error styling + shows errorMessage. */
  error?: boolean;
  errorMessage?: ReactNode;
  /** Max character counter. Shows "current / max". */
  maxLength?: number;
  showCount?: boolean;
  /** Optional icon or text before the value. */
  prefix?: ReactNode;
  /** Optional icon or text after the value (e.g. clear button). */
  suffix?: ReactNode;
  /** Size token. */
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<InputRef, InputProps>(function Input(
  {
    label,
    required,
    helperText,
    error,
    errorMessage,
    maxLength,
    showCount,
    prefix,
    suffix,
    inputSize = 'md',
    id,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const inputId = id ?? `cs-input-${rest.name ?? Math.random().toString(36).slice(2, 8)}`;
  const helperId = `${inputId}-helper`;
  const antSize = inputSize === 'md' ? 'middle' : inputSize;

  const inputEl = (
    <AntInput
      ref={ref}
      id={inputId}
      size={antSize}
      status={error ? 'error' : undefined}
      prefix={prefix as never}
      suffix={suffix as never}
      maxLength={maxLength}
      showCount={showCount}
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={error || undefined}
      aria-describedby={helperText || errorMessage ? helperId : undefined}
      {...rest}
    />
  );

  if (!label && !helperText && !errorMessage) return inputEl;

  return (
    <div className={['cs-input', error && 'cs-input--error', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={inputId} className="cs-input__label">
          {label}
          {required && (
            <span aria-hidden="true" className="cs-input__required">
              {' *'}
            </span>
          )}
        </label>
      )}
      {inputEl}
      {(helperText || errorMessage) && (
        <div
          id={helperId}
          className={
            error
              ? 'cs-input__error-msg'
              : 'cs-input__helper'
          }
        >
          {error ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
});

/** Ant Design Form.Item helper — convenience preset matching CacheSol Input. */
export const FormInput = Form.Item;

export default Input;
