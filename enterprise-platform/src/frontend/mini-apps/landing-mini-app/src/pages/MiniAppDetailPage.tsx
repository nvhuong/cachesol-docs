import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Space, Row, Col } from 'antd';
import { Button, Tag, LoadingState, EmptyState } from '@cachesol/design-system';
import { formatCurrency, formatDate } from '@cachesol/shared-ui';
import { fetchMockApp } from '../api/mock-catalog';
import type { PublicMiniApp } from '../types/miniapp-catalog.types';

const { Title, Paragraph } = Typography;

export function MiniAppDetailPage() {
  const { appId } = useParams<{ appId: string }>();
  const [app, setApp] = useState<PublicMiniApp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appId) return;
    fetchMockApp(appId).then((res) => {
      setApp(res);
      setLoading(false);
    });
  }, [appId]);

  if (loading) {
    return <LoadingState shape="page" label="Đang tải..." />;
  }

  if (!app) {
    return (
      <div className="cs-landing__container">
        <EmptyState
          type="not-found"
          title="Không tìm thấy mini-app"
          description={`Mini-app '${appId}' không tồn tại hoặc đã bị gỡ.`}
          action={
            <Link to="/">
              <Button variant="primary">Về trang chủ</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <main className="cs-landing cs-landing-detail">
      <div className="cs-landing__container">
        <Row gutter={[40, 40]}>
          <Col xs={24} md={14}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Tag variant="info">{app.category.toUpperCase()}</Tag>
              <Title level={1} style={{ margin: 0 }}>
                {app.name}
              </Title>
              <Paragraph style={{ fontSize: 'var(--font-size-heading-sm)' }}>
                {app.tagline}
              </Paragraph>
              <Paragraph>{app.description}</Paragraph>

              <div>
                <Title level={4}>Tính năng nổi bật</Title>
                <ul style={{ paddingLeft: 20 }}>
                  {app.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </Space>
          </Col>

          <Col xs={24} md={10}>
            <aside className="cs-landing-detail__buybox">
              <Title level={3} style={{ margin: 0 }}>
                {app.pricing === 'free'
                  ? 'Miễn phí'
                  : `${formatCurrency(app.pricePerMonth ?? 0, app.currency ?? 'VND')} / ${
                      app.pricing === 'per-user' ? 'người / tháng' : 'tháng'
                    }`}
              </Title>
              {app.minSeats != null && (
                <Paragraph type="secondary">Tối thiểu {app.minSeats} người dùng</Paragraph>
              )}

              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Link to={`/register?apps=${app.id}`}>
                  <Button variant="primary" size="lg" block>
                    Đăng ký dùng {app.name}
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="tertiary" block>
                    Xem các mini-app khác
                  </Button>
                </Link>
              </Space>

              <div className="cs-landing-detail__meta">
                <div>
                  <span>Nhà phát triển</span>
                  <strong>{app.publisherName}</strong>
                </div>
                <div>
                  <span>Phát hành</span>
                  <strong>{formatDate(app.publishedAt, 'DD MMM YYYY')}</strong>
                </div>
              </div>
            </aside>
          </Col>
        </Row>
      </div>
    </main>
  );
}

export default MiniAppDetailPage;
