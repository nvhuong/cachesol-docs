import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, App } from 'antd';
import { useGetEmployee } from '../api/employeeApi';
import { EmployeeForm } from '../components/EmployeeForm';

export const EmployeeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const isEditMode = !!id;

  const { data, isLoading, error } = useGetEmployee(id!, { enabled: isEditMode });

  useEffect(() => {
    if (error) {
      message.error('Không tìm thấy nhân viên');
      navigate('/employees');
    }
  }, [error, message, navigate]);

  if (isEditMode && isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <EmployeeForm 
      employee={data?.data} 
      onSuccess={() => navigate('/employees')} 
    />
  );
};

export default EmployeeFormPage;
