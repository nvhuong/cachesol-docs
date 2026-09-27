/**
 * TopNav — public landing navbar (logo + nav links + register/sign-in CTAs).
 */
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@cachesol/design-system';

/**
 * In-page anchor links. When we are already on the home page, scroll smoothly to
 * the section; otherwise navigate to `/#anchor` so React Router takes us there
 * and the browser handles the anchor scroll after mount.
 */
function NavAnchor({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return; // let the <Link to> handle navigation
    e.preventDefault();
    const id = to.replace(/^#/, '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash without triggering a navigation.
      window.history.replaceState(null, '', `#${id}`);
    }
  };
  return (
    <Link className="cs-landing-nav__link" to={`/${to}`} onClick={onClick}>
      {label}
    </Link>
  );
}

export function TopNav() {
  return (
    <nav className="cs-landing-nav" aria-label="Primary">
      <div className="cs-landing-nav__inner">
        <Link to="/" className="cs-landing-nav__brand">
          <span className="cs-landing-nav__brand-mark">CS</span>
          <span>CacheSol</span>
        </Link>

        <div className="cs-landing-nav__links">
          <NavAnchor to="#apps" label="Mini-apps" />
          <NavAnchor to="#features" label="Tính năng" />
          <NavAnchor to="#pricing" label="Bảng giá" />
          <NavAnchor to="#docs" label="Tài liệu" />
        </div>

        <div className="cs-landing-nav__cta">
          <Link to="/login">
            <Button variant="tertiary" size="md">
              Đăng nhập
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="md">
              Dùng thử miễn phí
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
