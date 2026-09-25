/**
 * FeatureHighlights — 4-up feature grid with inline SVG icons.
 */
import type { ReactNode } from 'react';

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const PlugIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-5" />
    <path d="M9 7V2" />
    <path d="M15 7V2" />
    <path d="M6 13V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z" />
  </svg>
);

const FileCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m9 18 2 2 4-4" />
    <path d="M3 12a3 3 0 0 1 6 0v5a1.5 1.5 0 0 1-3 0v-2" />
  </svg>
);

interface Highlight {
  title: string;
  body: string;
  icon: ReactNode;
}

const HIGHLIGHTS: Highlight[] = [
  {
    title: 'Triển khai trong 5 phút',
    body: 'Đăng ký → xác thực email → chọn mini-app → dùng ngay. Không cần cài đặt, không cần DevOps.',
    icon: <RocketIcon />,
  },
  {
    title: 'Đa tenant + SSO',
    body: 'Mỗi tenant có subdomain riêng, SSO tích hợp sẵn với Keycloak. Phân quyền theo role + scope.',
    icon: <ShieldIcon />,
  },
  {
    title: 'Tích hợp sẵn',
    body: 'Webhook, REST API, hóa đơn điện tử VNPT/MISA, email gateway, payment VNPay/MoMo.',
    icon: <PlugIcon />,
  },
  {
    title: 'Audit + compliance',
    body: 'Audit log toàn bộ thao tác, hỗ trợ xuất báo cáo cho kiểm toán (VAS, IFRS).',
    icon: <FileCheckIcon />,
  },
];

export function FeatureHighlights() {
  return (
    <section id="features" className="cs-landing-highlights">
      {HIGHLIGHTS.map((h) => (
        <div key={h.title} className="cs-landing-highlight-card">
          <span className="cs-landing-highlight-card__icon">{h.icon}</span>
          <h3 className="cs-landing-highlight-card__title">{h.title}</h3>
          <p className="cs-landing-highlight-card__body">{h.body}</p>
        </div>
      ))}
    </section>
  );
}

export default FeatureHighlights;
