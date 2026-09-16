import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Result, Button, Card, Avatar, Tag, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { PageHeader } from '@cachesol/shared-ui';
import { useGetEmployee } from '../api/employeeApi';
import { STATUS_COLORS, STATUS_LABELS, GENDER_LABELS, EMPLOYMENT_TYPE_LABELS, getInitials } from '../utils/helpers';

export const EmployeeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useGetEmployee(id!);
  const employee = data?.data;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <Result
        status="404"
        title="Không tìm thấy nhân viên"
        extra={
          <Button type="primary" onClick={() => navigate('/employees')}>
            Quay lại
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={employee.fullName}
        subtitle={employee.employeeCode}
        onBack={() => navigate('/employees')}
        extra={
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            Sửa
          </Button>
        }
      />

      <Card>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <Avatar 
            size={80} 
            src={employee.profileImageUrl}
            style={{ backgroundColor: '#1890ff', fontSize: 32 }}
          >
            {getInitials(employee.fullName)}
          </Avatar>
          <div>
            <h2 style={{ margin: 0 }}>{employee.fullName}</h2>
            <p style={{ color: '#8c8c8c', margin: 0 }}>{employee.email}</p>
            <div style={{ marginTop: 8 }}>
              <Tag color={STATUS_COLORS[employee.status]}>
                {STATUS_LABELS[employee.status]}
              </Tag>
              <Tag>{EMPLOYMENT_TYPE_LABELS[employee.employmentType]}</Tag>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          <div>
            <h3>Thông tin cá nhân</h3>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Họ tên">{employee.fullName}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {employee.gender ? GENDER_LABELS[employee.gender] : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{employee.dateOfBirth || '-'}</Descriptions.Item>
              <Descriptions.Item label="CMND/CCCD">{employee.nationalId || '-'}</Descriptions.Item>
              <Descriptions.Item label="Mã số thuế">{employee.taxCode || '-'}</Descriptions.Item>
            </Descriptions>
          </div>

          <div>
            <h3>Thông tin công việc</h3>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Phòng ban">{employee.department?.departmentName || '-'}</Descriptions.Item>
              <Descriptions.Item label="Chức vụ">{employee.position?.positionName || '-'}</Descriptions.Item>
              <Descriptions.Item label="Ngày vào làm">{employee.dateOfJoining}</Descriptions.Item>
              <Descriptions.Item label="Loại hợp đồng">
                {EMPLOYMENT_TYPE_LABELS[employee.employmentType]}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <h3>Liên lạc</h3>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{employee.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ hiện tại" span={2}>
                {employee.currentAddress || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ thường trú" span={2}>
                {employee.permanentAddress || '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDetailPage;
