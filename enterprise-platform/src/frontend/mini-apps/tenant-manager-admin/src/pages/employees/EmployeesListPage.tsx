import { useEffect, useState } from 'react';
import { Card, Input, Space, Table, Tag, Avatar, Switch, App } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import {
  PageHeader,
  StatusBadge,
  LoadingState,
  EmptyState,
  Button,
} from '@cachesol/design-system';
import { formatDate } from '@cachesol/shared-ui';
import { fetchMockEmployees } from '../../api/mock-data';
import type { Employee } from '../../types/employee.types';

const STATUS_COLOR: Record<string, string> = {
  active: 'green',
  onboarding: 'blue',
  'on-leave': 'orange',
  probation: 'gold',
  terminated: 'red',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function EmployeesListPage() {
  const { message } = App.useApp();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchMockEmployees().then((res) => {
      setEmployees(res);
      setLoading(false);
    });
  }, []);

  const filtered = employees.filter((e) =>
    !keyword ||
    `${e.fullName} ${e.email} ${e.employeeCode}`.toLowerCase().includes(keyword.toLowerCase()),
  );

  if (loading) return <LoadingState shape="page" />;

  const handleSync = (e: Employee) => {
    message.loading({ content: `Syncing ${e.email} to Keycloak...`, key: 'sync', duration: 0 });
    setTimeout(() => {
      message.success({ content: `Synced ${e.email}`, key: 'sync' });
      setEmployees((prev) =>
        prev.map((x) =>
          x.id === e.id
            ? { ...x, keycloakSynced: true, lastSyncedAt: new Date().toISOString() }
            : x,
        ),
      );
    }, 1200);
  };

  return (
    <>
      <PageHeader
        title="Employees"
        description={`${filtered.length}/${employees.length} employees`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Employees' }]}
      />

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm theo tên, email, mã NV..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ width: 320 }}
          />
        </Space>

        {filtered.length === 0 ? (
          <EmptyState type="no-results" title="Không có employee nào khớp" />
        ) : (
          <Table<Employee>
            rowKey="id"
            dataSource={filtered}
            pagination={{ pageSize: 20, showSizeChanger: true }}
            columns={[
              {
                title: 'Employee',
                dataIndex: 'fullName',
                render: (_, r) => (
                  <Space>
                    <Avatar style={{ backgroundColor: 'var(--color-brand-600)' }}>
                      {getInitials(r.fullName)}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.fullName}</div>
                      <code style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                        {r.employeeCode}
                      </code>
                    </div>
                  </Space>
                ),
              },
              { title: 'Email', dataIndex: 'email' },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (s: string) => <StatusBadge status={s as any} />,
              },
              {
                title: 'Employment',
                dataIndex: 'employmentType',
                render: (t: string) => <Tag>{t}</Tag>,
              },
              {
                title: 'Joined',
                dataIndex: 'dateOfJoining',
                render: (v: string) => formatDate(v, 'DD/MM/YYYY'),
              },
              {
                title: 'Keycloak',
                dataIndex: 'keycloakSynced',
                render: (_, r) =>
                  r.keycloakSynced ? (
                    <Tag color="green">Synced {r.lastSyncedAt ? formatDate(r.lastSyncedAt, 'DD/MM HH:mm') : ''}</Tag>
                  ) : (
                    <Tag color="orange">Not synced</Tag>
                  ),
              },
              {
                title: '',
                key: 'actions',
                render: (_, r) =>
                  r.keycloakSynced ? null : (
                    <Button
                      variant="tertiary"
                      size="sm"
                      icon={<SyncOutlined />}
                      onClick={() => handleSync(r)}
                    >
                      Sync
                    </Button>
                  ),
              },
            ]}
          />
        )}
      </Card>
    </>
  );
}

export default EmployeesListPage;
