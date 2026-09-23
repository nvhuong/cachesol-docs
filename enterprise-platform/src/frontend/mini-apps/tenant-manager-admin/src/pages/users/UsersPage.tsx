import { Card, Table, Tag, Avatar, Space } from 'antd';
import { PageHeader } from '@cachesol/design-system';
import { formatDateTime, formatRelative } from '@cachesol/shared-ui';

interface AppUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  enabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

const MOCK_USERS: AppUser[] = [
  { id: 'u1', email: 'admin@acme.com', fullName: 'Alice Nguyễn', roles: ['tenant_admin'], enabled: true, emailVerified: true, createdAt: '2024-06-01', lastLoginAt: '2025-09-22T08:14:00Z' },
  { id: 'u2', email: 'manager.sales@acme.com', fullName: 'Mai Trần', roles: ['sales_manager'], enabled: true, emailVerified: true, createdAt: '2024-08-15', lastLoginAt: '2025-09-21T17:00:00Z' },
  { id: 'u3', email: 'hr@acme.com', fullName: 'Hương Lê', roles: ['hr_manager'], enabled: true, emailVerified: true, createdAt: '2024-09-01', lastLoginAt: '2025-09-20T10:30:00Z' },
  { id: 'u4', email: 'finance@acme.com', fullName: 'Phong Phạm', roles: ['finance_officer'], enabled: true, emailVerified: true, createdAt: '2024-12-01', lastLoginAt: '2025-09-19T14:00:00Z' },
  { id: 'u5', email: 'old.employee@acme.com', fullName: 'Cựu Nhân Viên', roles: ['employee'], enabled: false, emailVerified: true, createdAt: '2023-01-15' },
];

function getInitials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function UsersPage() {
  return (
    <>
      <PageHeader
        title="App users"
        description={`${MOCK_USERS.length} users trong Keycloak realm`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'App users' }]}
      />

      <Card>
        <Table<AppUser>
          rowKey="id"
          dataSource={MOCK_USERS}
          pagination={false}
          columns={[
            {
              title: 'User',
              dataIndex: 'email',
              render: (_, r) => (
                <Space>
                  <Avatar style={{ backgroundColor: 'var(--color-brand-600)' }}>{getInitials(r.fullName)}</Avatar>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.fullName}</div>
                    <code style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{r.email}</code>
                  </div>
                </Space>
              ),
            },
            {
              title: 'Roles',
              dataIndex: 'roles',
              render: (roles: string[]) => (
                <Space wrap>{roles.map((r) => <Tag color="blue" key={r}>{r}</Tag>)}</Space>
              ),
            },
            {
              title: 'Status',
              dataIndex: 'enabled',
              render: (_, r) =>
                r.enabled ? (
                  <Tag color="green">Enabled</Tag>
                ) : (
                  <Tag color="red">Disabled</Tag>
                ),
            },
            {
              title: 'Email',
              dataIndex: 'emailVerified',
              render: (v: boolean) => (v ? <Tag color="green">Verified</Tag> : <Tag color="orange">Unverified</Tag>),
            },
            {
              title: 'Last login',
              dataIndex: 'lastLoginAt',
              render: (v?: string) => (v ? <span title={formatDateTime(v)}>{formatRelative(v)}</span> : '—'),
            },
          ]}
        />
      </Card>
    </>
  );
}

export default UsersPage;
