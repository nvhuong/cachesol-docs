/**
 * Toolbar — search + filters + bulk action bar (for List pages).
 * Source: /design-system/templates/list-page.md
 */
import { type ReactNode } from 'react';
import { Space } from 'antd';
import { Input } from '../components/Input';
import { Tag } from '../components/Tag';

export interface ActiveFilter {
  key: string;
  label: ReactNode;
  onRemove: () => void;
}

export interface ToolbarProps {
  /** Search input placeholder. */
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Quick filter dropdowns. */
  quickFilters?: ReactNode;
  /** Column visibility toggle. */
  columnToggle?: ReactNode;
  /** Secondary actions. */
  secondaryActions?: ReactNode;
  /** Active filters shown as chips. */
  activeFilters?: ActiveFilter[];
  onClearAllFilters?: () => void;
  /** Selected row count for bulk action bar. */
  selectedCount?: number;
  /** Bulk actions (rendered when selectedCount > 0). */
  bulkActions?: ReactNode;
  onClearSelection?: () => void;
}

export function Toolbar({
  searchPlaceholder = 'Search…',
  searchValue,
  onSearchChange,
  quickFilters,
  columnToggle,
  secondaryActions,
  activeFilters,
  onClearAllFilters,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
}: ToolbarProps) {
  return (
    <div className="cs-toolbar">
      <div className="cs-toolbar__row">
        <div className="cs-toolbar__search">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            allowClear
            inputSize="md"
          />
        </div>
        {quickFilters && <div className="cs-toolbar__filters">{quickFilters}</div>}
        {columnToggle && <div className="cs-toolbar__columns">{columnToggle}</div>}
        {secondaryActions && (
          <Space size={4} className="cs-toolbar__actions">
            {secondaryActions}
          </Space>
        )}
      </div>

      {selectedCount > 0 && bulkActions && (
        <div className="cs-toolbar__bulk">
          <span className="cs-toolbar__bulk-count">{selectedCount} selected</span>
          <Space size={4}>{bulkActions}</Space>
          {onClearSelection && (
            <button
              type="button"
              className="cs-toolbar__bulk-clear"
              onClick={onClearSelection}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {activeFilters && activeFilters.length > 0 && (
        <div className="cs-toolbar__active">
          <Space size={6} wrap>
            {activeFilters.map((f) => (
              <Tag
                key={f.key}
                variant="default"
                removable
                onClose={f.onRemove}
              >
                {f.label}
              </Tag>
            ))}
            {onClearAllFilters && activeFilters.length > 1 && (
              <button
                type="button"
                className="cs-toolbar__clear-all"
                onClick={onClearAllFilters}
              >
                Clear all
              </button>
            )}
          </Space>
        </div>
      )}
    </div>
  );
}

export default Toolbar;
