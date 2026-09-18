/**
 * DetailPage — template for entity detail view.
 * Source: /design-system/templates/detail-page.md
 *
 * Composition:
 *   PageHeader (breadcrumb + title + status + actions)
 *   Tabs (Overview | Details | Activity | Settings)
 *   LoadingState / ErrorState / NotFoundState
 */
import { type ReactNode } from 'react';
import { PageHeader, type BreadcrumbItem } from '../patterns/PageHeader';
import { Tabs, type TabsItem } from '../components/Tabs';
import { StatusBadge, type Status } from '../patterns/StatusBadge';
import { LoadingState } from '../patterns/LoadingState';
import { ErrorState, type ErrorKind } from '../patterns/ErrorState';
import { EmptyState } from '../patterns/EmptyState';

export interface DetailPageProps {
  title: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  status?: Status;
  metadata?: ReactNode;
  actions?: ReactNode;

  /** Tabs (Overview / Details / Activity / Settings). */
  tabs?: TabsItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  defaultTab?: string;

  /** Body content (rendered inside active tab). */
  children?: ReactNode;

  // ── States ─────────────────────────────────────────
  loading?: boolean;
  error?: { kind?: ErrorKind; message?: ReactNode; onRetry?: () => void };
  notFound?: boolean;
}

export function DetailPage({
  title,
  breadcrumb,
  status,
  metadata,
  actions,
  tabs,
  activeTab,
  onTabChange,
  defaultTab = 'overview',
  children,
  loading,
  error,
  notFound,
}: DetailPageProps) {
  if (error) {
    return (
      <div className="cs-page cs-page--detail">
        <PageHeader title={title} breadcrumb={breadcrumb} />
        <ErrorState
          kind={error.kind ?? 'generic'}
          description={error.message}
          onRetry={error.onRetry}
        />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="cs-page cs-page--detail">
        <PageHeader title={title} breadcrumb={breadcrumb} />
        <EmptyState
          type="not-found"
          title="Not found"
          description="This record may have been removed."
        />
      </div>
    );
  }

  return (
    <div className="cs-page cs-page--detail">
      <PageHeader
        title={
          <span className="cs-detail-page__title">
            <span>{title}</span>
            {status && <StatusBadge status={status} />}
          </span>
        }
        breadcrumb={breadcrumb}
        metadata={metadata}
        actions={actions}
        tabs={
          tabs && tabs.length > 0 ? (
            <Tabs
              items={tabs}
              activeKey={activeTab}
              defaultActiveKey={defaultTab}
              onChange={onTabChange}
            />
          ) : undefined
        }
      />
      <div className="cs-page__body">
        {loading ? <LoadingState shape="section" rows={6} /> : children}
      </div>
    </div>
  );
}

export default DetailPage;
