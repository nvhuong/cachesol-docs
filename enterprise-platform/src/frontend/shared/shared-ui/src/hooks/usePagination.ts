import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  defaultPage?: number;
  defaultPageSize?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { defaultPage = 0, defaultPageSize = 20 } = options;
  
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const onChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  const reset = useCallback(() => {
    setPage(defaultPage);
    setPageSize(defaultPageSize);
  }, [defaultPage, defaultPageSize]);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    onChange,
    reset,
  };
}
