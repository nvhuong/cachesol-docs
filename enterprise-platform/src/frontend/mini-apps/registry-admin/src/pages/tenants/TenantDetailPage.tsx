import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Descriptions, App, Space } from 'antd';
import {
  DetailPage as DSDetailPage,
  Button,
  StatusBadge,
  EmptyState,
  Tag,
  Timeline,
} from '@cachesol/design-system';
import { formatCurrency, formatDate } from '@cachesol/shared-ui';
import { fetchMockTenant } from '../../api/mock-data';
import type { Tenant } from '../../types/tenant.types';

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchMockTenant(id).then((res) => {
      setTenant(res);
      setLoading(false);
    });
  }, [id]);

  const handleSuspend = () => {
    if (tenant) {
      message.warning(`Đã gửi yêu cầu suspend tenant ${tenant.slug} (mock).`);
    }
  };

  if (!tenant) {
    return (
      <div className="cs-page">
        <EmptyState
          type="not-found"
          title="Không tìm thấy tenant"
          action={<Link to="/tenants"><Button variant="primary">Quay lại</Button></Link>}
        />
      </div>
    );
  }

  const monthlyCost = tenant.enabledMiniApps.reduce(
    (sum, a) => sum + a.monthlyCost * a.seats,
    0,
  );

  const actions = (
    <Space>
      <Button variant="tertiary" onClick={() => navigate('/tenants')}>
        Back
      </Button>
      <Button variant="destructive" onClick={handleSuspend}>
        Suspend
      </Button>
      <Button
        variant="primary"
        onClick={() => window.open(`https://${tenant.slug}.cachesol.io/admin`, '_blank')}
      >
        Open admin
      </Button>
    </Space>
  );

  const metadata = (
    <Space size={12} wrap>
      <StatusBadge status={tenant.status} />
      <Tag variant="info">{tenant.plan.toUpperCase()}</Tag>
      <span>{tenant.enabledMiniApps.length} mini-apps active</span>
      <span>·</span>
      <span>MRR: {formatCurrency(monthlyCost, tenant.enabledMiniApps[0]?.currency ?? 'VND')}</span>
    </Space>
  );

  return (
    <DSDetailPage
      title={tenant.name}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Tenants', href: '/tenants' },
        { label: tenant.slug },
      ]}
      status={tenant.status}
      metadata={metadata}
      actions={actions}
      loading={loading}
    >
      <Card title="Company info">
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="Legal name">{tenant.name}</Descriptions.Item>
          <Descriptions.Item label="Tax code">{tenant.taxCode}</Descriptions.Item>
          <Descriptions.Item label="Slug">
            <code>{tenant.slug}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Country">{tenant.country}</Descriptions.Item>
          <Descriptions.Item label="Plan">
            <Tag variant="info">{tenant.plan}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Seats">{tenant.seats}</Descriptions.Item>
          <Descriptions.Item label="Contact">{tenant.contactEmail}</Descriptions.Item>
          <Descriptions.Item label="Phone">{tenant.contactPhone ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Created">{formatDate(tenant.createdAt, 'DD/MM/YYYY HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="Last activity">
            {tenant.lastActivityAt ? formatDate(tenant.lastActivityAt, 'DD/MM/YYYY HH:mm') : '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Mini-apps đã kích hoạt" style={{ marginTop: 16 }}>
        {tenant.enabledMiniApps.length === 0 ? (
          <EmptyState
            type="no-data"
            title="Chưa có mini-app nào"
            description="Tenant chưa kích hoạt mini-app. Có thể bật qua trang catalog."
          />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            {tenant.enabledMiniApps.map((a) => (
              <div
                key={a.miniAppId}
                style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--color-border-subtle)' }}
              >
                <div style={{ flex: '0 0 160px', color: 'var(--color-text-tertiary)' }}>{a.miniAppId}</div>
                <div style={{ flex: 1 }}>
                  <span>{a.seats} seats</span>
                  <span>·</span>
                  <span>{formatCurrency(a.monthlyCost, a.currency)} / seat / month</span>
                  <span>·</span>
                  <span>enabled {formatDate(a.enabledAt, 'DD/MM/YYYY')}</span>
                </div>
              </div>
            ))}
          </Space>
        )}
      </Card>

      <Card title="Lịch sử hoạt động" style={{ marginTop: 16 }}>
        <Timeline
          items={[
            {
              key: '1',
              actor: tenant.contactEmail,
              timestamp: tenant.updatedAt,
              action: 'updated',
              subject: 'tenant info',
            },
            {
              key: '2',
              actor: 'system',
              timestamp: tenant.createdAt,
              action: 'created',
              subject: 'tenant',
            },
          ]}
        />
      </Card>
    </DSDetailPage>
  );
}

export default TenantDetailPage;
