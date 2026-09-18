import { Card, Statistic, Row, Col } from 'antd';
import { TeamOutlined, UserAddOutlined, UserDeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '@cachesol/design-system';

export const DashboardPage = () => {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Tổng quan hệ thống"
      />

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng nhân viên"
              value={156}
              prefix={<TeamOutlined />}
              valueStyle={{ color: 'var(--color-brand-600)' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhân viên mới"
              value={12}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: 'var(--color-success-600)' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nghỉ việc"
              value={3}
              prefix={<UserDeleteOutlined />}
              valueStyle={{ color: 'var(--color-error-600)' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang thử việc"
              value={8}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: 'var(--color-warning-600)' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
