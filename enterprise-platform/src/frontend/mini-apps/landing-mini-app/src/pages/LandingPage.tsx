/**
 * LandingPage — public catalog. Hero → Mini-app grid → Highlights → CTA → Footer.
 */
import { useEffect, useState } from 'react';
import { LoadingState } from '@cachesol/design-system';
import { fetchCatalog } from '../api/catalog-api';
import type { PublicMiniApp } from '../types/miniapp-catalog.types';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';
import HeroSection from '../sections/HeroSection';
import MiniAppGrid from '../sections/MiniAppGrid';
import FeatureHighlights from '../sections/FeatureHighlights';
import CtaBanner from '../sections/CtaBanner';

export function LandingPage() {
  const [apps, setApps] = useState<PublicMiniApp[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCatalog().then((res) => {
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
    <div className="cs-landing">
      <TopNav />

      <main>
        <HeroSection />

        <section className="cs-landing-section">
          <div className="cs-landing-section__head">
            <span className="cs-landing-section__eyebrow">Catalog</span>
            <h2 className="cs-landing-section__title">Các mini-app có sẵn</h2>
            <p className="cs-landing-section__desc">
              Chọn những mini-app bạn cần — kích hoạt theo nhu cầu. Mỗi mini-app đều có thể
              dùng thử miễn phí 14 ngày.
            </p>
          </div>

          {isLoading ? (
            <LoadingState shape="section" label="Đang tải danh sách mini-app..." />
          ) : (
            <MiniAppGrid apps={apps} />
          )}
        </section>

        <section className="cs-landing-section">
          <div className="cs-landing-section__head">
            <span className="cs-landing-section__eyebrow">Tại sao chọn CacheSol?</span>
            <h2 className="cs-landing-section__title">Mọi thứ bạn cần để vận hành doanh nghiệp</h2>
            <p className="cs-landing-section__desc">
              Từ triển khai đến tích hợp và audit — tất cả được tích hợp sẵn trong một nền tảng duy nhất.
            </p>
          </div>

          <FeatureHighlights />
        </section>

        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
