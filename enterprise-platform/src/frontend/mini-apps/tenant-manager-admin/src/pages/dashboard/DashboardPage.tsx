import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';
import { KPI, LoadingState, PageHeader, StatusBadge, Timeline } from '@cachesol/design-system';
import { formatNumber, formatRelative } from '@cachesol/shared-ui';
import { fetchMockEmployees, fetchMockAudit, fetchMockProvisioning } from '../../api/mock-data';

export function DashboardPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [provisioning, setProvisioning] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMockEmployees(), fetchMockProvisioning(), fetchMockAudit()]).then(([e, p, a]) => {
      setEmployees(e);
      setProvisioning(p);
      setAudit(a);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState shape="page" />;

  const active = employees.filter((e) => e.status === 'active').length;
  const onboarding = employees.filter((e) => e.status === 'onboarding').length;
  const onLeave = employees.filter((e) => e.status === 'on-leave').length;
  const inProgress = provisioning.filter((p) => p.state === 'in-progress' || p.state === 'requested').length;
  const failedProvisioning = provisioning.filter((p) => p.state === 'failed').length;
  const synced = employees.filter((e) => e.keycloakSynced).length;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Tổng quan Tenant Manager"
        breadcrumb={[{ label: 'Home' }]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <KPI label="Employees" value={formatNumber(employees.length)} comparison="tổng" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <KPI label="Active" value={formatNumber(active)} comparison="đang làm việc" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <KPI label="Keycloak synced" value={`${synced}/${employees.length}`} comparison="tỷ lệ đồng bộ" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <KPI
            label="Provisioning"
            value={inProgress}
            comparison="đang chạy"
            trend={failedProvisioning > 0 ? `${failedProvisioning} failed` : undefined}
            trendDirection={failedProvisioning > 0 ? 'down' : 'flat'}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={8}>
          <Card title="Trạng thái employee">
            <Row gutter={[8, 12]}>
              <Col span={12}>
                <StatusBadge status="active" /> {active}
              </Col>
              <Col span={12}>
                <StatusBadge status="pending" /> {onboarding}
              </Col>
              <Col span={12}>
                <StatusBadge status="warning" /> {onLeave}
              </Col>
              <Col span={12}>
                <StatusBadge status="error" /> {employees.length - active - onboarding - onLeave}
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Provisioning jobs" loading={loading}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {provisioning.slice(0, 5).map((p) => (
                <li key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ fontWeight: 600 }}>{p.miniAppId} · {p.tenantId}</div>
                  <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-tertiary)' }}>
                    {p.state} · {formatRelative(p.startedAt)}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Hoạt động gần đây" loading={loading}>
            <Timeline
              items={audit.slice(0, 5).map((a) => ({
                id: a.id,
                actor: a.actor.name ?? a.actor.email,
                time: a.timestamp,
                action: a.action,
                subject: a.description,
              }))}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default DashboardPage;
