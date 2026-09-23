/**
 * Tenant Manager AdminShell — combines AdminShell + sidebar + content router.
 */
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  ClusterOutlined,
  TeamOutlined,
  IdcardOutlined,
  SafetyOutlined,
  UserOutlined,
  CloudOutlined,
  RocketOutlined,
  HistoryOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { AdminShell } from '@cachesol/design-system';
import { TenantManagerProvider, useTenantManager } from './TenantManagerContext';

const MENU_ITEMS = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/organizations', label: 'Organizations', icon: <ClusterOutlined /> },
  { key: '/employees', label: 'Employees', icon: <TeamOutlined /> },
  { key: '/job-titles', label: 'Job titles', icon: <IdcardOutlined /> },
  { key: '/roles', label: 'Roles & permissions', icon: <SafetyOutlined /> },
  { key: '/users', label: 'App users', icon: <UserOutlined /> },
  { key: '/keycloak', label: 'Keycloak sync', icon: <CloudOutlined /> },
  { key: '/provisioning', label: 'Provisioning', icon: <RocketOutlined /> },
  { key: '/audit', label: 'Audit log', icon: <HistoryOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> },
];

function TenantManagerAdminInner({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = useTenantManager();

  useEffect(() => {
    if (!ctx.user) {
      ctx.login({ name: 'Tenant Admin', email: 'admin@acme.com', tenantId: 'tnt_acme' });
    }
  }, [ctx]);

  const selectedKey =
    MENU_ITEMS.find((m) => m.key === location.pathname)?.key ??
    MENU_ITEMS.find((m) => m.key !== '/' && location.pathname.startsWith(m.key))?.key ??
    '/';

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
      adminId="tenant-manager-admin"
      logo={logo}
      appName="Tenant Manager"
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
        onSeeAllNotifications: () => navigate('/audit'),
        onLanguageClick: () => ctx.setLanguage(ctx.language === 'en' ? 'vi' : 'en'),
        onThemeClick: () => ctx.setTheme(ctx.theme === 'light' ? 'dark' : 'light'),
        currentLanguage: ctx.language,
        currentTheme: ctx.theme,
        onConfigClick: () => navigate('/settings'),
        configItems: [
          { key: 'general', label: <Link to="/settings">General settings</Link> },
          { key: 'orgs', label: <Link to="/organizations">Organizations</Link> },
          { key: 'employees', label: <Link to="/employees">Employees</Link> },
          { key: 'roles', label: <Link to="/roles">Roles & permissions</Link> },
          { key: 'keycloak', label: <Link to="/keycloak">Keycloak sync</Link> },
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

export function TenantManagerAdminShell({ children }: { children: React.ReactNode }) {
  return (
    <TenantManagerProvider>
      <TenantManagerAdminInner>{children}</TenantManagerAdminInner>
    </TenantManagerProvider>
  );
}

export default TenantManagerAdminShell;
