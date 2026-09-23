import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';
import { KPI, LoadingState, PageHeader, StatusBadge } from '@cachesol/design-system';
import { formatNumber, formatRelative } from '@cachesol/shared-ui';
import { fetchMockTenants, fetchMockAudit } from '../../api/mock-data';
import type { Tenant } from '../../types/tenant.types';
import type { AuditEntry } from '../../types/admin.types';

export function DashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMockTenants(), fetchMockAudit()]).then(([t, a]) => {
      setTenants(t);
      setAudit(a);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState shape="page" />;

  const active = tenants.filter((t) => t.status === 'active').length;
  const provisioning = tenants.filter((t) => t.status === 'provisioning').length;
  const suspended = tenants.filter((t) => t.status === 'suspended').length;
  const seats = tenants.reduce((sum, t) => sum + t.seats, 0);
  const monthlyRevenueVnd = tenants.reduce(
    (sum, t) =>
      sum +
      t.enabledMiniApps.reduce((m, a) => m + a.monthlyCost * a.seats, 0),
    0,
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Tổng quan vận hành Platform Registry"
        breadcrumb={[{ label: 'Home' }]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <KPI
            label="Tenants"
            value={formatNumber(tenants.length)}
            comparison="Tổng đã tạo"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <KPI
            label="Active"
            value={formatNumber(active)}
            trend="+12.4%"
            trendDirection="up"
            trendUpIsPositive
            comparison="tháng này"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <KPI
            label="Seats"
            value={formatNumber(seats)}
            comparison="đang sử dụng"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <KPI
            label="MRR"
            value={`${formatNumber(monthlyRevenueVnd)} ₫`}
            trend="+8.1%"
            trendDirection="up"
            trendUpIsPositive
            comparison="tháng này"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={8}>
          <Card title="Trạng thái tenants" loading={loading}>
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <StatusBadge status="active" /> {active}
              </Col>
              <Col span={8}>
                <StatusBadge status="pending" /> {provisioning}
              </Col>
              <Col span={8}>
                <StatusBadge status="error" /> {suspended}
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Audit log gần đây" loading={loading}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {audit.slice(0, 6).map((a) => (
                <li
                  key={a.id}
                  style={{
                    padding: 'var(--spacing-2) 0',
                    borderBottom: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <strong>{a.actor.name ?? a.actor.email}</strong>{' '}
                  <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>{' '}
                  <span style={{ color: 'var(--color-text-secondary)' }}>{a.description}</span>
                  <div
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-tertiary)',
                      marginTop: 4,
                    }}
                  >
                    {a.subject.label} · {formatRelative(a.timestamp)}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default DashboardPage;
