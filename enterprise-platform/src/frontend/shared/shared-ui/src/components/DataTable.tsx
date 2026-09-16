import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataTableProps<T = Record<string, unknown>> extends Omit<TableProps<T>, 'dataSource'> {
  dataSource: T[];
  loading?: boolean;
}

export function DataTable<T = Record<string, unknown>>({
  dataSource,
  loading = false,
  ...rest
}: DataTableProps<T>) {
  return (
    <Table<T>
      dataSource={dataSource}
      loading={loading}
      rowKey={(record) => (record as { id?: string }).id ?? Math.random().toString()}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} bản ghi`,
        pageSize: 20,
        ...rest.pagination,
      }}
      {...rest}
    />
  );
}
