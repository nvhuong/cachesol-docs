/**
 * TopNav — public landing navbar (logo + nav links + register/sign-in CTAs).
 */
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@cachesol/design-system';

export function TopNav() {
  const navigate = useNavigate();

  return (
    <nav className="cs-landing-nav" aria-label="Primary">
      <div className="cs-landing-nav__inner">
        <Link to="/" className="cs-landing-nav__brand">
          <span className="cs-landing-nav__brand-mark">CS</span>
          <span>CacheSol</span>
        </Link>

        <div className="cs-landing-nav__links">
          <a className="cs-landing-nav__link" href="#apps">Mini-apps</a>
          <a className="cs-landing-nav__link" href="#features">Tính năng</a>
          <a className="cs-landing-nav__link" href="#pricing">Bảng giá</a>
          <a className="cs-landing-nav__link" href="#docs">Tài liệu</a>
        </div>

        <div className="cs-landing-nav__cta">
          <Button variant="tertiary" size="md" onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/register')}>
            Dùng thử miễn phí
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
