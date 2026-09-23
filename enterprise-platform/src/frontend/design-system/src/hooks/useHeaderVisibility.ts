/**
 * useHeaderVisibility — persist header show/hide state per admin.
 */
import { useState, useCallback, useEffect } from 'react';

const STORAGE_PREFIX = 'cachesol:headerVisible:';

export function useHeaderVisibility(adminId: string, defaultVisible: boolean = true) {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultVisible;
    const raw = localStorage.getItem(STORAGE_PREFIX + adminId);
    if (raw === null) return defaultVisible;
    try {
      return JSON.parse(raw) as boolean;
    } catch {
      return defaultVisible;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_PREFIX + adminId, JSON.stringify(visible));
    } catch {
      /* ignore */
    }
  }, [adminId, visible]);

  const toggle = useCallback(() => setVisible((v) => !v), []);
  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  return { visible, setVisible, toggle, show, hide };
}

export default useHeaderVisibility;
