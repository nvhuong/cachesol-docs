/**
 * AdminShell — composes AppHeader + main content area + Layout cho admin webs.
 *
 * - Hiển thị header global ở top.
 * - Có toggle hide/show header (ẩn → chỉ còn content).
 * - Sidebar (optional).
 * - Modal "All apps" cho app switcher grid view.
 *
 * Stateless: truyền vào props. Logic (auth, theme, lang, ...) do host quản lý.
 */
import { useState } from 'react';
import { Layout, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import {
  AppHeader,
  type AppHeaderProps,
  type AppSwitcherItem,
} from './AppHeader';
import { useHeaderVisibility } from '../hooks/useHeaderVisibility';

const { Sider, Content, Header } = Layout;

export interface AdminShellProps {
  /** Admin mini-app id (used for persistence keys). */
  adminId: string;
  /** Logo. */
  logo: React.ReactNode;
  /** Display name (e.g. "Platform Registry"). */
  appName: string;
  /** App switcher list. */
  appSwitcher: AppSwitcherItem[];
  /** Currently active app id (highlighted in switcher). */
  activeAppId?: string;
  /** User info. */
  user?: AppHeaderProps['user'];
  /** Notifications. */
  notifications?: AppHeaderProps['notifications'];
  /** Sidebar (optional). */
  sidebar?: React.ReactNode;
  /** Sidebar width (default 240). */
  sidebarWidth?: number;
  /** Default header visibility (default true). */
  defaultHeaderVisible?: boolean;
  /** Page content. */
  children: React.ReactNode;
  /** Custom header slot (rare use). */
  headerSlot?: React.ReactNode;
  /** All other AppHeader props except `logo`, `appName`, etc. */
  appHeaderProps?: Omit<
    AppHeaderProps,
    | 'logo'
    | 'appName'
    | 'appSwitcher'
    | 'user'
    | 'notifications'
    | 'headerVisible'
    | 'onToggleHeaderVisibility'
    | 'children'
  >;
}

export function AdminShell({
  adminId,
  logo,
  appName,
  appSwitcher,
  activeAppId,
  user,
  notifications = [],
  sidebar,
  sidebarWidth = 240,
  defaultHeaderVisible = true,
  children,
  headerSlot,
  appHeaderProps,
}: AdminShellProps) {
  const { visible: headerVisible, toggle: toggleHeader, set: setHeader } =
    useHeaderVisibility(adminId, defaultHeaderVisible);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mark active app on switcher items for callers that don't pre-mark.
  const appSwitcherWithActive = appSwitcher.map((a) => ({
    ...a,
    active: a.active ?? a.id === activeAppId,
  }));

  return (
    <Layout className="cs-admin-shell" style={{ minHeight: '100vh' }}>
      {headerVisible && (
        <Header className="cs-admin-shell__header" style={{ padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {sidebar && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileSidebarOpen(true)}
                className="cs-admin-shell__menu-toggle"
                aria-label="Open menu"
              />
            )}
            <AppHeader
              {...appHeaderProps}
              logo={logo}
              appName={appName}
              appSwitcher={appSwitcherWithActive}
              user={user}
              notifications={notifications}
              headerVisible={headerVisible}
              onToggleHeaderVisibility={setHeader}
            >
              {headerSlot}
            </AppHeader>
          </div>
        </Header>
      )}

      <Layout>
        {sidebar && (
          <>
            <Sider
              width={sidebarWidth}
              className="cs-admin-shell__sider"
              breakpoint="md"
              collapsedWidth={0}
              trigger={null}
            >
              <div
                className="cs-admin-shell__sider-inner"
                style={{ width: sidebarWidth }}
              >
                {sidebar}
              </div>
            </Sider>
            <Drawer
              open={mobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
              placement="left"
              width={sidebarWidth}
              title={appName}
              styles={{ body: { padding: 0 } }}
            >
              {sidebar}
            </Drawer>
          </>
        )}

        <Content className="cs-admin-shell__content">{children}</Content>
      </Layout>

      {!headerVisible && (
        <Button
          type="primary"
          size="small"
          onClick={toggleHeader}
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            zIndex: 999,
          }}
        >
          Show header
        </Button>
      )}
    </Layout>
  );
}

export default AdminShell;
