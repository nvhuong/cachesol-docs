/**
 * CtaBanner — dark CTA banner between highlights and footer.
 */
import { useNavigate } from 'react-router-dom';
import { Button } from '@cachesol/design-system';

export function CtaBanner() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="cs-landing-cta">
      <div className="cs-landing-cta__inner">
        <div className="cs-landing-cta__content">
          <h2 className="cs-landing-cta__title">
            Sẵn sàng đưa doanh nghiệp của bạn lên nền tảng CacheSol?
          </h2>
          <p className="cs-landing-cta__desc">
            Dùng thử miễn phí 14 ngày, không cần thẻ tín dụng. Đội ngũ của chúng tôi sẽ hỗ trợ
            bạn thiết lập và migrate dữ liệu trong 24 giờ.
          </p>
        </div>
        <div className="cs-landing-cta__actions">
          <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
            Đăng ký ngay
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
