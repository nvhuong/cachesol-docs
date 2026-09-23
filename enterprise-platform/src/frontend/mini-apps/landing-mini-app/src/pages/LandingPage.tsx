import { useEffect, useState } from 'react';
import { Space, Typography } from 'antd';
import { LoadingState } from '@cachesol/design-system';
import { fetchMockCatalog } from '../api/mock-catalog';
import type { PublicMiniApp } from '../types/miniapp-catalog.types';
import HeroSection from '../sections/HeroSection';
import MiniAppGrid from '../sections/MiniAppGrid';
import FeatureHighlights from '../sections/FeatureHighlights';

const { Title } = Typography;

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
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ textAlign: 'center' }}>
              Các mini-app có sẵn
            </Title>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                marginBottom: 24,
              }}
            >
              Chọn những mini-app bạn cần — kích hoạt theo nhu cầu.
            </p>
            {isLoading ? (
              <LoadingState shape="section" label="Đang tải danh sách mini-app..." />
            ) : (
              <MiniAppGrid apps={apps} />
            )}
          </div>

          <FeatureHighlights />
        </Space>
      </section>
    </main>
  );
}

export default LandingPage;
