/**
 * ConfirmModal — destructive confirmation dialog with optional name typing.
 * Source: /design-system/components/modal.md (Destructive confirmation pattern)
 */
import { useState, type ReactNode } from 'react';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

export interface ConfirmModalProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  /** For high-impact deletes: user must type this to enable Confirm. */
  confirmText?: string;
  okText?: string;
  cancelText?: string;
  /** Risk level. Destructive shows red confirm button. */
  variant?: 'destructive' | 'high' | 'medium' | 'low';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  okText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'medium',
  loading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [typed, setTyped] = useState('');
  const requiresTyping = !!confirmText;
  const canConfirm = !requiresTyping || typed === confirmText;
  const isDestructive = variant === 'destructive' || variant === 'high';

  return (
    <Modal
      open={open}
      variant={isDestructive ? 'destructive' : 'standard'}
      size="sm"
      title={title}
      description={description}
      okText={isDestructive ? (okText || 'Delete') : okText}
      cancelText={cancelText}
      loading={loading}
      persistent={requiresTyping}
      footer={[
        <button
          key="cancel"
          className="cs-btn cs-btn--secondary cs-btn--md"
          onClick={onCancel}
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
          disabled={!canConfirm || loading}
          onClick={onConfirm}
        >
          {isDestructive ? (okText || 'Delete') : okText}
        </button>,
      ]}
    >
      {requiresTyping && (
        <Input
          label={`Type "${confirmText}" to confirm`}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={confirmText}
        />
      )}
    </Modal>
  );
}

export default ConfirmModal;
