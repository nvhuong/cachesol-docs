/**
 * PageHeader — breadcrumb + title + description + actions.
 * Source: /design-system/patterns/navigation.md
 */
import { type ReactNode } from 'react';
import { Breadcrumb, Space } from 'antd';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  actions?: ReactNode;
  /** Page tabs (rendered below header). */
  tabs?: ReactNode;
  /** Metadata strip (e.g. "Created by John · 18 Sep 2026"). */
  metadata?: ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  tabs,
  metadata,
}: PageHeaderProps) {
  return (
    <header className="cs-page-header">
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb
          className="cs-page-header__breadcrumb"
          items={breadcrumb.map((b) => ({
            title: b.href || b.onClick ? (
              <a
                href={b.href}
                onClick={(e) => {
                  if (b.onClick) {
                    e.preventDefault();
                    b.onClick();
                  }
                }}
              >
                {b.label}
              </a>
            ) : (
              b.label
            ),
          }))}
        />
      )}

      <div className="cs-page-header__main">
        <div className="cs-page-header__text">
          {title && <h1 className="cs-page-header__title">{title}</h1>}
          {description && <p className="cs-page-header__description">{description}</p>}
        </div>
        {actions && (
          <Space size={8} wrap>
            {actions}
          </Space>
        )}
      </div>

      {metadata && <div className="cs-page-header__metadata">{metadata}</div>}
      {tabs && <div className="cs-page-header__tabs">{tabs}</div>}
    </header>
  );
}

export default PageHeader;
