/**
 * Select — single/multi select wrapper around Ant Design Select.
 * Source: /design-system/components/select.md
 */
import { forwardRef, type ReactNode, type ComponentProps } from 'react';
import { Select as AntSelect } from 'antd';
import type { RefSelectProps } from 'antd';

export type SelectVariant = 'single' | 'multi' | 'searchable';

export interface SelectOption {
  value: string | number;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

/**
 * CacheSol's SelectProps — wraps AntD's SelectProps to add label/error/variant.
 * Uses `Pick<ComponentProps>` to avoid name collision.
 */
type AntSelectLike = Omit<
  ComponentProps<typeof AntSelect>,
  'size' | 'mode' | 'options' | 'variant'
>;

export interface SelectProps extends AntSelectLike {
  label?: ReactNode;
  required?: boolean;
  helperText?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  variant?: SelectVariant;
  inputSize?: 'sm' | 'md' | 'lg';
  options?: SelectOption[];
}

function resolveMode(variant: SelectVariant): ComponentProps<typeof AntSelect>['mode'] {
  if (variant === 'multi') return 'multiple';
  return undefined;
}

export const Select = forwardRef<RefSelectProps, SelectProps>(function Select(
  {
    label,
    required,
    helperText,
    error,
    errorMessage,
    variant = 'single',
    inputSize = 'md',
    options,
    id,
    className,
    placeholder,
    ...rest
  },
  ref,
) {
  const inputId = id ?? `cs-select-${Math.random().toString(36).slice(2, 8)}`;
  const helperId = `${inputId}-helper`;
  const antSize = inputSize === 'md' ? 'middle' : inputSize === 'sm' ? 'small' : 'large';
  const mode = resolveMode(variant);
  const showSearch = variant === 'searchable';

  const selectEl = (
    <AntSelect
      ref={ref}
      id={inputId}
      size={antSize}
      mode={mode}
      status={error ? 'error' : undefined}
      showSearch={showSearch}
      placeholder={placeholder}
      optionFilterProp="label"
      options={options as never}
      aria-required={required || undefined}
      aria-invalid={error || undefined}
      aria-describedby={helperText || errorMessage ? helperId : undefined}
      {...rest}
    />
  );

  if (!label && !helperText && !errorMessage) return selectEl;

  return (
    <div className={['cs-select', error && 'cs-select--error', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={inputId} className="cs-select__label">
          {label}
          {required && (
            <span aria-hidden="true" className="cs-select__required">
              {' *'}
            </span>
          )}
        </label>
      )}
      {selectEl}
      {(helperText || errorMessage) && (
        <div
          id={helperId}
          className={error ? 'cs-select__error-msg' : 'cs-select__helper'}
        >
          {error ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
});

export default Select;
