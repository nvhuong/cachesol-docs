import { useEffect, useState } from 'react';
import { Card, Table, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageHeader, Tag, LoadingState, EmptyState } from '@cachesol/design-system';
import { formatDateTime } from '@cachesol/shared-ui';
import { fetchMockAudit } from '../../api/mock-data';
import type { AuditEntry } from '../../types/admin.types';

const CATEGORY_COLOR: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default' | 'neutral'> = {
  'tenant.create': 'success',
  'tenant.update': 'info',
  'tenant.delete': 'error',
  'tenant.suspend': 'warning',
  'mini-app.publish': 'success',
  'mini-app.unpublish': 'error',
  'provider.update': 'info',
  'settings.update': 'neutral',
  'auth.login': 'default',
  'auth.logout': 'default',
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
    !keyword ||
    `${e.actor.email} ${e.description} ${e.subject.label}`.toLowerCase().includes(keyword.toLowerCase()),
  );

  if (loading) return <LoadingState shape="page" />;

  return (
    <>
      <PageHeader
        title="Audit log"
        description={`${filtered.length} / ${entries.length} entries`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Audit log' }]}
      />

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm actor, subject, description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ width: 320 }}
          />
        </Space>

        {filtered.length === 0 ? (
          <EmptyState type="no-results" title="Không có entries nào" />
        ) : (
          <Table<AuditEntry>
            rowKey="id"
            dataSource={filtered}
            pagination={{ pageSize: 20 }}
            columns={[
              {
                title: 'Time',
                dataIndex: 'timestamp',
                render: (v: string) => formatDateTime(v, 'DD/MM/YYYY HH:mm:ss'),
                width: 180,
              },
              {
                title: 'Actor',
                dataIndex: ['actor', 'email'],
                render: (_, r) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.actor.name ?? r.actor.email}</div>
                    <code style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                      {r.actor.email}
                    </code>
                  </div>
                ),
              },
              {
                title: 'Category',
                dataIndex: 'category',
                render: (c: string) => <Tag variant={CATEGORY_COLOR[c] ?? 'default'}>{c}</Tag>,
              },
              {
                title: 'Subject',
                render: (_, r) => (
                  <div>
                    <div>{r.subject.label}</div>
                    <code style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                      {r.subject.type} · {r.subject.id}
                    </code>
                  </div>
                ),
              },
              { title: 'Description', dataIndex: 'description' },
              {
                title: 'IP',
                dataIndex: 'ip',
                render: (v: string) => (
                  <code style={{ fontSize: 12, fontFamily: 'var(--font-family-mono)' }}>{v}</code>
                ),
              },
            ]}
          />
        )}
      </Card>
    </>
  );
}

export default AuditLogPage;
