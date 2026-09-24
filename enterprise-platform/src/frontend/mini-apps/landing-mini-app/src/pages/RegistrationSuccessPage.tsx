import { useLocation, Link } from 'react-router-dom';
import { Result, Descriptions } from 'antd';
import { Typography } from '@cachesol/design-system';
import { Button, DataCard } from '@cachesol/design-system';

const { Title } = Typography;

export function RegistrationSuccessPage() {
  const location = useLocation();
  const state = location.state as { tenantId: string; tenantSlug: string; adminUrl: string; contactEmail: string; provisioningEta?: string } | null;

  if (!state) {
    return (
      <main className="cs-landing">
        <div className="cs-landing__container" style={{ maxWidth: 720, paddingTop: 80 }}>
          <Result
            status="info"
            title="Đăng ký thành công"
            subTitle="Bạn đã đăng ký thành công. Vui lòng kiểm tra email để xem thông tin tenant."
            extra={
              <Link to="/">
                <Button variant="primary">Về trang chủ</Button>
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="cs-landing">
      <div className="cs-landing__container" style={{ maxWidth: 720 }}>
        <DataCard>
          <Result
            status="success"
            title="Tenant đã được tạo!"
            subTitle={`Thời gian khởi tạo ước tính: ${state.provisioningEta}`}
            extra={
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  variant="primary"
                  onClick={() => window.open(state.adminUrl, '_blank')}
                >
                  Mở admin console
                </Button>
                <Link to="/">
                  <Button variant="tertiary">Về trang chủ</Button>
                </Link>
              </div>
            }
          />

          <Descriptions column={1} bordered size="small" style={{ marginTop: 24 }}>
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

          <Title level={5} style={{ marginTop: 24 }}>
            Bước tiếp theo
          </Title>
          <ol style={{ paddingLeft: 20 }}>
            <li>Kiểm tra email để xác nhận và nhận link setup.</li>
            <li>Đặt mật khẩu cho tài khoản admin.</li>
            <li>Đăng nhập vào admin console.</li>
            <li>Mời thành viên đầu tiên vào team.</li>
          </ol>
        </DataCard>
      </div>
    </main>
  );
}

export default RegistrationSuccessPage;
