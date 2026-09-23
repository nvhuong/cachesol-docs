/**
 * useNotifications — localStorage-backed notifications cho admin webs.
 *
 * - Persists tại 'cachesol:notifications:<adminId>' (mỗi admin mini-app có storage riêng).
 * - Cung cấp markAllRead, markRead, add, remove.
 *
 * Production sẽ thay thế bằng React Query + WebSocket/SSE ở backend API.
 */
import { useState, useCallback, useEffect, useMemo } from 'react';

export interface Notification {
  id: string;
  title: string;
  body?: string;
  href?: string;
  timestamp: string;
  read?: boolean;
  /** Variant drives icon + color hint. */
  variant?: 'info' | 'success' | 'warning' | 'error';
}

interface UseNotificationsOptions {
  /** Unique id per admin (default: 'global'). Separate storage per id. */
  storageKey?: string;
  /** Initial notifications (only used on first render). */
  initial?: Notification[];
}

const STORAGE_PREFIX = 'cachesol:notifications:';

function loadFromStorage(key: string): Notification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return [];
    return JSON.parse(raw) as Notification[];
  } catch {
    return [];
  }
}

function saveToStorage(key: string, list: Notification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(list));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { storageKey = 'global', initial = [] } = options;
  const [list, setList] = useState<Notification[]>(() => {
    const stored = loadFromStorage(storageKey);
    return stored.length > 0 ? stored : initial;
  });

  // Persist on every change
  useEffect(() => {
    saveToStorage(storageKey, list);
  }, [list, storageKey]);

  const markRead = useCallback((id: string) => {
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setList((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const add = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setList((prev) => [
      {
        ...n,
        id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setList((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clear = useCallback(() => setList([]), []);

  const unreadCount = useMemo(() => list.filter((n) => !n.read).length, [list]);

  return { list, unreadCount, markRead, markAllRead, add, remove, clear };
}

export default useNotifications;
