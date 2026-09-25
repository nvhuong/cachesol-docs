/**
 * MiniAppGrid — responsive card grid for the mini-app catalog.
 */
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

const CATEGORY_TAG_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'neutral'> = {
  hr: 'info',
  sales: 'success',
  finance: 'warning',
  operations: 'neutral',
  analytics: 'info',
  productivity: 'neutral',
};

export function MiniAppGrid({ apps }: Props) {
  const navigate = useNavigate();

  return (
    <section id="apps" className="cs-landing-apps">
      {apps.map((app) => {
        const iconClass = `cs-landing-app-card__icon cs-landing-app-card__icon--${app.id}`;
        const tagVariant = CATEGORY_TAG_VARIANT[app.category] ?? 'neutral';
        return (
          <article
            key={app.id}
            className="cs-landing-app-card"
            onClick={() => navigate(`/apps/${app.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/apps/${app.id}`);
            }}
            role="button"
            tabIndex={0}
          >
            <div className="cs-landing-app-card__head">
              <span className={iconClass}>{app.name.charAt(0)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="cs-landing-app-card__name">{app.name}</h3>
                <Tag variant={tagVariant}>{CATEGORY_LABELS[app.category]}</Tag>
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
                  : formatCurrency(app.pricePerMonth ?? 0, app.currency ?? 'VND')}
                {app.pricing !== 'free' && (
                  <span className="cs-landing-app-card__price-tag">
                    /{app.pricing === 'per-user' ? 'user/tháng' : 'tháng'}
                  </span>
                )}
              </span>
              <span className="cs-landing-app-card__cta">Xem chi tiết →</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default MiniAppGrid;
