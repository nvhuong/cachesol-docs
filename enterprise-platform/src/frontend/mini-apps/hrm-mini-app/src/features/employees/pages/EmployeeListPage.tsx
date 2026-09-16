import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EmployeeListTable } from '../components/EmployeeListTable';

export const EmployeeListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <EmployeeListTable />
    </div>
  );
};

export default EmployeeListPage;
