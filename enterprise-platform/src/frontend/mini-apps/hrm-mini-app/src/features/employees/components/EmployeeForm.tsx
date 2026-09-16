import { Form, Input, Row, Col, DatePicker, Select, Button, Divider, Alert, App } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@cachesol/shared-ui';
import { useEmployeeForm } from '../hooks/useEmployeeForm';
import { GENDER_LABELS, EMPLOYMENT_TYPE_LABELS } from '../utils/helpers';
import type { Employee } from '../types/employee.types';

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: () => void;
}

export const EmployeeForm = ({ employee, onSuccess }: EmployeeFormProps) => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { form, isLoading, error, isEditMode, onSubmit } = useEmployeeForm(employee);

  const handleSuccess = async () => {
    const result = await onSubmit();
    if (result) {
      message.success(isEditMode ? 'Cập nhật thành công' : 'Tạo nhân viên thành công');
      onSuccess?.();
    }
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/employees');
    }
  };

  return (
    <div>
      <PageHeader
        title={isEditMode ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}
        onBack={handleCancel}
      />

      {error && (
        <Alert 
          message="Lỗi" 
          description={error} 
          type="error" 
          showIcon 
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical" onFinish={handleSuccess} form={form.control}>
        <Divider orientation="left">Thông tin cơ bản</Divider>
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="employeeCode" label="Mã nhân viên" rules={[{ required: true }]}>
              <Input disabled={isEditMode} placeholder="VD: EMP001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="email@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="lastName" label="Họ" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="firstName" label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dateOfBirth" label="Ngày sinh">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="gender" label="Giới tính">
              <Select
                allowClear
                options={Object.entries(GENDER_LABELS).map(([value, label]) => ({ value, label }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="nationalId" label="CMND/CCCD">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="taxCode" label="Mã số thuế">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Thông tin công việc</Divider>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="dateOfJoining" label="Ngày vào làm" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="dateOfProbationEnd" label="Ngày hết thử việc">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="employmentType" label="Loại hợp đồng" rules={[{ required: true }]}>
              <Select
                options={Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Địa chỉ</Divider>

        <Form.Item name="currentAddress" label="Địa chỉ hiện tại">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name="permanentAddress" label="Địa chỉ thường trú">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={handleCancel} icon={<CloseOutlined />}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading} icon={<SaveOutlined />}>
            {isEditMode ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </Form>
    </div>
  );
};
