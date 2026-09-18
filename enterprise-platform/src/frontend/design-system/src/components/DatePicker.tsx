/**
 * DatePicker — date / range / month picker.
 * Source: /design-system/components/date-picker.md
 */
import { forwardRef, type ReactNode } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import type { DatePickerProps as AntDatePickerProps, RangePickerProps } from 'antd';

const { RangePicker: AntRangePicker } = AntDatePicker;

export type DatePickerVariant = 'date' | 'range' | 'month' | 'dateTime';

export interface DatePickerProps extends Omit<AntDatePickerProps, 'size' | 'picker'> {
  variant?: DatePickerVariant;
  inputSize?: 'sm' | 'md' | 'lg';
  label?: ReactNode;
  required?: boolean;
  helperText?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
}

function resolvePicker(v: DatePickerVariant): AntDatePickerProps['picker'] {
  if (v === 'month') return 'month';
  if (v === 'dateTime') return 'date'; // full datetime handled by showTime
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
  const antSize = inputSize === 'md' ? 'middle' : inputSize;
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

export type DateRangePickerProps = Omit<RangePickerProps, 'size'>;

export const DateRangePicker = forwardRef<HTMLElement, DateRangePickerProps>(
  function DateRangePicker({ size, ...rest }, _ref) {
    return <AntRangePicker size={size === 'middle' || !size ? 'middle' : size} {...rest} />;
  },
);

export default DatePicker;
