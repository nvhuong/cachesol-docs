/**
 * HeroSection — landing page hero (gradient bg + SVG illustration + CTAs + stats).
 */
import { useNavigate } from 'react-router-dom';
import { Button } from '@cachesol/design-system';
import { HeroIllustration } from '../components/HeroIllustration';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="cs-landing-hero">
      <div className="cs-landing-hero__inner">
        <div className="cs-landing-hero__content">
          <span className="cs-landing-hero__eyebrow">
            <span className="cs-landing-hero__eyebrow-dot" aria-hidden />
            Phiên bản v2.0 · Đã ra mắt
          </span>

          <h1 className="cs-landing-hero__title">
            Nền tảng{' '}
            <span className="cs-landing-hero__title-gradient">quản trị doanh nghiệp</span>{' '}
            thế hệ mới
          </h1>

          <p className="cs-landing-hero__desc">
            Khởi tạo tenant chỉ trong vài phút. Kích hoạt các mini-app HRM, Sales, Finance,
            Operations theo nhu cầu. Đa tenant + SSO Keycloak + audit + API sẵn sàng tích hợp.
          </p>

          <div className="cs-landing-hero__cta-row">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Bắt đầu miễn phí 14 ngày →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('apps');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Xem các mini-app
            </Button>
          </div>

          <div className="cs-landing-hero__stats">
            <div>
              <div className="cs-landing-hero__stat-value">500+</div>
              <div className="cs-landing-hero__stat-label">Doanh nghiệp</div>
            </div>
            <div>
              <div className="cs-landing-hero__stat-value">99.99%</div>
              <div className="cs-landing-hero__stat-label">Uptime SLA</div>
            </div>
            <div>
              <div className="cs-landing-hero__stat-value">6</div>
              <div className="cs-landing-hero__stat-label">Mini-app tích hợp</div>
            </div>
          </div>
        </div>

        <div className="cs-landing-hero__art">
          <HeroIllustration className="cs-landing-hero__art-svg" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
