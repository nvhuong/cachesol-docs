import { useEffect, useState } from 'react';
import { Typography } from '@cachesol/design-system';
import { LoadingState } from '@cachesol/design-system';
import { fetchMockCatalog } from '../api/mock-catalog';
import type { PublicMiniApp } from '../types/miniapp-catalog.types';
import HeroSection from '../sections/HeroSection';
import MiniAppGrid from '../sections/MiniAppGrid';
import FeatureHighlights from '../sections/FeatureHighlights';

const { Title, Paragraph } = Typography;

export function LandingPage() {
  const [apps, setApps] = useState<PublicMiniApp[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchMockCatalog().then((res) => {
      if (mounted) {
        setApps(res.items);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="cs-landing">
      <HeroSection />

      <section className="cs-landing__container">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 48,
            width: '100%',
          }}
        >
          <div>
            <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
              Các mini-app có sẵn
            </Title>
            <Paragraph
              style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                marginBottom: 24,
              }}
            >
              Chọn những mini-app bạn cần — kích hoạt theo nhu cầu.
            </Paragraph>
            {isLoading ? (
              <LoadingState shape="section" label="Đang tải danh sách mini-app..." />
            ) : (
              <MiniAppGrid apps={apps} />
            )}
          </div>

          <FeatureHighlights />
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
