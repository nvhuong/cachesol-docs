import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Input, Space, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { StatusBadge, PageHeader, LoadingState, EmptyState } from '@cachesol/design-system';
import { formatDate, formatNumber } from '@cachesol/shared-ui';
import { fetchMockTenants } from '../../api/mock-data';
import type { Tenant } from '../../types/tenant.types';

export function TenantsListPage() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchMockTenants().then((res) => {
      setTenants(res);
      setLoading(false);
    });
  }, []);

  const filtered = tenants.filter((t) => {
    if (keyword && !`${t.name} ${t.slug} ${t.contactEmail}`.toLowerCase().includes(keyword.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) return <LoadingState shape="page" />;

  return (
    <>
      <PageHeader
        title="Tenants"
        description={`${formatNumber(filtered.length)} / ${formatNumber(tenants.length)} tenants`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tenants' }]}
      />

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm theo tên, slug, email..."
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 280 }}
          />
        </Space>

        {filtered.length === 0 ? (
          <EmptyState
            type="no-results"
            title="Không có tenant nào khớp"
            description="Thử thay đổi từ khóa hoặc bộ lọc."
          />
        ) : (
          <Table<Tenant>
            rowKey="id"
            dataSource={filtered}
            pagination={{ pageSize: 20, showSizeChanger: true }}
            onRow={(record) => ({
              onClick: () => navigate(`/tenants/${record.id}`),
              style: { cursor: 'pointer' },
            })}
            columns={[
              {
                title: 'Tenant',
                dataIndex: 'name',
                render: (_, r) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <code style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{r.slug}</code>
                  </div>
                ),
              },
              { title: 'MST', dataIndex: 'taxCode' },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (s: string) => <StatusBadge status={s as never} />,
              },
              { title: 'Plan', dataIndex: 'plan', render: (p) => p.toUpperCase() },
              { title: 'Seats', dataIndex: 'seats', align: 'right' },
              { title: 'Mini-apps', align: 'right', render: (_, r) => r.enabledMiniApps.length },
              {
                title: 'Last activity',
                dataIndex: 'lastActivityAt',
                render: (v?: string) => (v ? formatDate(v, 'DD/MM/YYYY HH:mm') : '—'),
              },
              {
                title: 'Created',
                dataIndex: 'createdAt',
                render: (v: string) => formatDate(v, 'DD/MM/YYYY'),
              },
            ]}
          />
        )}
      </Card>
    </>
  );
}

export default TenantsListPage;
