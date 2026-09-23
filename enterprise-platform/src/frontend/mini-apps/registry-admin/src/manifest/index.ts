/**
 * Registry Admin — Platform Registry administration mini-app.
 *
 * Requires authentication (Keycloak role: `registry_admin`).
 *
 * Capabilities:
 * - Tenants CRUD + provision status
 * - Mini-apps catalog (publish / unpublish)
 * - Providers (Keycloak, Stripe, ...)
 * - Audit log
 * - Settings
 */
import type { MiniAppManifest } from '@cachesol/shared-types';
import type { ComponentType } from 'react';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { TenantsListPage } from '../pages/tenants/TenantsListPage';
import { TenantDetailPage } from '../pages/tenants/TenantDetailPage';
import { MiniAppsCatalogPage } from '../pages/mini-apps/MiniAppsCatalogPage';
import { ProvidersPage } from '../pages/providers/ProvidersPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { AuditLogPage } from '../pages/settings/AuditLogPage';

const eager = <T,>(c: T) => async () => ({ default: c as unknown as ComponentType });

const LoginPageLazy = eager(LoginPage);
const DashboardPageLazy = eager(DashboardPage);
const TenantsListPageLazy = eager(TenantsListPage);
const TenantDetailPageLazy = eager(TenantDetailPage);
const MiniAppsCatalogPageLazy = eager(MiniAppsCatalogPage);
const ProvidersPageLazy = eager(ProvidersPage);
const SettingsPageLazy = eager(SettingsPage);
const AuditLogPageLazy = eager(AuditLogPage);

export const manifest: MiniAppManifest = {
  id: 'registry-admin',
  name: 'Platform Registry',
  version: '1.0.0',
  description: 'Quản trị Platform Registry — tenants, mini-apps, providers, audit',
  icon: 'appstore',
  author: 'CacheSol',

  routes: [
    { path: '/login', title: 'Sign in', component: LoginPageLazy, layout: 'blank', showInMenu: false, permissions: ['registry_admin'] },
    { path: '/', title: 'Dashboard', component: DashboardPageLazy, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/tenants', title: 'Tenants', component: TenantsListPageLazy, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/tenants/:id', title: 'Tenant detail', component: TenantDetailPageLazy, layout: 'main', showInMenu: false, permissions: ['registry_admin'] },
    { path: '/mini-apps', title: 'Mini-apps', component: MiniAppsCatalogPageLazy, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/providers', title: 'Providers', component: ProvidersPageLazy, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/settings', title: 'Settings', component: SettingsPageLazy, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/audit', title: 'Audit log', component: AuditLogPageLazy, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
  ],

  permissions: ['registry_admin'],

  menu: [
    { key: 'dashboard', labelKey: 'menu.dashboard', icon: 'dashboard', order: 1, path: '/' },
    { key: 'tenants', labelKey: 'menu.tenants', icon: 'team', order: 2, path: '/tenants' },
    { key: 'mini-apps', labelKey: 'menu.mini-apps', icon: 'appstore', order: 3, path: '/mini-apps' },
    { key: 'providers', labelKey: 'menu.providers', icon: 'cloud', order: 4, path: '/providers' },
    { key: 'settings', labelKey: 'menu.settings', icon: 'setting', order: 5, path: '/settings' },
    { key: 'audit', labelKey: 'menu.audit', icon: 'history', order: 6, path: '/audit' },
  ],

  api: {
    baseUrl: '/api/platform-registry',
    endpoints: {
      tenants: '/v1/admin/tenants',
      miniApps: '/v1/admin/mini-apps',
      providers: '/v1/admin/providers',
      audit: '/v1/admin/audit',
      settings: '/v1/admin/settings',
    },
  },
};
