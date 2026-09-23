/**
 * Table — Data table with density modes, alignment, and toolbar.
 * Source: /design-system/components/table.md
 *
 * Note: this wrapper exposes a controlled density prop and aligns numeric
 * columns to the right by default. For full spec, see table.md.
 */
import { forwardRef, type ReactNode } from 'react';
import { Table as AntTable } from 'antd';
import type { TableProps as AntTableProps, ColumnType } from 'antd/es/table';
import { density as densityMap, type Density } from '../tokens/spacing';

export interface TableProps<T = Record<string, unknown>>
  extends Omit<AntTableProps<T>, 'size'> {
  density?: Density;
}

function densityToSize(d: Density): AntTableProps['size'] {
  // antd has 'large' | 'middle' | 'small'. Map CacheSol density → AntD size.
  if (d === 'comfortable') return 'large';
  if (d === 'compact') return 'small';
  return 'middle';
}

export const Table = forwardRef<HTMLElement, TableProps>(function Table(
  { density = 'default', rowClassName, ...rest },
  _ref,
) {
  const cfg = densityMap[density];

  return (
    <AntTable<Record<string, unknown>>
      size={densityToSize(density)}
      rowClassName={(record, index, indent) => {
        const extra =
          typeof rowClassName === 'function'
            ? rowClassName(record as never, index, indent)
            : rowClassName;
        return ['cs-table-row', extra].filter(Boolean).join(' ');
      }}
      // Apply CacheSol row height via CSS variable.
      tableLayout="auto"
      {...rest}
      style={{
        // Custom property so CSS can use it.
        ...(rest.style as Record<string, unknown>),
        ['--cs-row-height' as never]: `${cfg.rowHeight}px`,
      }}
    />
  );
});

/**
 * Helper for column alignment.
 * Number / currency / percentage → right. Text → left. Checkbox → center.
 */
export function columnAlign<T>(
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'status' | 'checkbox' | 'action',
): ColumnType<T> {
  switch (type) {
    case 'number':
    case 'currency':
    case 'percentage':
    case 'action':
      return { align: 'right' };
    case 'checkbox':
      return { align: 'center' };
    default:
      return { align: 'left' };
  }
}

/**
 * Helper: wrap numeric / currency cells with tabular-nums utility.
 */
export function tabularCell<T>(
  render: (value: unknown, record: T, index: number) => ReactNode,
): ColumnType<T>['render'] {
  return (value, record, index) => (
    <span className="cs-tabular">{render(value, record, index)}</span>
  );
}

export default Table;
