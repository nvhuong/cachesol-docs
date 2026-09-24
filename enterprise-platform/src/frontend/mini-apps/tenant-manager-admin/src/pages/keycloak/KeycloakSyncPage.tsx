import { Table, Tag, Space, App } from 'antd';
import { CloudSyncOutlined } from '@ant-design/icons';
import { ListPage as DSListPage, StatusBadge, KPI, Button } from '@cachesol/design-system';
import { formatDateTime, formatRelative } from '@cachesol/shared-ui';

interface SyncRecord {
  id: string;
  employeeCode: string;
  email: string;
  operation: 'create' | 'update' | 'delete' | 'sync';
  state: 'success' | 'failed' | 'pending';
  timestamp: string;
  message?: string;
}

const MOCK_SYNC: SyncRecord[] = [
  { id: 's1', employeeCode: 'EMP001', email: 'alice@acme.com', operation: 'sync', state: 'success', timestamp: '2025-09-22T08:00:00Z' },
  { id: 's2', employeeCode: 'EMP002', email: 'bob@acme.com', operation: 'sync', state: 'success', timestamp: '2025-09-22T08:00:01Z' },
  { id: 's3', employeeCode: 'EMP003', email: 'carol@acme.com', operation: 'update', state: 'success', timestamp: '2025-09-22T08:00:02Z' },
  { id: 's4', employeeCode: 'EMP005', email: 'eve@acme.com', operation: 'create', state: 'failed', timestamp: '2025-09-22T08:00:03Z', message: 'Email already exists in realm' },
  { id: 's5', employeeCode: 'EMP004', email: 'dave@acme.com', operation: 'sync', state: 'pending', timestamp: '2025-09-22T08:30:00Z' },
];

export function KeycloakSyncPage() {
  const { message } = App.useApp();

  const success = MOCK_SYNC.filter((s) => s.state === 'success').length;
  const failed = MOCK_SYNC.filter((s) => s.state === 'failed').length;

  return (
    <DSListPage
      title="Keycloak sync"
      description="Quản lý đồng bộ user từ Tenant Manager sang Keycloak realm"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Keycloak sync' }]}
      primaryAction={
        <Button
          variant="primary"
          icon={<CloudSyncOutlined />}
          onClick={() => message.loading({ content: 'Running full sync...', key: 'sync', duration: 0 })}
        >
          Run full sync
        </Button>
      }
      hasData
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        <KPI label="Last sync" value={formatRelative(MOCK_SYNC[0].timestamp)} comparison="employees → Keycloak" />
        <KPI label="Success rate" value={`${Math.round((success / MOCK_SYNC.length) * 100)}%`} comparison={`${success} of ${MOCK_SYNC.length}`} />
        <KPI label="Failed" value={failed} comparison="cần retry" />
      </div>

      <Table<SyncRecord>
        rowKey="id"
        dataSource={MOCK_SYNC}
        pagination={false}
        columns={[
          { title: 'Time', dataIndex: 'timestamp', render: (v: string) => formatDateTime(v), width: 180 },
          { title: 'Employee', dataIndex: 'employeeCode', render: (v: string, r) => <span><strong>{v}</strong> <code style={{ fontSize: 12 }}>{r.email}</code></span> },
          {
            title: 'Operation',
            dataIndex: 'operation',
            render: (op: string) => <Tag color={op === 'create' ? 'green' : op === 'update' ? 'blue' : op === 'delete' ? 'red' : 'default'}>{op}</Tag>,
          },
          {
            title: 'State',
            dataIndex: 'state',
            render: (s: string) => <StatusBadge status={s === 'success' ? 'active' : s === 'pending' ? 'pending' : 'error'} />,
          },
          {
            title: 'Message',
            dataIndex: 'message',
            render: (v?: string) => v ? <span style={{ color: 'var(--color-status-error-text)' }}>{v}</span> : <span style={{ color: 'var(--color-text-disabled)' }}>—</span>,
          },
        ]}
      />
    </DSListPage>
  );
}

export default KeycloakSyncPage;
