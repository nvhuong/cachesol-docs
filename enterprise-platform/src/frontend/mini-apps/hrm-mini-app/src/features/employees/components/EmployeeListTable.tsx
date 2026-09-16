import { useState } from 'react';
import { Table, Card, Input, Button, Space, Select, App } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader, ConfirmDialog } from '@cachesol/shared-ui';
import { useGetEmployees, useDeleteEmployee } from '../api/employeeApi';
import { useEmployeeColumns } from './EmployeeTable';
import { STATUS_LABELS } from '../utils/helpers';
import type { EmployeeSummary } from '../types/employee.types';

export const EmployeeListTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<EmployeeSummary | null>(null);

  const { data, isLoading, refetch } = useGetEmployees({
    page,
    size: pageSize,
    keyword: keyword || undefined,
    status,
  });

  const deleteMutation = useDeleteEmployee();

  const handleView = (employee: EmployeeSummary) => navigate(`/employees/${employee.id}`);
  const handleEdit = (employee: EmployeeSummary) => navigate(`/employees/${employee.id}/edit`);
  
  const handleDelete = (employee: EmployeeSummary) => {
    modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa nhân viên "${employee.fullName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(employee.id);
          message.success('Xóa nhân viên thành công');
        } catch {
          message.error('Xóa nhân viên thất bại');
        }
      },
    });
  };

  const columns = useEmployeeColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const employees = data?.data?.content || [];
  const total = data?.data?.totalElements || 0;

  return (
    <Card>
      <PageHeader
        title={t('employee.titleList')}
        subtitle={`Tổng ${total} nhân viên`}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/new')}
          >
            {t('common.create')}
          </Button>
        }
      />

      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Select
          placeholder="Trạng thái"
          value={status}
          onChange={setStatus}
          style={{ width: 150 }}
          allowClear
          options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
        />
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          Làm mới
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 1200 }}
        pagination={{
          current: page + 1,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`,
          onChange: (newPage, newSize) => {
            setPage(newPage - 1);
            if (newSize !== pageSize) setPageSize(newSize);
          },
        }}
      />
    </Card>
  );
};
