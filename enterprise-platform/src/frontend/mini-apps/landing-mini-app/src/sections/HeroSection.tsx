import { Typography } from '@cachesol/design-system';
import { Button } from '@cachesol/design-system';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="cs-landing-hero">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Title level={1} style={{ fontSize: 'var(--font-size-display-lg)', margin: 0 }}>
          CacheSol Enterprise Platform
        </Title>
        <Paragraph
          style={{
            fontSize: 'var(--font-size-heading-sm)',
            maxWidth: 720,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Nền tảng quản trị doanh nghiệp all-in-one với các mini-app HRM, Sales, Finance, Operations.
          Kích hoạt chỉ trong vài phút, không cần triển khai phức tạp.
        </Paragraph>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
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
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
