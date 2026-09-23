import { Row, Col } from 'antd';
import { Typography } from '@cachesol/design-system';

const { Title } = Typography;

const HIGHLIGHTS = [
  {
    title: 'Triển khai trong 5 phút',
    body: 'Đăng ký → xác thực email → chọn mini-app → dùng ngay. Không cần cài đặt, không cần devops.',
  },
  {
    title: 'Đa tenant + SSO',
    body: 'Mỗi tenant có subdomain riêng, SSO tích hợp sẵn với Keycloak. Phân quyền theo role + scope.',
  },
  {
    title: 'Tích hợp sẵn',
    body: 'Webhook, REST API, hóa đơn điện tử VNPT/MISA, email gateway, payment gateway VNPay/MoMo.',
  },
  {
    title: 'Audit + compliance',
    body: 'Audit log toàn bộ thao tác, hỗ trợ xuất báo cáo cho kiểm toán (VAS, IFRS).',
  },
];

export function FeatureHighlights() {
  return (
    <section className="cs-landing-highlights">
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        Tại sao chọn CacheSol?
      </Title>
      <Row gutter={[24, 24]}>
        {HIGHLIGHTS.map((h) => (
          <Col xs={24} sm={12} md={6} key={h.title}>
            <div className="cs-landing-highlight-card">
              <h3 className="cs-landing-highlight-card__title">{h.title}</h3>
              <p className="cs-landing-highlight-card__body">{h.body}</p>
            </div>
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default FeatureHighlights;
