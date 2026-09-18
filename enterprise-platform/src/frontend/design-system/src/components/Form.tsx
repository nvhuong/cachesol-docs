/**
 * Form — wraps Ant Design Form with CacheSol semantics.
 * Source: /design-system/components/form.md
 */
import { forwardRef, type ReactNode } from 'react';
import { Form as AntForm } from 'antd';
import type { FormProps as AntFormProps } from 'antd';

export type FormLayout = 'vertical' | 'horizontal' | 'inline';

export interface FormProps extends Omit<AntFormProps, 'layout'> {
  layout?: FormLayout;
  /** Show * next to required labels. */
  requiredMark?: boolean;
  /** Section title for grouping fields. */
  sectionTitle?: ReactNode;
  children?: ReactNode;
}

export const Form = forwardRef<HTMLElement, FormProps>(function Form(
  { layout = 'vertical', requiredMark = true, sectionTitle, children, className, ...rest },
  _ref,
) {
  return (
    <div className={['cs-form', `cs-form--${layout}`, className].filter(Boolean).join(' ')}>
      {sectionTitle && <div className="cs-form__section-title">{sectionTitle}</div>}
      <AntForm layout={layout} requiredMark={requiredMark} {...rest}>
        {children}
      </AntForm>
    </div>
  );
});

/** Re-export for convenience. */
export const FormItem = AntForm.Item;
export const FormErrorList = AntForm.ErrorList;

export default Form;
