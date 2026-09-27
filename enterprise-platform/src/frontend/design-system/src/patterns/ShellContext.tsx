/**
 * ShellContext — single source of truth cho header + chrome state.
 *
 * Mounted bởi web-shell (apps/web-shell) để chia sẻ app switcher,
 * notifications, language/theme/density giữa MainLayout và các admin
 * mini-app pages.
 *
 * Admin shells (registry-admin, tenant-manager-admin) consume context này
 * qua `useShellAvailable()` để biết chúng đang chạy:
 *
 * - **Embedded** (web-shell mounted): ShellContext có → admin shell chỉ
 *   render sidebar + outlet, AppHeader đã được MainLayout render. Tránh
 *   double header.
 *
 * - **Standalone** (admin dev.tsx): ShellContext KHÔNG có → admin shell
 *   render full AdminShell với AppHeader riêng để dev/test độc lập.
 *
 * Source: design-system/patterns/app-header.md
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNotifications, type Notification } from '../hooks/useNotifications';

export interface AppSwitcherItem {
  id: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  href: string;
  active?: boolean;
}

export interface ShellConfigItem {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  href?: string;
}

export type ShellLanguage = 'vi' | 'en';
export type ShellTheme = 'light' | 'dark';
export type ShellDensity = 'compact' | 'default' | 'comfortable';

export interface ShellContextValue {
  // ── Brand ──
  brand: { logo: ReactNode; name: string; logoHref?: string };
  setBrand: (b: Partial<ShellContextValue['brand']>) => void;

  // ── App switcher (mini-apps người dùng có quyền truy cập) ──
  appSwitcher: AppSwitcherItem[];
  activeAppId: string;
  setActiveAppId: (id: string) => void;
  setAppSwitcher: (items: AppSwitcherItem[]) => void;

  // ── User ──
  user: { name: string; email?: string; avatarUrl?: string } | null;
  setUser: (u: ShellContextValue['user']) => void;

  // ── Notifications ──
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;

  // ── Config dropdown ──
  configItems: ShellConfigItem[];
  setConfigItems: (items: ShellConfigItem[]) => void;

  // ── Preferences ──
  language: ShellLanguage;
  setLanguage: (l: ShellLanguage) => void;
  theme: ShellTheme;
  setTheme: (t: ShellTheme) => void;
  density: ShellDensity;
  setDensity: (d: ShellDensity) => void;

  // ── Header visibility ──
  headerVisible: boolean;
  setHeaderVisible: (v: boolean) => void;
  toggleHeaderVisible: () => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

const LS_LANGUAGE = 'cachesol:shell:language';
const LS_THEME = 'cachesol:shell:theme';
const LS_DENSITY = 'cachesol:shell:density';
const LS_HEADER_VISIBLE = 'cachesol:shell:headerVisible';

function readLS<T extends string>(key: string, fallback: T, valid: readonly T[]): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  return valid.includes(raw as T) ? (raw as T) : fallback;
}

const LANGS: readonly ShellLanguage[] = ['vi', 'en'];
const THEMES: readonly ShellTheme[] = ['light', 'dark'];
const DENSITIES: readonly ShellDensity[] = ['compact', 'default', 'comfortable'];

export interface ShellProviderProps {
  children: ReactNode;
  initialBrand?: { logo?: ReactNode; name?: string; logoHref?: string };
  initialAppSwitcher?: AppSwitcherItem[];
  initialActiveAppId?: string;
  initialUser?: ShellContextValue['user'];
  initialConfigItems?: ShellConfigItem[];
  initialLanguage?: ShellLanguage;
  initialTheme?: ShellTheme;
  initialDensity?: ShellDensity;
  initialHeaderVisible?: boolean;
}

export function ShellProvider({
  children,
  initialBrand,
  initialAppSwitcher = [],
  initialActiveAppId,
  initialUser = null,
  initialConfigItems = [],
  initialLanguage,
  initialTheme,
  initialDensity,
  initialHeaderVisible = true,
}: ShellProviderProps) {
  // ── Brand ──
  const [brand, setBrandState] = useState<ShellContextValue['brand']>({
    logo: initialBrand?.logo ?? (
      <strong style={{ color: '#1890ff', fontSize: 18 }}>CacheSol</strong>
    ),
    name: initialBrand?.name ?? 'CacheSol',
    logoHref: initialBrand?.logoHref ?? '/dashboard',
  });
  const setBrand = useCallback(
    (b: Partial<ShellContextValue['brand']>) => setBrandState((prev) => ({ ...prev, ...b })),
    [],
  );

  // ── App switcher ──
  const [appSwitcher, setAppSwitcherRaw] =
    useState<AppSwitcherItem[]>(initialAppSwitcher);
  const [activeAppId, setActiveAppId] = useState<string>(
    initialActiveAppId ?? initialAppSwitcher[0]?.id ?? '',
  );
  const setAppSwitcher = useCallback((items: AppSwitcherItem[]) => {
    setAppSwitcherRaw(items);
  }, []);

  // ── User ──
  const [user, setUser] = useState<ShellContextValue['user']>(initialUser);

  // ── Notifications ──
  const { list, unreadCount, markRead, markAllRead, add } = useNotifications({
    storageKey: 'shell',
    initial: [
      {
        id: 'n_shell_welcome',
        title: 'Welcome to CacheSol',
        body: 'Bạn đã đăng nhập thành công.',
        timestamp: new Date().toISOString(),
        read: false,
        variant: 'info',
      },
    ],
  });

  // ── Config items ──
  const [configItems, setConfigItems] =
    useState<ShellConfigItem[]>(initialConfigItems);

  // ── Preferences (with localStorage) ──
  const [language, setLanguageState] = useState<ShellLanguage>(
    initialLanguage ?? readLS(LS_LANGUAGE, 'vi', LANGS),
  );
  const [theme, setThemeState] = useState<ShellTheme>(
    initialTheme ?? readLS(LS_THEME, 'light', THEMES),
  );
  const [density, setDensityState] = useState<ShellDensity>(
    initialDensity ?? readLS(LS_DENSITY, 'default', DENSITIES),
  );

  // Apply theme + density to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-density', density);
  }, [theme, density]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LS_LANGUAGE, language);
      window.localStorage.setItem(LS_THEME, theme);
      window.localStorage.setItem(LS_DENSITY, density);
    } catch {
      /* ignore */
    }
  }, [language, theme, density]);

  const setLanguage = useCallback((l: ShellLanguage) => setLanguageState(l), []);
  const setTheme = useCallback((t: ShellTheme) => setThemeState(t), []);
  const setDensity = useCallback((d: ShellDensity) => setDensityState(d), []);

  // ── Header visibility ──
  const [headerVisible, setHeaderVisibleState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return initialHeaderVisible;
    const raw = window.localStorage.getItem(LS_HEADER_VISIBLE);
    if (raw === null) return initialHeaderVisible;
    try {
      return JSON.parse(raw) as boolean;
    } catch {
      return initialHeaderVisible;
    }
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        LS_HEADER_VISIBLE,
        JSON.stringify(headerVisible),
      );
    } catch {
      /* ignore */
    }
  }, [headerVisible]);

  const toggleHeaderVisible = useCallback(
    () => setHeaderVisibleState((v) => !v),
    [],
  );

  const value = useMemo<ShellContextValue>(
    () => ({
      brand,
      setBrand,
      appSwitcher,
      activeAppId,
      setActiveAppId,
      setAppSwitcher,
      user,
      setUser,
      notifications: list,
      unreadCount,
      markNotificationRead: markRead,
      markAllNotificationsRead: markAllRead,
      addNotification: add,
      configItems,
      setConfigItems,
      language,
      setLanguage,
      theme,
      setTheme,
      density,
      setDensity,
      headerVisible,
      setHeaderVisible: setHeaderVisibleState,
      toggleHeaderVisible,
    }),
    [
      brand,
      setBrand,
      appSwitcher,
      activeAppId,
      setAppSwitcher,
      user,
      list,
      unreadCount,
      markRead,
      markAllRead,
      add,
      configItems,
      language,
      setLanguage,
      theme,
      setTheme,
      density,
      setDensity,
      headerVisible,
      toggleHeaderVisible,
    ],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellContextValue {
  return useContext(ShellContext) as ShellContextValue;
}

/**
 * useShellAvailable — true nếu ShellContext có (web-shell mounted).
 * Admin shells dùng hook này để quyết định embedded vs standalone.
 */
export function useShellAvailable(): boolean {
  return useContext(ShellContext) !== null;
}

export default ShellContext;
