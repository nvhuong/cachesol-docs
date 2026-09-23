/**
 * AppHeader — Topbar shell cho CacheSol Admin Webs.
 *
 * Layout từ trái sang phải (theo yêu cầu nghiệp vụ):
 *   [Logo] [App switcher: App1 · App2 · App3 · App4 · More▼] [Config▼] [Notice] [Hide/Show] [Account▼]
 *
 * Source: /design-system/patterns/app-header.md
 *
 * Stateless: mọi state (danh sách app, unread count, hide header, theme/lang/density)
 * được quản lý bởi hook bên ngoài (useAuth, useTheme, useNotifications, ...).
 * Component này chỉ render UI + dispatch sự kiện qua callback.
 */
import { useState, useMemo, type ReactNode } from 'react';
import {
  Dropdown,
  Badge,
  Popover,
  Avatar,
  Button,
  Modal,
  Segmented,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  BellOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  CompressOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useDensity } from '../hooks/useDensity';

export interface AppSwitcherItem {
  /** Stable ID. */
  id: string;
  /** App name (e.g. "HRM"). */
  label: string;
  /** Icon URL hoặc ReactNode. */
  icon?: ReactNode;
  /** Tooltip / description. */
  description?: string;
  /** URL để navigate tới app đó khi chọn. */
  href: string;
  /** Đánh dấu app hiện tại. */
  active?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  href?: string;
  /** ISO timestamp. */
  timestamp: string;
  read?: boolean;
}

export interface AppHeaderProps {
  /** Brand logo (image URL hoặc ReactNode). */
  logo: ReactNode;
  /** Optional href khi click logo (default navigate to '/'). */
  logoHref?: string;
  /** Tên app hiện tại (e.g. "Tenant Manager"), hiển thị cạnh logo. */
  appName?: string;
  /** Danh sách mini-apps hiển thị inline (thường 3-4 apps). */
  appSwitcher: AppSwitcherItem[];
  /** Số app hiển thị inline trước khi collapse vào "More" button. */
  visibleAppCount?: number;
  /** Callback khi user chọn 1 app — thường navigate tới href. */
  onAppSelect?: (app: AppSwitcherItem) => void;
  /** Config dropdown items (route tới /settings, /integrations, ...). */
  configItems?: { key: string; label: ReactNode; onClick?: () => void; href?: string }[];
  /** Callback mở config page. */
  onConfigClick?: () => void;
  /** Notifications list. */
  notifications?: NotificationItem[];
  /** Callback khi user click 1 notification. */
  onNotificationClick?: (n: NotificationItem) => void;
  /** Callback "Mark all read". */
  onMarkAllRead?: () => void;
  /** Callback mở trang notifications đầy đủ. */
  onSeeAllNotifications?: () => void;
  /** Trạng thái header hiện tại. */
  headerVisible: boolean;
  /** Callback toggle hide/show header. */
  onToggleHeaderVisibility: (visible: boolean) => void;
  /** Avatar hoặc tên user hiện tại. */
  user?: { name: string; email?: string; avatarUrl?: string };
  /** Callback mở account settings. */
  onAccountSettings?: () => void;
  /** Callback logout. */
  onLogout?: () => void;
  /** Callback mở language switcher. */
  onLanguageClick?: () => void;
  /** Callback mở theme switcher. */
  onThemeClick?: () => void;
  /** Selected language code (hiển thị trong account menu). */
  currentLanguage?: string;
  /** Selected theme name (hiển thị trong account menu). */
  currentTheme?: string;
  /** Slot bổ sung bên phải (trước account). */
  children?: ReactNode;
}

const MAX_INLINE = 4;
const GRID_COLUMNS = 3;

export function AppHeader({
  logo,
  logoHref = '/',
  appName,
  appSwitcher,
  visibleAppCount = MAX_INLINE,
  onAppSelect,
  configItems,
  onConfigClick,
  notifications = [],
  onNotificationClick,
  onMarkAllRead,
  onSeeAllNotifications,
  headerVisible,
  onToggleHeaderVisibility,
  user,
  onAccountSettings,
  onLogout,
  onLanguageClick,
  onThemeClick,
  currentLanguage = 'en',
  currentTheme = 'light',
  children,
}: AppHeaderProps) {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const { density, setDensity } = useDensity();

  const inlineApps = useMemo(
    () => appSwitcher.slice(0, visibleAppCount),
    [appSwitcher, visibleAppCount],
  );
  const overflowApps = useMemo(
    () => appSwitcher.slice(visibleAppCount),
    [appSwitcher, visibleAppCount],
  );
  const unread = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const renderAppTile = (app: AppSwitcherItem) => (
    <button
      key={app.id}
      type="button"
      className={`cs-app-tile ${app.active ? 'cs-app-tile--active' : ''}`}
      onClick={() => {
        onAppSelect?.(app);
        setAppModalOpen(false);
      }}
      title={app.description}
    >
      <span className="cs-app-tile__icon">
        {app.icon ?? <AppstoreOutlined />}
      </span>
      <span className="cs-app-tile__label">{app.label}</span>
      {app.active && (
        <span className="cs-app-tile__check" aria-label="active">
          <CheckOutlined />
        </span>
      )}
    </button>
  );

  const moreMenu: MenuProps | null = overflowApps.length > 0
    ? {
        items: overflowApps.map((a) => ({
          key: a.id,
          label: a.label,
          icon: <AppstoreOutlined />,
          onClick: () => onAppSelect?.(a),
        })),
      }
    : null;

  const configMenu: MenuProps | undefined = configItems && configItems.length > 0
    ? {
        items: configItems.map((c) => ({
          key: c.key,
          label: c.label,
          onClick: c.onClick,
        })),
      }
    : undefined;

  const notificationContent = (
    <div className="cs-notifications">
      <div className="cs-notifications__head">
        <span className="cs-notifications__title">Notifications</span>
        {onMarkAllRead && unread > 0 && (
          <Button type="link" size="small" onClick={onMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="cs-notifications__empty">No notifications</div>
      ) : (
        <ul className="cs-notifications__list">
          {notifications.slice(0, 8).map((n) => (
            <li
              key={n.id}
              className={`cs-notifications__item ${!n.read ? 'cs-notifications__item--unread' : ''}`}
              onClick={() => onNotificationClick?.(n)}
            >
              <div className="cs-notifications__item-title">{n.title}</div>
              {n.body && <div className="cs-notifications__item-body">{n.body}</div>}
              <div className="cs-notifications__item-time">
                {new Date(n.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
      {onSeeAllNotifications && notifications.length > 0 && (
        <div className="cs-notifications__footer">
          <Button type="link" block onClick={onSeeAllNotifications}>
            See all
          </Button>
        </div>
      )}
    </div>
  );

  const accountMenu: MenuProps = {
    items: [
      user && {
        key: 'user-info',
        type: 'group' as const,
        label: (
          <div className="cs-account-info">
            <Avatar size={48} src={user.avatarUrl} icon={<UserOutlined />} />
            <div>
              <div className="cs-account-info__name">{user.name}</div>
              {user.email && <div className="cs-account-info__email">{user.email}</div>}
            </div>
          </div>
        ),
      },
      { type: 'divider' as const },
      onLanguageClick && {
        key: 'language',
        icon: <GlobalOutlined />,
        label: (
          <span className="cs-account-menu-item">
            Language <span className="cs-account-menu-hint">{currentLanguage.toUpperCase()}</span>
          </span>
        ),
        onClick: onLanguageClick,
      },
      onThemeClick && {
        key: 'theme',
        icon: <BgColorsOutlined />,
        label: (
          <span className="cs-account-menu-item">
            Theme <span className="cs-account-menu-hint">{currentTheme}</span>
          </span>
        ),
        onClick: onThemeClick,
      },
      {
        key: 'density',
        icon: <CompressOutlined />,
        label: (
          <div className="cs-account-density">
            <span>Density</span>
            <Segmented
              size="small"
              value={density}
              onChange={(v) => setDensity(v as typeof density)}
              options={[
                { label: 'Compact', value: 'compact' },
                { label: 'Default', value: 'default' },
                { label: 'Comfy', value: 'comfortable' },
              ]}
            />
          </div>
        ),
      },
      { type: 'divider' as const },
      onAccountSettings && {
        key: 'settings',
        icon: <UserOutlined />,
        label: 'Account settings',
        onClick: onAccountSettings,
      },
      onLogout && {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Sign out',
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: 'Sign out?',
            content: 'You will need to sign in again to access this admin.',
            okText: 'Sign out',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => onLogout(),
          });
        },
      },
    ].filter(Boolean) as MenuProps['items'],
  };

  return (
    <header className="cs-app-header" data-density={density}>
      {/* Left cluster: Logo + App switcher */}
      <div className="cs-app-header__left">
        <a className="cs-app-header__logo" href={logoHref}>
          {logo}
          {appName && <span className="cs-app-header__app-name">{appName}</span>}
        </a>

        <nav className="cs-app-switcher" aria-label="App switcher">
          {inlineApps.map(renderAppTile)}

          {overflowApps.length > 0 && (
            <Dropdown menu={moreMenu!} placement="bottom" trigger={['click']}>
              <button type="button" className="cs-app-switcher__more">
                More <span className="cs-app-switcher__more-count">{overflowApps.length}</span>
              </button>
            </Dropdown>
          )}

          <button
            type="button"
            className="cs-app-switcher__grid"
            onClick={() => setAppModalOpen(true)}
            title="View all apps"
            aria-label="View all apps"
          >
            <AppstoreOutlined />
          </button>
        </nav>
      </div>

      {/* Right cluster */}
      <div className="cs-app-header__right">
        {children}

        {configItems && configItems.length > 0 && (
          <Dropdown menu={configMenu!} placement="bottomRight" trigger={['click']}>
            <button
              type="button"
              className="cs-app-header__btn"
              title="Configuration"
              aria-label="Configuration"
            >
              <SettingOutlined />
            </button>
          </Dropdown>
        )}

        {onConfigClick && (!configItems || configItems.length === 0) && (
          <button
            type="button"
            className="cs-app-header__btn"
            onClick={onConfigClick}
            title="Configuration"
            aria-label="Configuration"
          >
            <SettingOutlined />
          </button>
        )}

        <Popover
          content={notificationContent}
          trigger="click"
          placement="bottomRight"
          arrow={false}
          overlayClassName="cs-app-header-popover"
        >
          <button
            type="button"
            className="cs-app-header__btn"
            title="Notifications"
            aria-label="Notifications"
          >
            <Badge count={unread} size="small" offset={[-4, 4]}>
              <BellOutlined />
            </Badge>
          </button>
        </Popover>

        <button
          type="button"
          className="cs-app-header__btn"
          onClick={() => onToggleHeaderVisibility(!headerVisible)}
          title={headerVisible ? 'Hide header' : 'Show header'}
          aria-label={headerVisible ? 'Hide header' : 'Show header'}
        >
          {headerVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </button>

        {user && (
          <Dropdown menu={accountMenu} placement="bottomRight" trigger={['click']}>
            <button type="button" className="cs-app-header__account">
              <Avatar size={32} src={user.avatarUrl} icon={<UserOutlined />} />
              <span className="cs-app-header__account-name">{user.name}</span>
            </button>
          </Dropdown>
        )}
      </div>

      {/* Grid modal for app selector (3x3 / 2x2 / n×n) */}
      <Modal
        open={appModalOpen}
        onCancel={() => setAppModalOpen(false)}
        footer={null}
        title="All apps"
        width={520}
        destroyOnClose
      >
        <div
          className="cs-app-grid"
          style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)` }}
        >
          {appSwitcher.map(renderAppTile)}
        </div>
      </Modal>
    </header>
  );
}

export default AppHeader;

/**
 * Helper hook (optional, exported for convenience).
 * Chia apps thành inline + overflow tại tầng UI.
 */
export function useAppSwitcherSplit(
  apps: AppSwitcherItem[],
  visibleCount: number = MAX_INLINE,
) {
  return useMemo(() => {
    const safe = Math.max(1, visibleCount);
    return {
      inline: apps.slice(0, safe),
      overflow: apps.slice(safe),
    };
  }, [apps, visibleCount]);
}
