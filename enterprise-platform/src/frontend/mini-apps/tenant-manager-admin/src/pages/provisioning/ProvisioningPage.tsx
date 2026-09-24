import { useEffect, useState } from 'react';
import { Table, Tag, Space, App } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ListPage as DSListPage, StatusBadge, Button } from '@cachesol/design-system';
import { formatDateTime, formatRelative } from '@cachesol/shared-ui';
import { fetchMockProvisioning } from '../../api/mock-data';
import type { ProvisioningJob } from '../../types/provisioning.types';

const STATE_COLOR: Record<string, string> = {
  completed: 'success',
  'in-progress': 'processing',
  requested: 'warning',
  failed: 'error',
  'rolled-back': 'default',
};

export function ProvisioningPage() {
  const { message } = App.useApp();
  const [jobs, setJobs] = useState<ProvisioningJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockProvisioning().then((res) => {
      setJobs(res);
      setLoading(false);
    });
  }, []);

  const retry = (j: ProvisioningJob) => {
    message.loading({ content: `Retrying ${j.miniAppId} for ${j.tenantId}...`, key: 'retry', duration: 0 });
    setTimeout(() => {
      message.success({ content: 'Retry queued', key: 'retry' });
      setJobs((prev) =>
        prev.map((p) =>
          p.id === j.id ? { ...p, state: 'in-progress', progress: 0, attempts: p.attempts + 1, errorMessage: undefined } : p,
        ),
      );
    }, 1000);
  };

  return (
    <DSListPage
      title="Provisioning"
      description="Trạng thái provision mini-apps cho tenants"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Provisioning' }]}
      loading={loading}
      hasData={jobs.length > 0}
      emptyType="no-data"
      emptyTitle="Chưa có provisioning job nào"
      pagination={{
        page: 1,
        pageSize: 20,
        total: jobs.length,
        onChange: () => undefined,
      }}
    >
      <Table<ProvisioningJob>
        rowKey="id"
        dataSource={jobs}
        pagination={{ pageSize: 20 }}
        columns={[
          {
            title: 'Tenant',
            dataIndex: 'tenantId',
            render: (v: string) => <code>{v}</code>,
          },
          {
            title: 'Mini-app',
            dataIndex: 'miniAppId',
            render: (v: string) => <Tag color="blue">{v}</Tag>,
          },
          {
            title: 'State',
            dataIndex: 'state',
            render: (s: string) => (
              <Space>
                <StatusBadge status={s as any} />
                <Tag color={STATE_COLOR[s]}>{s}</Tag>
              </Space>
            ),
          },
          {
            title: 'Progress',
            dataIndex: 'progress',
            render: (p?: number) =>
              p == null ? (
                <span style={{ color: 'var(--color-text-disabled)' }}>—</span>
              ) : (
                <span>{p}%</span>
              ),
          },
          {
            title: 'Attempts',
            dataIndex: 'attempts',
            align: 'right',
          },
          {
            title: 'Started',
            dataIndex: 'startedAt',
            render: (v: string) => formatRelative(v),
          },
          {
            title: 'Finished',
            dataIndex: 'finishedAt',
            render: (v?: string) => (v ? formatDateTime(v, 'DD/MM HH:mm:ss') : '—'),
          },
          {
            title: '',
            key: 'actions',
            render: (_, r) =>
              r.state === 'failed' ? (
                <Button variant="tertiary" size="sm" icon={<ReloadOutlined />} onClick={() => retry(r)}>
                  Retry
                </Button>
              ) : null,
          },
        ]}
      />
    </DSListPage>
  );
}

export default ProvisioningPage;
