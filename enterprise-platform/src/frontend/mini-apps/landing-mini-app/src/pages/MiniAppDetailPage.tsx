/**
 * MiniAppDetailPage — public detail page for a single mini-app.
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography } from '@cachesol/design-system';
import { Button, Tag, LoadingState, EmptyState } from '@cachesol/design-system';
import { formatCurrency, formatDate } from '@cachesol/shared-ui';
import { fetchApp } from '../api/catalog-api';
import type { PublicMiniApp } from '../types/miniapp-catalog.types';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

const { Title, Paragraph } = Typography;

export function MiniAppDetailPage() {
  const { appId } = useParams<{ appId: string }>();
  const [app, setApp] = useState<PublicMiniApp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appId) return;
    fetchApp(appId).then((res) => {
      setApp(res);
      setLoading(false);
    });
  }, [appId]);

  if (loading) {
    return (
      <div className="cs-landing">
        <TopNav />
        <LoadingState shape="page" label="Đang tải..." />
        <Footer />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="cs-landing">
        <TopNav />
        <main className="cs-landing-detail">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cs-landing">
      <TopNav />

      <main className="cs-landing-detail">
        <div className="cs-landing-detail__hero">
          <span
            className={`cs-landing-app-card__icon cs-landing-app-card__icon--${app.id}`}
            style={{ width: 64, height: 64, fontSize: 26 }}
          >
            {app.name.charAt(0)}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Tag variant="info">{app.category.toUpperCase()}</Tag>
            <Title level={1} style={{ margin: '8px 0 4px' }}>
              {app.name}
            </Title>
            <Paragraph type="secondary" style={{ fontSize: 'var(--font-size-heading-sm)', margin: 0 }}>
              {app.tagline}
            </Paragraph>
          </div>
        </div>

        <div className="cs-landing-detail__grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section>
              <Title level={3}>Mô tả</Title>
              <Paragraph style={{ fontSize: 'var(--font-size-body-lg)' }}>{app.description}</Paragraph>
            </section>

            <section>
              <Title level={3}>Tính năng nổi bật</Title>
              <ul
                style={{
                  padding: 0,
                  margin: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {app.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 16px',
                      background: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 12,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'var(--color-status-success-bg)',
                        color: 'var(--color-status-success-text)',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ fontSize: 15, color: 'var(--color-text-primary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="cs-landing-detail__buybox">
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                Giá
              </div>
              <Title level={2} style={{ margin: 0 }}>
                {app.pricing === 'free'
                  ? 'Miễn phí'
                  : `${formatCurrency(app.pricePerMonth ?? 0, app.currency ?? 'VND')}`}
              </Title>
              {app.pricing !== 'free' && (
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  /{app.pricing === 'per-user' ? 'người / tháng' : 'tháng'}
                </Paragraph>
              )}
            </div>

            {app.minSeats != null && (
              <div
                style={{
                  padding: '12px 14px',
                  background: 'var(--color-bg-brand-subtle)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: 'var(--color-status-info-text)',
                  fontWeight: 500,
                }}
              >
                Tối thiểu {app.minSeats} người dùng
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
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
            </div>

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
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MiniAppDetailPage;
