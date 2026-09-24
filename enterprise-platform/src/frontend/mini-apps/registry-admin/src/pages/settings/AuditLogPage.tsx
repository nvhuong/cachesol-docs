import { useEffect, useState } from 'react';
import { Table } from 'antd';
import {
  ListPage as DSListPage,
  Tag,
} from '@cachesol/design-system';
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

  return (
    <DSListPage
      title="Audit log"
      description={`${filtered.length} / ${entries.length} entries`}
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Audit log' }]}
      toolbar={{
        searchPlaceholder: 'Tìm actor, subject, description...',
        searchValue: keyword,
        onSearchChange: setKeyword,
      }}
      loading={loading}
      hasData={filtered.length > 0}
      emptyType="no-results"
      emptyTitle="Không có entries nào"
      pagination={{
        page: 1,
        pageSize: 20,
        total: filtered.length,
        onChange: () => undefined,
      }}
    >
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
    </DSListPage>
  );
}

export default AuditLogPage;
