/**
 * DatePicker — date / range / month picker.
 * Source: /design-system/components/date-picker.md
 */
import { forwardRef, type ReactNode, type ComponentProps } from 'react';
import { DatePicker as AntDatePicker } from 'antd';

const { RangePicker: AntRangePicker } = AntDatePicker;

export type DatePickerVariant = 'date' | 'range' | 'month' | 'dateTime';

/**
 * CacheSol's DatePickerProps — wraps AntD's DatePickerProps to add label/error/variant.
 * Uses `Pick<ComponentProps>` to avoid name collision with AntD's own DatePickerProps type.
 */
type AntDatePickerLike = Omit<
  ComponentProps<typeof AntDatePicker>,
  'size' | 'picker' | 'variant'
>;

export interface DatePickerProps extends AntDatePickerLike {
  variant?: DatePickerVariant;
  inputSize?: 'sm' | 'md' | 'lg';
  label?: ReactNode;
  required?: boolean;
  helperText?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
}

function resolvePicker(v: DatePickerVariant): ComponentProps<typeof AntDatePicker>['picker'] {
  if (v === 'month') return 'month';
  if (v === 'dateTime') return 'date';
  return 'date';
}

export const DatePicker = forwardRef<HTMLElement, DatePickerProps>(function DatePicker(
  {
    variant = 'date',
    inputSize = 'md',
    label,
    required,
    helperText,
    error,
    errorMessage,
    id,
    className,
    showTime,
    ...rest
  },
  _ref,
) {
  const inputId = id ?? `cs-date-${Math.random().toString(36).slice(2, 8)}`;
  const helperId = `${inputId}-helper`;
  const antSize = inputSize === 'md' ? 'middle' : inputSize === 'sm' ? 'small' : 'large';
  const showTimeResolved = variant === 'dateTime' ? true : showTime;

  const pickerEl = (
    <AntDatePicker
      id={inputId}
      size={antSize}
      picker={resolvePicker(variant)}
      showTime={showTimeResolved}
      status={error ? 'error' : undefined}
      aria-required={required || undefined}
      aria-invalid={error || undefined}
      aria-describedby={helperText || errorMessage ? helperId : undefined}
      {...rest}
    />
  );

  if (!label && !helperText && !errorMessage) return pickerEl;

  return (
    <div className={['cs-datepicker', error && 'cs-datepicker--error', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={inputId} className="cs-datepicker__label">
          {label}
          {required && (
            <span aria-hidden="true" className="cs-datepicker__required">
              {' *'}
            </span>
          )}
        </label>
      )}
      {pickerEl}
      {(helperText || errorMessage) && (
        <div
          id={helperId}
          className={error ? 'cs-datepicker__error-msg' : 'cs-datepicker__helper'}
        >
          {error ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
});

/**
 * RangePicker — re-exports AntD's RangePicker with minimal wrapper.
 */
export const DateRangePicker = forwardRef<HTMLElement, Record<string, unknown>>(
  function DateRangePicker(props, _ref) {
    // Spread AntD RangePicker props directly.
    return <AntRangePicker {...(props as object)} />;
  },
);

export default DatePicker;
