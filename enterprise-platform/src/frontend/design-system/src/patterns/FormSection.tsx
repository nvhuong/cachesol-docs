/**
 * FormSection — visually grouped form fields with title.
 * Source: /design-system/patterns/forms.md (Sectioned form)
 */
import { type ReactNode } from 'react';

export interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Visual density. */
  columns?: 1 | 2;
}

export function FormSection({
  title,
  description,
  children,
  columns = 1,
}: FormSectionProps) {
  return (
    <section
      className={[
        'cs-form-section',
        columns === 2 && 'cs-form-section--two-col',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(title || description) && (
        <header className="cs-form-section__head">
          {title && <h3 className="cs-form-section__title">{title}</h3>}
          {description && <p className="cs-form-section__description">{description}</p>}
        </header>
      )}
      <div className="cs-form-section__body">{children}</div>
    </section>
  );
}

export default FormSection;
