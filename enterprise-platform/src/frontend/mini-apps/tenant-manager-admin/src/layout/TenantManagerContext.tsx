/**
 * Tenant Manager Context.
 */
import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import { useNotifications, type Notification } from '@cachesol/design-system';
import type { AppSwitcherItem } from '@cachesol/design-system';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  tenantId: string;
  roles: string[];
}

interface TenantManagerContextValue {
  user: AdminUser | null;
  login: (u?: Partial<AdminUser>) => void;
  logout: () => void;

  appSwitcher: AppSwitcherItem[];
  setAppSwitcher: (items: AppSwitcherItem[]) => void;
  activeAppId: string;

  language: string;
  setLanguage: (lang: string) => void;

  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;

  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const TenantManagerContext = createContext<TenantManagerContextValue | null>(null);

const DEFAULT_APPS: AppSwitcherItem[] = [
  { id: 'tenant-manager', label: 'Tenant Manager', href: '/', active: true, icon: 'T', description: 'Quản trị tenant' },
  { id: 'registry', label: 'Registry', href: '/_/registry', icon: 'R', description: 'Platform Registry' },
  { id: 'landing', label: 'Landing', href: '/_/landing', icon: 'L', description: 'Public catalog' },
  { id: 'hrm', label: 'HRM', href: '/_/hrm', icon: 'H', description: 'HRM' },
  { id: 'sales', label: 'Sales', href: '/_/sales', icon: 'S', description: 'Sales' },
];

export function TenantManagerProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [appSwitcher, setAppSwitcherRaw] = useState<AppSwitcherItem[]>(DEFAULT_APPS);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const adminId = 'tenant-manager-admin';
  const { list, unreadCount, markRead, markAllRead, add } = useNotifications({
    storageKey: adminId,
    initial: [
      {
        id: 'n_welcome',
        title: 'Welcome to Tenant Manager',
        body: 'Your tenant admin role is ready.',
        timestamp: new Date().toISOString(),
        read: false,
        variant: 'info',
      },
    ],
  });

  const setAppSwitcher = useCallback(
    (items: AppSwitcherItem[]) =>
      setAppSwitcherRaw(
        items.map((i) => ({ ...i, active: i.active ?? i.id === 'tenant-manager' })),
      ),
    [],
  );

  const login = useCallback((info?: Partial<AdminUser>) => {
    setUser({
      id: info?.id ?? 'tnt_admin_local',
      name: info?.name ?? 'Tenant Admin',
      email: info?.email ?? 'admin@acme.com',
      avatarUrl: info?.avatarUrl,
      tenantId: info?.tenantId ?? 'tnt_acme',
      roles: info?.roles ?? ['tenant_admin'],
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      appSwitcher,
      setAppSwitcher,
      activeAppId: 'tenant-manager',
      language,
      setLanguage,
      theme,
      setTheme,
      notifications: list,
      unreadCount,
      markRead,
      markAllRead,
      addNotification: add,
    }),
    [user, login, logout, appSwitcher, setAppSwitcher, language, theme, list, unreadCount, markRead, markAllRead, add],
  );

  return <TenantManagerContext.Provider value={value}>{children}</TenantManagerContext.Provider>;
}

export function useTenantManager() {
  const ctx = useContext(TenantManagerContext);
  if (!ctx) {
    throw new Error('useTenantManager must be used inside TenantManagerProvider');
  }
  return ctx;
}
