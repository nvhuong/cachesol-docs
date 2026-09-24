import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ListPage as DSListPage, Tag } from '@cachesol/design-system';
import { formatDateTime } from '@cachesol/shared-ui';
import { fetchMockAudit } from '../../api/mock-data';
import type { AuditEntry } from '../../types/provisioning.types';

const ACTION_COLOR: Record<string, 'success' | 'info' | 'warning' | 'error' | 'neutral' | 'default'> = {
  'employee.create': 'success',
  'employee.update': 'info',
  'employee.delete': 'error',
  'keycloak.sync': 'info',
  'role.assign': 'warning',
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

  return (
    <DSListPage
      title="Audit log"
      description={`${filtered.length} entries`}
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Audit' }]}
      toolbar={{
        searchPlaceholder: 'Tìm actor, description...',
        searchValue: keyword,
        onSearchChange: setKeyword,
      }}
      loading={loading}
      hasData={filtered.length > 0}
      emptyType="no-results"
      emptyTitle="Không có entries"
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
            render: (a: string) => <Tag variant={ACTION_COLOR[a] ?? 'default'}>{a}</Tag>,
          },
          { title: 'Entity', dataIndex: 'entityType', render: (t: string, r) => <span>{t} <code style={{ fontSize: 12 }}>{r.entityId}</code></span> },
          { title: 'Description', dataIndex: 'description' },
          { title: 'IP', dataIndex: 'ip', render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
        ]}
      />
    </DSListPage>
  );
}

export default AuditLogPage;
