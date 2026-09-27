/**
 * Tenant Manager AdminShell — combines AdminShell + sidebar + content router.
 *
 * Embedded mode (chạy trong web-shell): ShellContext có sẵn → chỉ render
 * sidebar + outlet. AppHeader đã được render ở MainLayout phía trên.
 *
 * Standalone mode (chạy trong dev.tsx): ShellContext không có → render đầy
 * đủ AdminShell với AppHeader riêng.
 *
 * Source: design-system/patterns/app-header.md
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
import {
  AdminShell,
  useShell,
  useShellAvailable,
  resolveIcon,
  type AppSwitcherItem,
} from '@cachesol/design-system';
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

const TENANT_MANAGER_DEFAULT_APPS: AppSwitcherItem[] = [
  { id: 'tenant-manager-admin', label: 'Tenant Manager', href: '/tenant-manager', icon: resolveIcon('team'), description: 'Quản trị tenant', active: true },
  { id: 'registry-admin', label: 'Platform Registry', href: '/registry', icon: resolveIcon('appstore'), description: 'Tenants, mini-apps, providers' },
  { id: 'hrm-mini-app', label: 'HRM', href: '/hrm/employees', icon: resolveIcon('team'), description: 'Quản lý nhân sự' },
];

function TenantManagerAdminInner({
  children,
  embedded,
}: {
  children: React.ReactNode;
  embedded: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = useTenantManager();
  const shell = useShell();

  // ── Sync local context → ShellContext (embedded mode only) ──
  useEffect(() => {
    if (!embedded) return;

    shell.setAppSwitcher(TENANT_MANAGER_DEFAULT_APPS);
    shell.setActiveAppId('tenant-manager-admin');
    shell.setBrand({ name: 'Tenant Manager' });
    shell.setConfigItems([
      { key: 'general', label: <Link to="/settings">General settings</Link> },
      { key: 'orgs', label: <Link to="/organizations">Organizations</Link> },
      { key: 'employees', label: <Link to="/employees">Employees</Link> },
      { key: 'roles', label: <Link to="/roles">Roles & permissions</Link> },
      { key: 'keycloak', label: <Link to="/keycloak">Keycloak sync</Link> },
      { key: 'audit', label: <Link to="/audit">Audit log</Link> },
    ]);
  }, [embedded, shell]);

  // Standalone: auto-login mock admin
  useEffect(() => {
    if (embedded) return;
    if (!ctx.user) {
      ctx.login({ name: 'Tenant Admin', email: 'admin@acme.com', tenantId: 'tnt_acme' });
    }
  }, [ctx, embedded]);

  const selectedKey =
    MENU_ITEMS.find((m) => m.key === location.pathname)?.key ??
    MENU_ITEMS.find((m) => m.key !== '/' && location.pathname.startsWith(m.key))?.key ??
    '/';

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

  // ── Standalone: full AdminShell + AppHeader ──
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
  const embedded = useShellAvailable();
  return (
    <TenantManagerProvider>
      <TenantManagerAdminInner embedded={embedded}>{children}</TenantManagerAdminInner>
    </TenantManagerProvider>
  );
}

export default TenantManagerAdminShell;
