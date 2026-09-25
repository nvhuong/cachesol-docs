/**
 * AdminShell — composes AppHeader + main content area + optional sidebar.
 *
 * Layout structure (NO double-header):
 *
 *   <div className="cs-admin-shell">
 *     {headerVisible && (
 *       <div className="cs-admin-shell__header-wrap">     ← sticky, full-width, owns bg + border
 *         <div className="cs-admin-shell__header-inner">  ← flex row for [toggle] + [AppHeader]
 *           {sidebar && <MenuOutlinedButton />}
 *           <AppHeader ... />                            ← <header> element, no Layout.Header
 *         </div>
 *       </div>
 *     )}
 *
 *     <div className="cs-admin-shell__body">              ← flex row for [sider] + [content]
 *       {sidebar && <Sider />}
 *       <Content>{children}</Content>
 *     </div>
 *
 *     {!headerVisible && <Button>Show header</Button>}
 *   </div>
 *
 * Stateless: all state (auth, theme, lang, ...) is owned by the caller.
 */
import { useState, type ReactNode } from 'react';
import { Layout, Button, Drawer } from 'antd';
import { MenuOutlined, EyeOutlined } from '@ant-design/icons';
import {
  AppHeader,
  type AppHeaderProps,
  type AppSwitcherItem,
} from './AppHeader';
import { useHeaderVisibility } from '../hooks/useHeaderVisibility';

const { Sider, Content } = Layout;

export interface AdminShellProps {
  /** Admin mini-app id (used for persistence keys). */
  adminId: string;
  /** Logo. */
  logo: ReactNode;
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
  sidebar?: ReactNode;
  /** Sidebar width (default 240). */
  sidebarWidth?: number;
  /** Default header visibility (default true). */
  defaultHeaderVisible?: boolean;
  /** Page content. */
  children: ReactNode;
  /** Custom header slot (rare use). */
  headerSlot?: ReactNode;
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
  const { visible: headerVisible, toggle: toggleHeader, setVisible: setHeader } =
    useHeaderVisibility(adminId, defaultHeaderVisible);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mark active app on switcher items for callers that don't pre-mark.
  const appSwitcherWithActive = appSwitcher.map((a) => ({
    ...a,
    active: a.active ?? a.id === activeAppId,
  }));

  return (
    <div className="cs-admin-shell">
      {headerVisible && (
        <div className="cs-admin-shell__header-wrap">
          <div className="cs-admin-shell__header-inner">
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
        </div>
      )}

      <div className="cs-admin-shell__body">
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
              width={Math.min(sidebarWidth, 320)}
              title={appName}
              styles={{ body: { padding: 0 } }}
            >
              {sidebar}
            </Drawer>
          </>
        )}

        <Content className="cs-admin-shell__content">{children}</Content>
      </div>

      {!headerVisible && (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={toggleHeader}
          className="cs-admin-shell__show-header"
          aria-label="Show header"
        >
          Show header
        </Button>
      )}
    </div>
  );
}

export default AdminShell;
