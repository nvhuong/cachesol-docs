import { Avatar, Tag, Button, Space, Dropdown, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { EmployeeSummary } from '../types/employee.types';
import { STATUS_COLORS, STATUS_LABELS, EMPLOYMENT_TYPE_LABELS, getInitials } from '../utils/helpers';

interface UseEmployeeColumnsOptions {
  onView?: (employee: EmployeeSummary) => void;
  onEdit?: (employee: EmployeeSummary) => void;
  onDelete?: (employee: EmployeeSummary) => void;
}

export function useEmployeeColumns(options?: UseEmployeeColumnsOptions) {
  const columns: ColumnsType<EmployeeSummary> = [
    {
      title: 'Nhân viên',
      key: 'employee',
      width: 280,
      fixed: 'left',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={record.profileImageUrl} style={{ backgroundColor: '#1890ff' }}>
            {getInitials(record.fullName)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.fullName}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              {record.employeeCode} • {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Phòng ban',
      dataIndex: 'departmentName',
      key: 'department',
      width: 150,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'positionName',
      key: 'position',
      width: 150,
    },
    {
      title: 'Loại hợp đồng',
      dataIndex: 'employmentType',
      key: 'employmentType',
      width: 130,
      render: (type) => EMPLOYMENT_TYPE_LABELS[type as keyof typeof EMPLOYMENT_TYPE_LABELS],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => (
        <Tag color={STATUS_COLORS[status as keyof typeof STATUS_COLORS]}>
          {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => options?.onView?.(record)} />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => options?.onEdit?.(record)} />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'delete',
                  label: 'Xóa',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => options?.onDelete?.(record),
                },
              ],
            }}
          >
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return columns;
}
