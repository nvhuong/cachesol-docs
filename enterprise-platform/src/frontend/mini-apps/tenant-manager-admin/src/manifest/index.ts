/**
 * Tenant Manager Admin — quản trị backend của Tenant Manager.
 *
 * Capabilities:
 * - Organizations (departments, positions, locations)
 * - Employees (CRUD + lifecycle)
 * - Job titles
 * - Roles + permissions
 * - App users (Keycloak-synced)
 * - Keycloak sync dashboard
 * - Provisioning status của mini-apps
 * - Audit log
 * - Settings
 *
 * Auth: Keycloak role `tenant_admin`
 */
import type { MiniAppManifest } from '@cachesol/shared-types';
import { lazy } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const OrganizationsListPage = lazy(() => import('./pages/organizations/OrganizationsListPage').then((m) => ({ default: m.OrganizationsListPage })));
const EmployeesListPage = lazy(() => import('./pages/employees/EmployeesListPage').then((m) => ({ default: m.EmployeesListPage })));
const JobTitlesPage = lazy(() => import('./pages/job-titles/JobTitlesPage').then((m) => ({ default: m.JobTitlesPage })));
const RolesPage = lazy(() => import('./pages/roles/RolesPage').then((m) => ({ default: m.RolesPage })));
const UsersPage = lazy(() => import('./pages/users/UsersPage').then((m) => ({ default: m.UsersPage })));
const KeycloakSyncPage = lazy(() => import('./pages/keycloak/KeycloakSyncPage').then((m) => ({ default: m.KeycloakSyncPage })));
const ProvisioningPage = lazy(() => import('./pages/provisioning/ProvisioningPage').then((m) => ({ default: m.ProvisioningPage })));
const AuditLogPage = lazy(() => import('./pages/audit/AuditLogPage').then((m) => ({ default: m.AuditLogPage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

export const manifest: MiniAppManifest = {
  id: 'tenant-manager-admin',
  name: 'Tenant Manager',
  version: '1.0.0',
  description: 'Quản trị backend Tenant Manager — orgs, employees, roles, Keycloak sync',
  icon: 'team',
  author: 'CacheSol',

  routes: [
    { path: '/login', title: 'Sign in', component: LoginPage, layout: 'blank', showInMenu: false, permissions: ['tenant_admin'] },
    { path: '/', title: 'Dashboard', component: DashboardPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/organizations', title: 'Organizations', component: OrganizationsListPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/employees', title: 'Employees', component: EmployeesListPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/job-titles', title: 'Job titles', component: JobTitlesPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/roles', title: 'Roles & permissions', component: RolesPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/users', title: 'App users', component: UsersPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/keycloak', title: 'Keycloak sync', component: KeycloakSyncPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/provisioning', title: 'Provisioning', component: ProvisioningPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/audit', title: 'Audit log', component: AuditLogPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/settings', title: 'Settings', component: SettingsPage, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
  ],

  permissions: ['tenant_admin'],

  menu: [
    { key: 'dashboard', labelKey: 'menu.dashboard', icon: 'dashboard', order: 1, path: '/' },
    { key: 'orgs', labelKey: 'menu.organizations', icon: 'cluster', order: 2, path: '/organizations' },
    { key: 'employees', labelKey: 'menu.employees', icon: 'team', order: 3, path: '/employees' },
    { key: 'job-titles', labelKey: 'menu.job-titles', icon: 'idcard', order: 4, path: '/job-titles' },
    { key: 'roles', labelKey: 'menu.roles', icon: 'safety', order: 5, path: '/roles' },
    { key: 'users', labelKey: 'menu.users', icon: 'user', order: 6, path: '/users' },
    { key: 'keycloak', labelKey: 'menu.keycloak', icon: 'cloud', order: 7, path: '/keycloak' },
    { key: 'provisioning', labelKey: 'menu.provisioning', icon: 'rocket', order: 8, path: '/provisioning' },
    { key: 'audit', labelKey: 'menu.audit', icon: 'history', order: 9, path: '/audit' },
    { key: 'settings', labelKey: 'menu.settings', icon: 'setting', order: 99, path: '/settings' },
  ],

  api: {
    baseUrl: '/api/tenant-manager',
    endpoints: {
      organizations: '/v1/organizations',
      employees: '/v1/employees',
      jobTitles: '/v1/job-titles',
      roles: '/v1/roles',
      appUsers: '/v1/app-users',
      keycloakSync: '/v1/keycloak/sync',
      provisioning: '/v1/provisioning',
      audit: '/v1/audit',
      settings: '/v1/settings',
    },
  },
};
