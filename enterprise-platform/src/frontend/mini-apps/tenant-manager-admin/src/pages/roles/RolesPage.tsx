import { Card, Table, Tag, Space, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader, Button } from '@cachesol/design-system';

interface Role {
  id: string;
  name: string;
  description: string;
  scopes: string[];
  userCount: number;
  builtIn: boolean;
}

const MOCK_ROLES: Role[] = [
  { id: 'r1', name: 'tenant_admin', description: 'Full access to tenant admin', scopes: ['*'], userCount: 3, builtIn: true },
  { id: 'r2', name: 'hr_manager', description: 'Manage employees + HRM', scopes: ['org:read', 'org:write', 'employee:read', 'employee:write'], userCount: 5, builtIn: false },
  { id: 'r3', name: 'sales_manager', description: 'Manage sales + CRM', scopes: ['sales:read', 'sales:write'], userCount: 4, builtIn: false },
  { id: 'r4', name: 'finance_officer', description: 'Manage finance', scopes: ['finance:read', 'finance:write'], userCount: 2, builtIn: false },
  { id: 'r5', name: 'employee', description: 'Standard employee access', scopes: ['profile:read', 'profile:write'], userCount: 142, builtIn: true },
];

export function RolesPage() {
  const { message } = App.useApp();

  return (
    <>
      <PageHeader
        title="Roles & permissions"
        description={`${MOCK_ROLES.length} roles`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Roles' }]}
        actions={
          <Button
            variant="primary"
            icon={<PlusOutlined />}
            onClick={() => message.info('Open role builder modal (TODO)')}
          >
            New role
          </Button>
        }
      />

      <Card>
        <Table<Role>
          rowKey="id"
          dataSource={MOCK_ROLES}
          pagination={false}
          columns={[
            {
              title: 'Role',
              dataIndex: 'name',
              render: (v: string, r) => (
                <Space direction="vertical" size={0}>
                  <strong><code>{v}</code></strong>
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{r.description}</span>
                </Space>
              ),
            },
            {
              title: 'Scopes',
              dataIndex: 'scopes',
              render: (scopes: string[]) => (
                <Space wrap>
                  {scopes.length > 4 ? (
                    <>
                      {scopes.slice(0, 3).map((s) => (<Tag key={s}>{s}</Tag>))}
                      <Tag>+{scopes.length - 3}</Tag>
                    </>
                  ) : scopes.map((s) => (<Tag key={s}>{s}</Tag>))}
                </Space>
              ),
            },
            { title: 'Users', dataIndex: 'userCount', align: 'right' },
            {
              title: 'Type',
              dataIndex: 'builtIn',
              render: (v: boolean) => v ? <Tag color="blue">Built-in</Tag> : <Tag color="purple">Custom</Tag>,
            },
          ]}
        />
      </Card>
    </>
  );
}

export default RolesPage;
