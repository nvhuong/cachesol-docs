import { useEffect, useState } from 'react';
import { Card, Table, Tag, Tree } from 'antd';
import { ClusterOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { PageHeader, LoadingState, EmptyState } from '@cachesol/design-system';
import { fetchMockOrgs } from '../../api/mock-data';
import type { Organization } from '../../types/organization.types';

interface OrgNode {
  key: string;
  title: string;
  icon?: React.ReactNode;
  children?: OrgNode[];
  data: Organization;
}

const TYPE_ICON: Record<Organization['type'], React.ReactNode> = {
  company: <ClusterOutlined />,
  department: <TeamOutlined />,
  team: <TeamOutlined />,
  location: <EnvironmentOutlined />,
};

function buildTree(orgs: Organization[]): OrgNode[] {
  const byParent = new Map<string | undefined, Organization[]>();
  orgs.forEach((o) => {
    const arr = byParent.get(o.parentId) ?? [];
    arr.push(o);
    byParent.set(o.parentId, arr);
  });

  const make = (parentId?: string): OrgNode[] =>
    (byParent.get(parentId) ?? []).map((o) => ({
      key: o.id,
      title: `${o.name} (${o.employeeCount})`,
      icon: TYPE_ICON[o.type],
      children: make(o.id),
      data: o,
    }));

  return make(undefined);
}

export function OrganizationsListPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockOrgs().then((res) => {
      setOrgs(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState shape="page" />;

  const tree = buildTree(orgs);

  return (
    <>
      <PageHeader
        title="Organizations"
        description={`${orgs.length} org units`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Organizations' }]}
      />

      <Card title="Org tree">
        {tree.length === 0 ? (
          <EmptyState type="no-data" title="Chưa có organization nào" />
        ) : (
          <Tree<OrgNode>
            treeData={tree}
            defaultExpandAll
            showIcon
            blockNode
          />
        )}
      </Card>

      <Card title="Tất cả organizations" style={{ marginTop: 16 }}>
        <Table<Organization>
          rowKey="id"
          dataSource={orgs}
          pagination={false}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              render: (_, r) => (
                <span>
                  <Tag color={r.type === 'company' ? 'blue' : r.type === 'location' ? 'green' : 'default'}>
                    {r.type}
                  </Tag>{' '}
                  <strong>{r.name}</strong>{' '}
                  <code style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>{r.code}</code>
                </span>
              ),
            },
            { title: 'Employees', dataIndex: 'employeeCount', align: 'right' },
            {
              title: 'Active',
              dataIndex: 'active',
              render: (v: boolean) => v ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
            },
          ]}
        />
      </Card>
    </>
  );
}

export default OrganizationsListPage;
