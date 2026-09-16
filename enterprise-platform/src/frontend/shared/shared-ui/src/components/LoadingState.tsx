import { Spin } from 'antd';
import type { ReactNode } from 'react';

interface LoadingStateProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
  fullScreen?: boolean;
  children?: ReactNode;
}

export const LoadingState = ({ 
  tip = 'Đang tải...', 
  size = 'large',
  fullScreen = false,
  children,
}: LoadingStateProps) => {
  const containerStyle: React.CSSProperties = fullScreen
    ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }
    : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        padding: '48px 0',
      };

  if (children) {
    return <Spin spinning={true}>{children}</Spin>;
  }

  return (
    <div style={containerStyle}>
      <Spin tip={tip} size={size} />
    </div>
  );
};
