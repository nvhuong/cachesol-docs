/**
 * Footer — public footer for landing pages.
 *
 * Same pattern as TopNav: anchor links use `/#anchor` so React Router handles
 * the navigation, then the browser scrolls to the section on the home page.
 */
import { Link } from 'react-router-dom';

function FooterAnchor({ to, label }: { to: string; label: string }) {
  return (
    <Link className="cs-landing-footer__link" to={`/${to}`}>
      {label}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="cs-landing-footer">
      <div className="cs-landing-footer__inner">
        <div className="cs-landing-footer__brand">
          <Link to="/" className="cs-landing-nav__brand">
            <span className="cs-landing-nav__brand-mark">CS</span>
            <span>CacheSol</span>
          </Link>
          <p className="cs-landing-footer__tagline">
            Nền tảng quản trị doanh nghiệp all-in-one với các mini-app HRM, Sales, Finance,
            Operations — đa tenant, SSO, audit sẵn sàng.
          </p>
        </div>

        <div className="cs-landing-footer__col">
          <h4 className="cs-landing-footer__title">Sản phẩm</h4>
          <ul className="cs-landing-footer__links">
            <li><FooterAnchor to="#apps" label="Mini-apps" /></li>
            <li><FooterAnchor to="#pricing" label="Bảng giá" /></li>
            <li><FooterAnchor to="#docs" label="Tài liệu API" /></li>
            <li><FooterAnchor to="#status" label="Trạng thái" /></li>
          </ul>
        </div>

        <div className="cs-landing-footer__col">
          <h4 className="cs-landing-footer__title">Công ty</h4>
          <ul className="cs-landing-footer__links">
            <li><FooterAnchor to="#about" label="Về chúng tôi" /></li>
            <li><FooterAnchor to="#contact" label="Liên hệ" /></li>
            <li><FooterAnchor to="#careers" label="Tuyển dụng" /></li>
            <li><FooterAnchor to="#blog" label="Blog" /></li>
          </ul>
        </div>

        <div className="cs-landing-footer__col">
          <h4 className="cs-landing-footer__title">Pháp lý</h4>
          <ul className="cs-landing-footer__links">
            <li><FooterAnchor to="#privacy" label="Chính sách bảo mật" /></li>
            <li><FooterAnchor to="#terms" label="Điều khoản dịch vụ" /></li>
            <li><FooterAnchor to="#dpa" label="DPA" /></li>
            <li><FooterAnchor to="#security" label="Security" /></li>
          </ul>
        </div>
      </div>
      <div className="cs-landing-footer__bottom">
        <span>© {year} CacheSol. All rights reserved.</span>
        <span>Built with ❤ in Vietnam</span>
      </div>
    </footer>
  );
}

export default Footer;
