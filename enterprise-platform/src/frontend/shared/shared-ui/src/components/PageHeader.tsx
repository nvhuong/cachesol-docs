import { Typography, Space, Button, Breadcrumb as AntBreadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

const { Title } = Typography;

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  onBack?: () => void;
}

export const PageHeader = ({
  title,
  subtitle,
  extra,
  breadcrumbs,
  onBack,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <AntBreadcrumb style={{ marginBottom: 16 }}>
          {breadcrumbs.map((item, index) => (
            <AntBreadcrumb.Item
              key={index}
              onClick={() => item.path && navigate(item.path)}
              style={{ cursor: item.path ? 'pointer' : 'default' }}
            >
              {item.label}
            </AntBreadcrumb.Item>
          ))}
        </AntBreadcrumb>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 16,
      }}>
        <Space direction="vertical" size={0}>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Typography.Text type="secondary">{subtitle}</Typography.Text>
          )}
        </Space>
        {extra && <Space>{extra}</Space>}
      </div>
    </div>
  );
};
