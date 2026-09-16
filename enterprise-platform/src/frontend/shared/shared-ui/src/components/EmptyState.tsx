import { Empty } from 'antd';

interface EmptyStateProps {
  description?: string;
  image?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({ 
  description = 'Không có dữ liệu', 
  image,
  action,
}: EmptyStateProps) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '48px 0',
    }}>
      <Empty description={description} image={image}>
        {action}
      </Empty>
    </div>
  );
};
