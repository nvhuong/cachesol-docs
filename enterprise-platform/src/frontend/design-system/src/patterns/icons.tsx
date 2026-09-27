/**
 * Icon registry — maps short icon-name tokens (used in mini-app manifests
 * and menu entries) to actual @ant-design/icons React nodes.
 *
 * Centralising this means callers in the web-shell or any mini-app can do:
 *     import { resolveIcon } from '@cachesol/design-system';
 *     icon: resolveIcon('team')
 * instead of hand-rolling a per-app ICON_MAP.
 *
 * Conventions:
 *   - Keys are lowercase strings (kebab-case or single-word): 'team', 'appstore',
 *     'dashboard', 'cloud', 'history', 'safety', 'idcard', 'cluster', 'rocket'.
 *   - Anything unknown falls back to <AppstoreOutlined />.
 *   - Inputs that are already ReactNode (e.g. when an admin shell passes a JSX
 *     element) are returned unchanged.
 */
import type { ReactNode } from 'react';
import {
  AppstoreOutlined,
  TeamOutlined,
  DashboardOutlined,
  ClusterOutlined,
  CloudOutlined,
  HistoryOutlined,
  SafetyOutlined,
  IdcardOutlined,
  UserOutlined,
  RocketOutlined,
  SettingOutlined,
  HomeOutlined,
  BellOutlined,
  CheckOutlined,
  GlobalOutlined,
  MenuOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  BgColorsOutlined,
  CompressOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

export const ICON_REGISTRY: Record<string, ReactNode> = {
  appstore: <AppstoreOutlined />,
  home: <HomeOutlined />,
  team: <TeamOutlined />,
  user: <UserOutlined />,
  dashboard: <DashboardOutlined />,
  cluster: <ClusterOutlined />,
  cloud: <CloudOutlined />,
  history: <HistoryOutlined />,
  safety: <SafetyOutlined />,
  idcard: <IdcardOutlined />,
  rocket: <RocketOutlined />,
  setting: <SettingOutlined />,
  bell: <BellOutlined />,
  check: <CheckOutlined />,
  global: <GlobalOutlined />,
  menu: <MenuOutlined />,
  eye: <EyeOutlined />,
  'eye-invisible': <EyeInvisibleOutlined />,
  theme: <BgColorsOutlined />,
  density: <CompressOutlined />,
  logout: <LogoutOutlined />,
};

/** Resolve a short icon name to a React node; passes through non-strings. */
export function resolveIcon(name: ReactNode | string | null | undefined): ReactNode {
  if (name == null) return <AppstoreOutlined />;
  if (typeof name !== 'string') return name;
  const key = name.trim().toLowerCase();
  return ICON_REGISTRY[key] ?? <AppstoreOutlined />;
}

export default resolveIcon;