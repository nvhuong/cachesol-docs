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
import { lazy } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const TenantsListPage = lazy(() => import('./pages/tenants/TenantsListPage').then((m) => ({ default: m.TenantsListPage })));
const TenantDetailPage = lazy(() => import('./pages/tenants/TenantDetailPage').then((m) => ({ default: m.TenantDetailPage })));
const MiniAppsCatalogPage = lazy(() => import('./pages/mini-apps/MiniAppsCatalogPage').then((m) => ({ default: m.MiniAppsCatalogPage })));
const ProvidersPage = lazy(() => import('./pages/providers/ProvidersPage').then((m) => ({ default: m.ProvidersPage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AuditLogPage = lazy(() => import('./pages/settings/AuditLogPage').then((m) => ({ default: m.AuditLogPage })));

export const manifest: MiniAppManifest = {
  id: 'registry-admin',
  name: 'Platform Registry',
  version: '1.0.0',
  description: 'Quản trị Platform Registry — tenants, mini-apps, providers, audit',
  icon: 'appstore',
  author: 'CacheSol',

  routes: [
    { path: '/login', title: 'Sign in', component: LoginPage, layout: 'blank', showInMenu: false, permissions: ['registry_admin'] },
    { path: '/', title: 'Dashboard', component: DashboardPage, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/tenants', title: 'Tenants', component: TenantsListPage, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/tenants/:id', title: 'Tenant detail', component: TenantDetailPage, layout: 'main', showInMenu: false, permissions: ['registry_admin'] },
    { path: '/mini-apps', title: 'Mini-apps', component: MiniAppsCatalogPage, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/providers', title: 'Providers', component: ProvidersPage, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/settings', title: 'Settings', component: SettingsPage, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
    { path: '/audit', title: 'Audit log', component: AuditLogPage, layout: 'main', showInMenu: true, permissions: ['registry_admin'] },
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
