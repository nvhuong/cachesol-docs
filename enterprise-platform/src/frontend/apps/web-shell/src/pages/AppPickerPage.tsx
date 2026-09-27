/**
 * App Picker — shown after login at /dashboard.
 * Displays a grid of mini-apps the user has access to.
 * Clicking a card navigates to that mini-app's default route and sets it as active.
 */
import { Row, Col, Card, Typography, Button, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useMiniAppStore, getRoutePrefix } from '@/stores/miniAppStore';
import { PageHeader, resolveIcon } from '@cachesol/design-system';

const { Title, Paragraph, Text } = Typography;

interface AppCardProps {
  id: string;
  name: string;
  description?: string;
  icon: string;
  routePrefix: string;
  /** Short label for the icon badge */
  badgeLabel?: string;
}

function AppCard({ id, name, description, icon, routePrefix, badgeLabel }: AppCardProps) {
  const navigate = useNavigate();
  const { setActiveMiniApp } = useMiniAppStore();

  const handleOpen = () => {
    setActiveMiniApp(id);
    // Navigate to the mini-app's default route.
    navigate(`/${routePrefix}`);
  };

  return (
    <Card
      hoverable
      onClick={handleOpen}
      style={{
        borderRadius: 12,
        textAlign: 'center',
        height: '100%',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.15s',
      }}
      styles={{ body: { padding: 24 } }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#667eea',
        }}
      >
        {resolveIcon(icon)}
      </div>

      {badgeLabel && (
        <Badge
          count={badgeLabel}
          style={{ marginBottom: 8 }}
          size="small"
        />
      )}

      <Title level={5} style={{ marginBottom: 8 }}>
        {name}
      </Title>

      {description && (
        <Paragraph
          type="secondary"
          style={{ fontSize: 13, marginBottom: 16, minHeight: 36 }}
          ellipsis={{ rows: 2 }}
        >
          {description}
        </Paragraph>
      )}

      <Button type="primary" onClick={handleOpen}>
        Mở ứng dụng
      </Button>
    </Card>
  );
}

export const AppPickerPage = () => {
  const { user } = useAuthStore();
  const { miniApps } = useMiniAppStore();

  // Show only mini-apps with routePrefix (i.e. non-landing ones).
  // Landing is accessible at the root '/' when not authenticated.
  const appCards = miniApps.filter(
    (pkg) => pkg.manifest.routePrefix !== null
  );

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${user?.name ?? 'bạn'} 👋`}
        description="Chọn một ứng dụng để bắt đầu"
      />

      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        {appCards.map((pkg) => {
          const prefix = getRoutePrefix(pkg.manifest);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={pkg.manifest.id}>
              <AppCard
                id={pkg.manifest.id}
                name={pkg.manifest.name}
                description={pkg.manifest.description}
                icon={pkg.manifest.icon ?? 'appstore'}
                routePrefix={prefix ?? ''}
              />
            </Col>
          );
        })}

        {appCards.length === 0 && (
          <Col span={24}>
            <Text type="secondary">Không có ứng dụng nào được cài đặt cho tài khoản này.</Text>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AppPickerPage;
