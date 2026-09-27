/**
 * RegistryAdminShell — composes AdminShell + sidebar + router outlet.
 *
 * Embedded mode (chạy trong web-shell): ShellContext có sẵn → chỉ render
 * sidebar + outlet. AppHeader đã được render ở MainLayout phía trên — tránh
 * double header.
 *
 * Standalone mode (chạy trong dev.tsx): ShellContext không có → render đầy
 * đủ AdminShell với AppHeader riêng để dev/test độc lập.
 *
 * Source: design-system/patterns/app-header.md
 */
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CloudOutlined,
  SettingOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { AdminShell } from '@cachesol/design-system';
import {
  useShell,
  useShellAvailable,
  resolveIcon,
  type AppSwitcherItem,
} from '@cachesol/design-system';
import { PlatformRegistryProvider, usePlatformRegistryContext } from './PlatformRegistryContext';

const MENU_ITEMS = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/tenants', label: 'Tenants', icon: <TeamOutlined /> },
  { key: '/mini-apps', label: 'Mini-apps', icon: <AppstoreOutlined /> },
  { key: '/providers', label: 'Providers', icon: <CloudOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> },
  { key: '/audit', label: 'Audit log', icon: <HistoryOutlined /> },
];

const REGISTRY_DEFAULT_APPS: AppSwitcherItem[] = [
  { id: 'registry-admin', label: 'Platform Registry', href: '/registry', icon: resolveIcon('appstore'), description: 'Tenants, mini-apps, providers', active: true },
  { id: 'tenant-manager-admin', label: 'Tenant Manager', href: '/tenant-manager', icon: resolveIcon('team'), description: 'Quản trị tenant' },
  { id: 'hrm-mini-app', label: 'HRM', href: '/hrm/employees', icon: resolveIcon('team'), description: 'Quản lý nhân sự' },
];

function RegistryAdminInner({ children, embedded }: { children: React.ReactNode; embedded: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = usePlatformRegistryContext();
  const shell = useShell();

  // ── Sync local context → ShellContext (embedded mode only) ──
  useEffect(() => {
    if (!embedded) return;

    // Sync app switcher
    shell.setAppSwitcher(REGISTRY_DEFAULT_APPS);
    shell.setActiveAppId('registry-admin');
    shell.setBrand({ name: 'Platform Registry' });

    // Config dropdown — pull from existing shell.user if any
    shell.setConfigItems([
      { key: 'general', label: <Link to="/settings">General settings</Link> },
      { key: 'mini-apps', label: <Link to="/mini-apps">Mini-apps catalog</Link> },
      { key: 'providers', label: <Link to="/providers">Providers</Link> },
      { key: 'audit', label: <Link to="/audit">Audit log</Link> },
    ]);
  }, [embedded, shell]);

  // Standalone mode: auto-login admin nếu chưa có (mock trong dev).
  useEffect(() => {
    if (embedded) return;
    if (!ctx.user) {
      ctx.login({ name: 'Platform Admin', email: 'admin@cachesol.io' });
    }
  }, [ctx, embedded]);

  const selectedKey =
    MENU_ITEMS.find((m) => location.pathname === m.key)
      ? location.pathname
      : MENU_ITEMS.find((m) => m.key !== '/' && location.pathname.startsWith(m.key))?.key ?? '/';

  const logo = (
    <strong style={{ color: '#1890ff', fontSize: 18, letterSpacing: 0.5 }}>
      CacheSol
    </strong>
  );

  const sidebar = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      style={{ border: 0, height: '100%' }}
      onClick={(e) => navigate(e.key)}
      items={MENU_ITEMS}
    />
  );

  // ── Embedded: chỉ render children (sidebar + header đã ở MainLayout) ──
  if (embedded) {
    return <>{children}</>;
  }

  // ── Standalone: render full AdminShell + AppHeader ──
  return (
    <AdminShell
      adminId="registry-admin"
      logo={logo}
      appName="Platform Registry"
      appSwitcher={ctx.appSwitcher}
      activeAppId={ctx.activeAppId}
      user={
        ctx.user
          ? {
              name: ctx.user.name,
              email: ctx.user.email,
              avatarUrl: ctx.user.avatarUrl,
            }
          : undefined
      }
      notifications={ctx.notifications}
      sidebar={sidebar}
      appHeaderProps={{
        onAppSelect: (app) => navigate(app.href),
        onNotificationClick: (n) => {
          ctx.markRead(n.id);
          if (n.href) navigate(n.href);
        },
        onMarkAllRead: () => ctx.markAllRead(),
        onSeeAllNotifications: () => navigate('/notifications'),
        onLanguageClick: () => {
          ctx.setLanguage(ctx.language === 'en' ? 'vi' : 'en');
        },
        onThemeClick: () => {
          const next = ctx.theme === 'light' ? 'dark' : 'light';
          ctx.setTheme(next);
        },
        currentLanguage: ctx.language,
        currentTheme: ctx.theme,
        onConfigClick: () => navigate('/settings'),
        configItems: [
          { key: 'general', label: <Link to="/settings">General settings</Link> },
          { key: 'mini-apps', label: <Link to="/mini-apps">Mini-apps catalog</Link> },
          { key: 'providers', label: <Link to="/providers">Providers</Link> },
          { key: 'audit', label: <Link to="/audit">Audit log</Link> },
        ],
        onAccountSettings: () => navigate('/settings'),
        onLogout: () => {
          ctx.logout();
          navigate('/login');
        },
      }}
    >
      {children}
    </AdminShell>
  );
}

export function RegistryAdminShell({ children }: { children: React.ReactNode }) {
  const embedded = useShellAvailable();
  return (
    <PlatformRegistryProvider>
      <RegistryAdminInner embedded={embedded}>{children}</RegistryAdminInner>
    </PlatformRegistryProvider>
  );
}

export default RegistryAdminShell;
