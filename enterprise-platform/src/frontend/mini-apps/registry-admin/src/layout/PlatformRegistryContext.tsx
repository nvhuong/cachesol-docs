/**
 * Platform Registry Context — shares user, app switcher, notifications across pages.
 */
import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import { useNotifications, type Notification } from '@cachesol/design-system';
import type { AppSwitcherItem } from '@cachesol/design-system';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
}

interface PlatformRegistryContextValue {
  user: AdminUser | null;
  login: (user?: Partial<AdminUser>) => void;
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

const PlatformRegistryContext = createContext<PlatformRegistryContextValue | null>(null);

const DEFAULT_APPS: AppSwitcherItem[] = [
  { id: 'registry', label: 'Registry', href: '/', active: true, icon: 'R', description: 'Platform Registry' },
  { id: 'landing', label: 'Landing', href: '/_/landing', icon: 'L', description: 'Public catalog & registration' },
  { id: 'tenant-admin', label: 'Tenant Admin', href: '/_/tenant-admin', icon: 'T', description: 'Quản trị tenant' },
  { id: 'hrm', label: 'HRM', href: '/_/hrm', icon: 'H', description: 'Quản lý nhân sự' },
  { id: 'sales', label: 'Sales', href: '/_/sales', icon: 'S', description: 'CRM & pipeline' },
  { id: 'finance', label: 'Finance', href: '/_/finance', icon: 'F', description: 'Kế toán' },
  { id: 'ops', label: 'Operations', href: '/_/ops', icon: 'O', description: 'Kho & vận hành' },
];

export function PlatformRegistryProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [appSwitcher, setAppSwitcherRaw] = useState<AppSwitcherItem[]>(DEFAULT_APPS);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const adminId = 'registry-admin';
  const { list, unreadCount, markRead, markAllRead, add } = useNotifications({
    storageKey: adminId,
    initial: [
      {
        id: 'n_welcome',
        title: 'Welcome to Platform Registry',
        body: 'Your admin role has been provisioned.',
        timestamp: new Date().toISOString(),
        read: false,
        variant: 'info',
      },
    ],
  });

  const setAppSwitcher = useCallback(
    (items: AppSwitcherItem[]) =>
      setAppSwitcherRaw(items.map((i) => ({ ...i, active: i.active ?? i.id === 'registry' }))),
    [],
  );

  const login = useCallback((info?: Partial<AdminUser>) => {
    setUser({
      id: info?.id ?? 'admin_local',
      name: info?.name ?? 'Platform Admin',
      email: info?.email ?? 'admin@cachesol.io',
      avatarUrl: info?.avatarUrl,
      roles: info?.roles ?? ['registry_admin'],
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
      activeAppId: 'registry',
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

  return <PlatformRegistryContext.Provider value={value}>{children}</PlatformRegistryContext.Provider>;
}

export function usePlatformRegistryContext() {
  const ctx = useContext(PlatformRegistryContext);
  if (!ctx) {
    throw new Error('usePlatformRegistryContext must be used inside PlatformRegistryProvider');
  }
  return ctx;
}
