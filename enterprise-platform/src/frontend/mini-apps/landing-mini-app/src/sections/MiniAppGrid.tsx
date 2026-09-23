import { Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Tag } from '@cachesol/design-system';
import { formatCurrency } from '@cachesol/shared-ui';
import type { PublicMiniApp } from '../types/miniapp-catalog.types';

interface Props {
  apps: PublicMiniApp[];
}

const CATEGORY_LABELS: Record<string, string> = {
  hr: 'HR',
  sales: 'Sales',
  finance: 'Finance',
  operations: 'Operations',
  analytics: 'Analytics',
  productivity: 'Productivity',
};

export function MiniAppGrid({ apps }: Props) {
  const navigate = useNavigate();

  return (
    <section id="apps" className="cs-landing-apps">
      <Row gutter={[24, 24]}>
        {apps.map((app) => (
          <Col xs={24} sm={12} md={8} key={app.id}>
            <article
              className="cs-landing-app-card"
              onClick={() => navigate(`/apps/${app.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/apps/${app.id}`);
              }}
              role="button"
              tabIndex={0}
            >
              <div className="cs-landing-app-card__head">
                <span className="cs-landing-app-card__icon">{app.name.charAt(0)}</span>
                <div>
                  <h3 className="cs-landing-app-card__name">{app.name}</h3>
                  <Tag variant="neutral">{CATEGORY_LABELS[app.category]}</Tag>
                </div>
              </div>
              <p className="cs-landing-app-card__tagline">{app.tagline}</p>
              <ul className="cs-landing-app-card__features">
                {app.features.slice(0, 3).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="cs-landing-app-card__footer">
                <span className="cs-landing-app-card__price">
                  {app.pricing === 'free'
                    ? 'Miễn phí'
                    : `${formatCurrency(app.pricePerMonth ?? 0, app.currency ?? 'VND')} / ${
                        app.pricing === 'per-user' ? 'user' : 'tháng'
                      }`}
                </span>
                <span className="cs-landing-app-card__cta">Xem chi tiết →</span>
              </div>
            </article>
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default MiniAppGrid;
