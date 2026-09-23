import { Typography, Space } from 'antd';
import { Button } from '@cachesol/design-system';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="cs-landing-hero">
      <Space direction="vertical" size={16} align="center" style={{ textAlign: 'center' }}>
        <Title level={1} style={{ fontSize: 'var(--font-size-display-lg)' }}>
          CacheSol Enterprise Platform
        </Title>
        <Paragraph
          style={{
            fontSize: 'var(--font-size-heading-sm)',
            maxWidth: 720,
            color: 'var(--color-text-secondary)',
          }}
        >
          Nền tảng quản trị doanh nghiệp all-in-one với các mini-app HRM, Sales, Finance, Operations.
          Kích hoạt chỉ trong vài phút, không cần triển khai phức tạp.
        </Paragraph>
        <Space size={16} wrap>
          <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
            Đăng ký miễn phí 14 ngày
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
        </Space>
      </Space>
    </section>
  );
}

export default HeroSection;
