/**
 * FormPage — template for create / edit forms.
 * Source: /design-system/templates/form-page.md
 *
 * Composition:
 *   PageHeader
 *   Form sections
 *   Sticky action bar (Cancel / Save Draft / Save)
 */
import { type ReactNode } from 'react';
import { PageHeader, type BreadcrumbItem } from '../patterns/PageHeader';
import { Button } from '../components/Button';
import { Space } from 'antd';

export interface FormPageProps {
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: BreadcrumbItem[];

  /** The form sections (use FormSection pattern). */
  children?: ReactNode;

  /** Sticky action bar. */
  onSubmit?: () => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  submitLabel?: ReactNode;
  cancelLabel?: ReactNode;
  saveDraftLabel?: ReactNode;

  loading?: boolean;
  /** Track unsaved changes to confirm on cancel. */
  isDirty?: boolean;

  /** Max content width. Default 720px. */
  maxWidth?: number;
}

export function FormPage({
  title,
  description,
  breadcrumb,
  children,
  onSubmit,
  onCancel,
  onSaveDraft,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  saveDraftLabel = 'Save draft',
  loading,
  isDirty,
  maxWidth = 720,
}: FormPageProps) {
  const handleCancel = () => {
    if (isDirty) {
      const ok = window.confirm('You have unsaved changes. Discard them?');
      if (!ok) return;
    }
    onCancel?.();
  };

  return (
    <div className="cs-page cs-page--form">
      <PageHeader
        title={title}
        description={description}
        breadcrumb={breadcrumb}
      />
      <div
        className="cs-page__body cs-page__body--form"
        style={{ maxWidth }}
      >
        {children}
      </div>

      {(onSubmit || onCancel) && (
        <div className="cs-page__action-bar">
          <Space size={8}>
            {onCancel && (
              <Button variant="secondary" size="md" onClick={handleCancel} disabled={loading}>
                {cancelLabel}
              </Button>
            )}
            {onSaveDraft && (
              <Button variant="tertiary" size="md" onClick={onSaveDraft} disabled={loading}>
                {saveDraftLabel}
              </Button>
            )}
            {onSubmit && (
              <Button
                variant="primary"
                size="md"
                onClick={onSubmit}
                loading={loading}
              >
                {submitLabel}
              </Button>
            )}
          </Space>
        </div>
      )}
    </div>
  );
}

export default FormPage;
