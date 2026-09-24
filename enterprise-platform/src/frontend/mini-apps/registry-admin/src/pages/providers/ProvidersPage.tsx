import { useEffect, useState } from 'react';
import { Table, Tag, Switch, App } from 'antd';
import { ListPage as DSListPage } from '@cachesol/design-system';
import { formatRelative } from '@cachesol/shared-ui';
import { fetchMockProviders } from '../../api/mock-data';
import type { ProviderConfig } from '../../types/admin.types';

const KIND_COLORS: Record<string, string> = {
  keycloak: 'blue',
  stripe: 'purple',
  sendgrid: 'cyan',
  vnpay: 'red',
  momo: 'magenta',
  webhook: 'default',
};

export function ProvidersPage() {
  const { message } = App.useApp();
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockProviders().then((res) => {
      setProviders(res);
      setLoading(false);
    });
  }, []);

  const toggleEnabled = (p: ProviderConfig) => {
    setProviders((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, enabled: !x.enabled } : x)),
    );
    message.success(`${p.name}: ${!p.enabled ? 'enabled' : 'disabled'} (mock)`);
  };

  return (
    <DSListPage
      title="Providers"
      description="Quản lý SSO, payment, email và webhook providers"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Providers' }]}
      loading={loading}
      hasData={providers.length > 0}
      emptyType="no-data"
      emptyTitle="Chưa có provider nào"
    >
      <Table<ProviderConfig>
        rowKey="id"
        dataSource={providers}
        pagination={false}
        columns={[
          {
            title: 'Provider',
            dataIndex: 'name',
            render: (_, r) => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <code style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{r.id}</code>
              </div>
            ),
          },
          {
            title: 'Kind',
            dataIndex: 'kind',
            render: (k: string) => <Tag color={KIND_COLORS[k]}>{k}</Tag>,
          },
          {
            title: 'Base URL',
            dataIndex: 'baseUrl',
            render: (v?: string) =>
              v ? <code style={{ fontSize: 12 }}>{v}</code> : <span style={{ color: 'var(--color-text-disabled)' }}>—</span>,
          },
          {
            title: 'Secrets',
            dataIndex: 'hasSecrets',
            align: 'center',
            render: (v: boolean) =>
              v ? <Tag color="green">Configured</Tag> : <Tag>Missing</Tag>,
          },
          {
            title: 'Enabled',
            dataIndex: 'enabled',
            render: (_, r) => (
              <Switch checked={r.enabled} onChange={() => toggleEnabled(r)} />
            ),
          },
          {
            title: 'Updated',
            dataIndex: 'updatedAt',
            render: (v: string) => formatRelative(v),
          },
        ]}
      />
    </DSListPage>
  );
}

export default ProvidersPage;
