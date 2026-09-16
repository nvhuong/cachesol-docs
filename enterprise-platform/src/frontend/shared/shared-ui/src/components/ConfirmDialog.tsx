import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title = 'Xác nhận',
  content = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
  okText = 'Xác nhận',
  cancelText = 'Hủy',
  okType = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Modal
      open={open}
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          {title}
        </span>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button
          key="ok"
          type={okType}
          loading={loading}
          onClick={onConfirm}
        >
          {okText}
        </Button>,
      ]}
    >
      <p>{content}</p>
    </Modal>
  );
};
