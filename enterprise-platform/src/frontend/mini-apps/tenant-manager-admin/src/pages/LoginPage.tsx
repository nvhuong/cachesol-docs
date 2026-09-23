import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Result } from 'antd';
import { Button } from '@cachesol/design-system';
import { useTenantManager } from '../layout/TenantManagerContext';

const { Title, Paragraph } = Typography;

export function LoginPage() {
  const navigate = useNavigate();
  const ctx = useTenantManager();

  useEffect(() => {
    if (ctx.user) navigate('/');
  }, [ctx.user, navigate]);

  const handleSignIn = () => {
    ctx.login({
      name: 'Alice Nguyễn',
      email: 'alice@acme.com',
      tenantId: 'tnt_acme',
    });
    navigate('/');
  };

  return (
    <main className="cs-landing">
      <div className="cs-landing__container" style={{ maxWidth: 480, paddingTop: 80, paddingBottom: 80 }}>
        <Result
          icon={null}
          title={<Title level={2}>Tenant Manager Admin</Title>}
          subTitle={<Paragraph type="secondary">Đăng nhập qua tenant Keycloak realm để quản trị.</Paragraph>}
          extra={
            <Button variant="primary" size="lg" onClick={handleSignIn}>
              Sign in with Keycloak
            </Button>
          }
        />
      </div>
    </main>
  );
}

export default LoginPage;
