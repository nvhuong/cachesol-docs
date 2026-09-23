/**
 * ListPage — template for collection screens.
 * Source: /design-system/templates/list-page.md
 *
 * Composition:
 *   PageHeader
 *   Toolbar (search + filters + bulk actions)
 *   Table
 *   Pagination
 *   LoadingState / EmptyState / ErrorState
 */
import { type ReactNode } from 'react';
import { Pagination } from 'antd';
import { PageHeader, type BreadcrumbItem } from '../patterns/PageHeader';
import { Toolbar, type ToolbarProps } from '../patterns/Toolbar';
import { LoadingState } from '../patterns/LoadingState';
import { EmptyState, type EmptyStateType } from '../patterns/EmptyState';
import { ErrorState, type ErrorKind } from '../patterns/ErrorState';

export interface ListPageProps {
  // ── Header ─────────────────────────────────────────
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;

  // ── Toolbar ────────────────────────────────────────
  toolbar?: ToolbarProps;

  // ── Body ───────────────────────────────────────────
  /** The data table itself (built externally using Table component). */
  children?: ReactNode;

  // ── Pagination ─────────────────────────────────────
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
  };

  // ── States ─────────────────────────────────────────
  loading?: boolean;
  emptyType?: EmptyStateType;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  emptyAction?: ReactNode;
  error?: { kind?: ErrorKind; message?: ReactNode; onRetry?: () => void };
  /** When non-empty, indicates there's no data to render. */
  hasData?: boolean;
}

export function ListPage({
  title,
  description,
  breadcrumb,
  primaryAction,
  secondaryActions,
  toolbar,
  children,
  pagination,
  loading,
  emptyType = 'no-data',
  emptyTitle,
  emptyDescription,
  emptyAction,
  error,
  hasData = true,
}: ListPageProps) {
  return (
    <div className="cs-page cs-page--list">
      <PageHeader
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        actions={
          <>
            {secondaryActions}
            {primaryAction}
          </>
        }
      />

      {toolbar && <Toolbar {...toolbar} />}

      <div className="cs-page__body">
        {error ? (
          <ErrorState
            kind={error.kind ?? 'generic'}
            description={error.message}
            onRetry={error.onRetry}
          />
        ) : loading ? (
          <LoadingState shape="table" />
        ) : !hasData ? (
          <EmptyState
            type={emptyType}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        ) : (
          children
        )}
      </div>

      {pagination && pagination.total > 0 && (
        <div className="cs-page__pagination">
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={pagination.onChange}
            showSizeChanger={pagination.showSizeChanger ?? true}
            pageSizeOptions={pagination.pageSizeOptions ?? ['10', '25', '50', '100']}
            showTotal={(total, range) =>
              `Showing ${range[0]}–${range[1]} of ${total}`
            }
          />
        </div>
      )}
    </div>
  );
}

export default ListPage;
