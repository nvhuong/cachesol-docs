import { useEffect, useState } from 'react';
import { Card, Row, Col, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageHeader, Tag, EmptyState, LoadingState, StatusBadge } from '@cachesol/design-system';
import { fetchMockCatalog } from '../../api/mock-catalog';
import type { RegistryAdminMiniApp } from '../../api/mock-catalog';

export function MiniAppsCatalogPage() {
  const [apps, setApps] = useState<RegistryAdminMiniApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchMockCatalog().then((res) => {
      setApps(res);
      setLoading(false);
    });
  }, []);

  const filtered = apps.filter((a) =>
    !keyword || `${a.name} ${a.tagline}`.toLowerCase().includes(keyword.toLowerCase()),
  );

  if (loading) return <LoadingState shape="page" />;

  return (
    <>
      <PageHeader
        title="Mini-apps catalog"
        description={`${filtered.length} apps · ${apps.length} total`}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Mini-apps' }]}
      />

      <Card>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm mini-app..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
          style={{ maxWidth: 320, marginBottom: 16 }}
        />

        {filtered.length === 0 ? (
          <EmptyState type="no-results" title="Không có kết quả" />
        ) : (
          <Row gutter={[16, 16]}>
            {filtered.map((app) => (
              <Col xs={24} sm={12} md={8} lg={6} key={app.id}>
                <article className="cs-landing-app-card" style={{ cursor: 'default' }}>
                  <div className="cs-landing-app-card__head">
                    <span className="cs-landing-app-card__icon">{app.name.charAt(0)}</span>
                    <div>
                      <h3 className="cs-landing-app-card__name">{app.name}</h3>
                      <Tag variant="info">{app.category}</Tag>
                    </div>
                  </div>
                  <p className="cs-landing-app-card__tagline">{app.tagline}</p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 8,
                      borderTop: '1px solid var(--color-border-subtle)',
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    <StatusBadge status={app.status === 'published' ? 'active' : app.status === 'draft' ? 'draft' : 'inactive'} />
                    <span>{app.tenantCount} tenants</span>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </>
  );
}

export default MiniAppsCatalogPage;
