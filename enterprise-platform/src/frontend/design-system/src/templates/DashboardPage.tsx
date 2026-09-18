/**
 * DashboardPage — template for high-level overview screens.
 * Source: /design-system/templates/dashboard-page.md
 *
 * Composition:
 *   PageHeader (title + date range + refresh)
 *   Global filters
 *   KPI row (2-6 KPIs)
 *   Primary charts (2-column grid)
 *   Secondary (full width)
 *   Alerts / Activity
 */
import { type ReactNode } from 'react';
import { PageHeader, type BreadcrumbItem } from '../patterns/PageHeader';
import { LoadingState } from '../patterns/LoadingState';
import { ErrorState, type ErrorKind } from '../patterns/ErrorState';

export interface DashboardPageProps {
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: BreadcrumbItem[];

  /** Date range picker, refresh button. */
  globalActions?: ReactNode;

  /** Global filters (Region, Team, Product, etc.). */
  globalFilters?: ReactNode;

  /** KPI row (2-6 cards). */
  kpis?: ReactNode;

  /** Primary charts (2-column grid). */
  primaryCharts?: ReactNode;

  /** Secondary (full width). */
  secondaryContent?: ReactNode;

  /** Alerts / Activity feed. */
  bottomContent?: ReactNode;

  /** States. */
  loading?: boolean;
  error?: { kind?: ErrorKind; message?: ReactNode; onRetry?: () => void };
}

export function DashboardPage({
  title,
  description,
  breadcrumb,
  globalActions,
  globalFilters,
  kpis,
  primaryCharts,
  secondaryContent,
  bottomContent,
  loading,
  error,
}: DashboardPageProps) {
  if (error) {
    return (
      <div className="cs-page cs-page--dashboard">
        <PageHeader title={title} description={description} breadcrumb={breadcrumb} actions={globalActions} />
        <ErrorState
          kind={error.kind ?? 'generic'}
          description={error.message}
          onRetry={error.onRetry}
        />
      </div>
    );
  }

  return (
    <div className="cs-page cs-page--dashboard">
      <PageHeader
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        actions={globalActions}
      />

      {globalFilters && <div className="cs-dashboard__filters">{globalFilters}</div>}

      <div className="cs-dashboard__body">
        {loading ? (
          <LoadingState shape="page" />
        ) : (
          <>
            {kpis && <div className="cs-dashboard__kpis">{kpis}</div>}
            {primaryCharts && (
              <div className="cs-dashboard__primary-charts">{primaryCharts}</div>
            )}
            {secondaryContent && (
              <div className="cs-dashboard__secondary">{secondaryContent}</div>
            )}
            {bottomContent && (
              <div className="cs-dashboard__bottom">{bottomContent}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
