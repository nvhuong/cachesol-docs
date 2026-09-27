/**
 * MainLayout — shell layout cho authenticated mini-app pages.
 *
 * Cấu trúc đồng nhất với AdminShell:
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │  AppHeader (logo · app switcher · config · notif · acct)│
 *   ├──────────────┬──────────────────────────────────────────┤
 *   │              │                                          │
 *   │   Sidebar    │   <Outlet />  ← page content             │
 *   │   (active    │                                          │
 *   │    mini-app) │                                          │
 *   │              │                                          │
 *   └──────────────┴──────────────────────────────────────────┘
 *
 * State (app switcher, notifications, language/theme, density,
 * header visibility) đọc/ghi qua ShellContext (mounted ở main.tsx).
 *
 * Source: design-system/patterns/app-header.md
 */
import { useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppHeader,
  resolveIcon,
  type AppSwitcherItem,
} from '@cachesol/design-system';

import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { useMiniAppStore } from '@/stores/miniAppStore';
import { useShell } from '@cachesol/design-system';
import type { MenuProps } from 'antd';

const { Sider, Content } = Layout;

export function MainLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user: authUser, logout } = useAuthStore();
  const menuItems = useMiniAppStore((state) => state.getMenuItems());
  const activeMiniAppId = useMiniAppStore((state) => state.activeMiniAppId);
  const activeMiniApp = useMiniAppStore((state) =>
    activeMiniAppId ? state.getManifest(activeMiniAppId) : undefined,
  );
  const miniApps = useMiniAppStore((state) => state.miniApps);
  const setActiveMiniApp = useMiniAppStore((state) => state.setActiveMiniApp);

  // ── ShellContext (single source of truth cho header chrome) ──
  const shell = useShell();

  // Auto-detect which mini-app owns the current path and mark it active.
  useEffect(() => {
    const path = location.pathname;
    for (const app of miniApps) {
      const prefix = app.manifest.routePrefix;
      if (prefix && path.startsWith(`/${prefix}`)) {
        if (activeMiniAppId !== app.manifest.id) {
          setActiveMiniApp(app.manifest.id);
        }
        break;
      }
    }
  }, [location.pathname, miniApps, activeMiniAppId, setActiveMiniApp]);

  // ── Build sidebar menu from active mini-app's manifest ──
  const sidebarMenuItems: MenuProps['items'] = (menuItems ?? [])
    .filter((item) => item.path)
    .map((item) => ({
      key: item.path ?? item.key,
      label: t(item.labelKey, item.key),
      icon: resolveIcon(item.icon as string | null | undefined),
    }));

  const selectedKeys = (() => {
    const exact = sidebarMenuItems.find((m) => m?.key === location.pathname);
    if (exact) return [String(exact.key)];
    const prefix = sidebarMenuItems.find((m) =>
      typeof m?.key === 'string' &&
      m.key !== '/' &&
      location.pathname.startsWith(String(m.key)),
    );
    return prefix ? [String(prefix.key)] : [];
  })();

  // ── Sync mini-app store → ShellContext (app switcher + active app) ──
  useEffect(() => {
    const items: AppSwitcherItem[] = miniApps
      .filter((app) => app.manifest.routePrefix !== null)
      .map((app) => ({
        id: app.manifest.id,
        label: app.manifest.name,
        description: app.manifest.description,
        icon: resolveIcon(app.manifest.icon as string | null | undefined),
        href: `/${app.manifest.routePrefix ?? ''}`,
        active: app.manifest.id === activeMiniAppId,
      }));
    shell.setAppSwitcher(items);
    if (activeMiniAppId) {
      shell.setActiveAppId(activeMiniAppId);
      const cur = activeMiniApp;
      if (cur) {
        shell.setBrand({ name: cur.name });
      }
    }
  }, [miniApps, activeMiniAppId, activeMiniApp, shell]);

  // ── Sync auth user → ShellContext ──
  useEffect(() => {
    if (authUser) {
      shell.setUser({
        name: authUser.name,
        email: authUser.email,
        avatarUrl: authUser.avatarUrl,
      });
    } else {
      shell.setUser(null);
    }
  }, [authUser, shell]);

  const handleSidebarClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const logo = (
    <strong style={{ color: '#1890ff', fontSize: 18, letterSpacing: 0.5 }}>
      CacheSol
    </strong>
  );

  return (
    <div className="cs-admin-shell">
      {/* ── Header (sticky, full-width) ─────────────────────── */}
      {shell.headerVisible && (
        <div className="cs-admin-shell__header-wrap">
          <div className="cs-admin-shell__header-inner">
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              onClick={toggleSidebar}
              className="cs-admin-shell__menu-toggle"
              aria-label="Toggle sidebar"
            />
            <AppHeader
              logo={logo}
              logoHref="/dashboard"
              appName={shell.brand.name}
              appSwitcher={shell.appSwitcher}
              user={shell.user ?? undefined}
              notifications={shell.notifications}
              headerVisible={shell.headerVisible}
              onToggleHeaderVisibility={shell.setHeaderVisible}
              configItems={shell.configItems}
              currentLanguage={shell.language}
              currentTheme={shell.theme}
              onConfigClick={() => navigate('/settings')}
              onAppSelect={(app: AppSwitcherItem) => {
                shell.setActiveAppId(app.id);
                setActiveMiniApp(app.id);
                navigate(app.href);
              }}
              onNotificationClick={(n) => {
                shell.markNotificationRead(n.id);
                if (n.href) navigate(n.href);
              }}
              onMarkAllRead={shell.markAllNotificationsRead}
              onSeeAllNotifications={() => navigate('/notifications')}
              onLanguageClick={() =>
                shell.setLanguage(shell.language === 'vi' ? 'en' : 'vi')
              }
              onThemeClick={() =>
                shell.setTheme(shell.theme === 'light' ? 'dark' : 'light')
              }
              onAccountSettings={() => navigate('/settings')}
              onLogout={() => {
                logout();
                navigate('/login');
              }}
            />
          </div>
        </div>
      )}

      {/* ── Body: Sidebar + Content ─────────────────────────── */}
      <div className="cs-admin-shell__body">
        <Sider
          width={240}
          collapsedWidth={64}
          className="cs-admin-shell__sider"
          collapsed={sidebarCollapsed}
          trigger={null}
        >
          <div className="cs-admin-shell__sider-inner" style={{ width: 240 }}>
            {/* Sidebar header — app branding */}
            <div
              style={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                padding: sidebarCollapsed ? 0 : '0 16px',
                borderBottom: '1px solid var(--color-border-default)',
                gap: 8,
              }}
            >
              {!sidebarCollapsed && (
                <strong
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {shell.brand.name}
                </strong>
              )}
            </div>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              style={{ border: 0, flex: 1 }}
              onClick={handleSidebarClick}
              items={sidebarMenuItems}
            />
          </div>
        </Sider>

        <Content className="cs-admin-shell__content">
          {/* Mobile collapse toggle (visible only when sider collapsed) */}
          {sidebarCollapsed && (
            <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--color-border-default)' }}>
              <Button
                type="text"
                size="small"
                icon={<MenuUnfoldOutlined />}
                onClick={toggleSidebar}
              >
                Menu
              </Button>
            </div>
          )}
          <Outlet />
        </Content>
      </div>

      {/* Show-header pill when header is hidden */}
      {!shell.headerVisible && (
        <Button
          type="primary"
          size="small"
          onClick={shell.toggleHeaderVisible}
          className="cs-admin-shell__show-header"
        >
          Show header
        </Button>
      )}
    </div>
  );
}

export default MainLayout;
