/**
 * RegistrationSuccessPage — confirmation screen after tenant registration.
 */
import { useLocation, Link } from 'react-router-dom';
import { Descriptions } from 'antd';
import { Typography } from '@cachesol/design-system';
import { Button } from '@cachesol/design-system';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

const { Title } = Typography;

export function RegistrationSuccessPage() {
  const location = useLocation();
  const state = location.state as
    | {
        tenantId: string;
        tenantSlug: string;
        adminUrl: string;
        contactEmail: string;
        provisioningEta?: string;
      }
    | null;

  return (
    <div className="cs-landing">
      <TopNav />

      <main className="cs-landing-success">
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'var(--color-status-success-bg)',
            color: 'var(--color-status-success-text)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            boxShadow: '0 0 0 12px rgba(34, 197, 94, 0.10)',
          }}
          aria-hidden
        >
          ✓
        </div>

        <Title level={1} style={{ margin: 0 }}>
          Đăng ký thành công!
        </Title>
        <Typography.Paragraph
          type="secondary"
          style={{ maxWidth: 520, fontSize: 'var(--font-size-body-lg)' }}
        >
          {state?.provisioningEta
            ? `Thời gian khởi tạo ước tính: ${state.provisioningEta}`
            : 'Hệ thống đang khởi tạo tenant của bạn.'}
        </Typography.Paragraph>

        {state && (
          <div
            style={{
              width: '100%',
              maxWidth: 720,
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 16,
              padding: 32,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Descriptions column={1} bordered size="middle" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Tenant ID">
                <code>{state.tenantId}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Subdomain">
                <code>{state.tenantSlug}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Admin URL">
                <a href={state.adminUrl} target="_blank" rel="noreferrer">
                  {state.adminUrl}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Email liên hệ">
                {state.contactEmail}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 8 }}>
              Bước tiếp theo
            </Title>
            <ol style={{ paddingLeft: 20, color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              <li>Kiểm tra email để xác nhận và nhận link setup.</li>
              <li>Đặt mật khẩu cho tài khoản admin.</li>
              <li>Đăng nhập vào admin console.</li>
              <li>Mời thành viên đầu tiên vào team.</li>
            </ol>

            <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
              <Link to="/">
                <Button variant="tertiary">Về trang chủ</Button>
              </Link>
              <Button
                variant="primary"
                onClick={() => window.open(state.adminUrl, '_blank')}
              >
                Mở admin console
              </Button>
            </div>
          </div>
        )}

        {!state && (
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Link to="/">
              <Button variant="primary">Về trang chủ</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default RegistrationSuccessPage;
