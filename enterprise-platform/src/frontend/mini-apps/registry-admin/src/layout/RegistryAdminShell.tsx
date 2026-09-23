/**
 * RegistryAdminShell — composes AdminShell + sidebar + router outlet.
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
import { PlatformRegistryProvider, usePlatformRegistryContext } from './PlatformRegistryContext';

const MENU_ITEMS = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/tenants', label: 'Tenants', icon: <TeamOutlined /> },
  { key: '/mini-apps', label: 'Mini-apps', icon: <AppstoreOutlined /> },
  { key: '/providers', label: 'Providers', icon: <CloudOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> },
  { key: '/audit', label: 'Audit log', icon: <HistoryOutlined /> },
];

function RegistryAdminInner({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = usePlatformRegistryContext();

  // Auto-login admin nếu chưa có (mock trong dev).
  useEffect(() => {
    if (!ctx.user) {
      ctx.login({ name: 'Platform Admin', email: 'admin@cachesol.io' });
    }
  }, [ctx]);

  const selectedKey = MENU_ITEMS.find((m) => location.pathname === m.key)
    ? location.pathname
    : MENU_ITEMS.find((m) => m.key !== '/' && location.pathname.startsWith(m.key))?.key ?? '/';

  const logo = (
    <strong style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-body-md)' }}>
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
  return (
    <PlatformRegistryProvider>
      <RegistryAdminInner>{children}</RegistryAdminInner>
    </PlatformRegistryProvider>
  );
}

export default RegistryAdminShell;
