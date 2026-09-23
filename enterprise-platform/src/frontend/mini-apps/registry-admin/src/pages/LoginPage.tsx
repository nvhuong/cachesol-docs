import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Result } from 'antd';
import { Button } from '@cachesol/design-system';
import { usePlatformRegistryContext } from '../layout/PlatformRegistryContext';

const { Title, Paragraph } = Typography;

export function LoginPage() {
  const navigate = useNavigate();
  const ctx = usePlatformRegistryContext();

  // Auto-redirect nếu đã login
  useEffect(() => {
    if (ctx.user) navigate('/');
  }, [ctx.user, navigate]);

  const handleSignIn = () => {
    // Mock: trong production sẽ dùng Keycloak OAuth2 redirect
    ctx.login({ name: 'Platform Admin', email: 'admin@cachesol.io' });
    navigate('/');
  };

  return (
    <main className="cs-landing">
      <div
        className="cs-landing__container"
        style={{ maxWidth: 480, paddingTop: 80, paddingBottom: 80 }}
      >
        <Result
          icon={null}
          title={<Title level={2}>Platform Registry</Title>}
          subTitle={
            <Paragraph type="secondary">
              Đăng nhập qua Keycloak SSO để truy cập admin console.
            </Paragraph>
          }
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
