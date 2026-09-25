/**
 * Footer — public footer for landing pages.
 */
import { Link } from 'react-router-dom';

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
            <li><a className="cs-landing-footer__link" href="#apps">Mini-apps</a></li>
            <li><a className="cs-landing-footer__link" href="#pricing">Bảng giá</a></li>
            <li><a className="cs-landing-footer__link" href="#docs">Tài liệu API</a></li>
            <li><a className="cs-landing-footer__link" href="#status">Trạng thái</a></li>
          </ul>
        </div>

        <div className="cs-landing-footer__col">
          <h4 className="cs-landing-footer__title">Công ty</h4>
          <ul className="cs-landing-footer__links">
            <li><a className="cs-landing-footer__link" href="#about">Về chúng tôi</a></li>
            <li><a className="cs-landing-footer__link" href="#contact">Liên hệ</a></li>
            <li><a className="cs-landing-footer__link" href="#careers">Tuyển dụng</a></li>
            <li><a className="cs-landing-footer__link" href="#blog">Blog</a></li>
          </ul>
        </div>

        <div className="cs-landing-footer__col">
          <h4 className="cs-landing-footer__title">Pháp lý</h4>
          <ul className="cs-landing-footer__links">
            <li><a className="cs-landing-footer__link" href="#privacy">Chính sách bảo mật</a></li>
            <li><a className="cs-landing-footer__link" href="#terms">Điều khoản dịch vụ</a></li>
            <li><a className="cs-landing-footer__link" href="#dpa">DPA</a></li>
            <li><a className="cs-landing-footer__link" href="#security">Security</a></li>
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
