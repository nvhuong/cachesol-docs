import { Card, Table, Tag, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader, Button } from '@cachesol/design-system';
import { formatDate } from '@cachesol/shared-ui';

const MOCK_JOB_TITLES = [
  { id: 'jt1', code: 'CEO', name: 'Chief Executive Officer', level: 'C-Level', active: true, employees: 1, createdAt: '2024-01-01' },
  { id: 'jt2', code: 'CTO', name: 'Chief Technology Officer', level: 'C-Level', active: true, employees: 1, createdAt: '2024-01-01' },
  { id: 'jt3', code: 'MGR', name: 'Manager', level: 'Manager', active: true, employees: 12, createdAt: '2024-01-01' },
  { id: 'jt4', code: 'TLDR', name: 'Tech Lead', level: 'Senior IC', active: true, employees: 5, createdAt: '2024-01-01' },
  { id: 'jt5', code: 'SR_DEV', name: 'Senior Engineer', level: 'Senior IC', active: true, employees: 18, createdAt: '2024-01-01' },
  { id: 'jt6', code: 'JR_DEV', name: 'Junior Engineer', level: 'Junior IC', active: true, employees: 14, createdAt: '2024-01-01' },
  { id: 'jt7', code: 'INTERN', name: 'Intern', level: 'Trainee', active: true, employees: 4, createdAt: '2024-01-01' },
];

export function JobTitlesPage() {
  const { message } = App.useApp();

  return (
    <>
      <PageHeader
        title="Job titles"
        description={`${MOCK_JOB_TITLES.length} job titles`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Job titles' }]}
        actions={
          <Button
            variant="primary"
            icon={<PlusOutlined />}
            onClick={() => message.info('Open "New job title" modal (TODO)')}
          >
            New job title
          </Button>
        }
      />

      <Card>
        <Table
          rowKey="id"
          dataSource={MOCK_JOB_TITLES}
          pagination={false}
          columns={[
            { title: 'Code', dataIndex: 'code', render: (v: string) => <code>{v}</code> },
            { title: 'Title', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
            { title: 'Level', dataIndex: 'level', render: (v: string) => <Tag color="blue">{v}</Tag> },
            { title: 'Employees', dataIndex: 'employees', align: 'right' },
            {
              title: 'Active',
              dataIndex: 'active',
              render: (v: boolean) => v ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
            },
            {
              title: 'Created',
              dataIndex: 'createdAt',
              render: (v: string) => formatDate(v, 'DD/MM/YYYY'),
            },
          ]}
        />
      </Card>
    </>
  );
}

export default JobTitlesPage;
