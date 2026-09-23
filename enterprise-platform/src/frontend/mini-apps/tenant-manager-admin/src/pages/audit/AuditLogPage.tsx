import { useEffect, useState } from 'react';
import { Card, Table, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageHeader, Tag, EmptyState, LoadingState } from '@cachesol/design-system';
import { formatDateTime } from '@cachesol/shared-ui';
import { fetchMockAudit } from '../../api/mock-data';
import type { AuditEntry } from '../../types/provisioning.types';

const ACTION_COLOR: Record<string, string> = {
  'employee.create': 'green',
  'employee.update': 'blue',
  'employee.delete': 'red',
  'keycloak.sync': 'cyan',
  'role.assign': 'purple',
};

export function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchMockAudit().then((res) => {
      setEntries(res);
      setLoading(false);
    });
  }, []);

  const filtered = entries.filter((e) =>
    !keyword || `${e.actor.email} ${e.description}`.toLowerCase().includes(keyword.toLowerCase()),
  );

  if (loading) return <LoadingState shape="page" />;

  return (
    <>
      <PageHeader
        title="Audit log"
        description={`${filtered.length} entries`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Audit' }]}
      />

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm actor, description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ width: 320 }}
          />
        </Space>

        {filtered.length === 0 ? (
          <EmptyState type="no-results" title="Không có entries" />
        ) : (
          <Table<AuditEntry>
            rowKey="id"
            dataSource={filtered}
            pagination={{ pageSize: 20 }}
            columns={[
              { title: 'Time', dataIndex: 'timestamp', render: (v: string) => formatDateTime(v), width: 180 },
              {
                title: 'Actor',
                render: (_, r) => (
                  <span><strong>{r.actor.name ?? r.actor.email}</strong> <code style={{ fontSize: 12 }}>{r.actor.email}</code></span>
                ),
              },
              {
                title: 'Action',
                dataIndex: 'action',
                render: (a: string) => <Tag color={ACTION_COLOR[a] ?? 'default'}>{a}</Tag>,
              },
              { title: 'Entity', dataIndex: 'entityType', render: (t: string, r) => <span>{t} <code style={{ fontSize: 12 }}>{r.entityId}</code></span> },
              { title: 'Description', dataIndex: 'description' },
              { title: 'IP', dataIndex: 'ip', render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
            ]}
          />
        )}
      </Card>
    </>
  );
}

export default AuditLogPage;
