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
import type { ComponentType } from 'react';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { OrganizationsListPage } from '../pages/organizations/OrganizationsListPage';
import { EmployeesListPage } from '../pages/employees/EmployeesListPage';
import { JobTitlesPage } from '../pages/job-titles/JobTitlesPage';
import { RolesPage } from '../pages/roles/RolesPage';
import { UsersPage } from '../pages/users/UsersPage';
import { KeycloakSyncPage } from '../pages/keycloak/KeycloakSyncPage';
import { ProvisioningPage } from '../pages/provisioning/ProvisioningPage';
import { AuditLogPage } from '../pages/audit/AuditLogPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

const eager = <T,>(c: T) => async () => ({ default: c as unknown as ComponentType });

const LoginPageLazy = eager(LoginPage);
const DashboardPageLazy = eager(DashboardPage);
const OrganizationsListPageLazy = eager(OrganizationsListPage);
const EmployeesListPageLazy = eager(EmployeesListPage);
const JobTitlesPageLazy = eager(JobTitlesPage);
const RolesPageLazy = eager(RolesPage);
const UsersPageLazy = eager(UsersPage);
const KeycloakSyncPageLazy = eager(KeycloakSyncPage);
const ProvisioningPageLazy = eager(ProvisioningPage);
const AuditLogPageLazy = eager(AuditLogPage);
const SettingsPageLazy = eager(SettingsPage);

export const manifest: MiniAppManifest = {
  id: 'tenant-manager-admin',
  name: 'Tenant Manager',
  version: '1.0.0',
  description: 'Quản trị backend Tenant Manager — orgs, employees, roles, Keycloak sync',
  icon: 'team',
  author: 'CacheSol',

  routes: [
    { path: '/login', title: 'Sign in', component: LoginPageLazy, layout: 'blank', showInMenu: false, permissions: ['tenant_admin'] },
    { path: '/', title: 'Dashboard', component: DashboardPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/organizations', title: 'Organizations', component: OrganizationsListPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/employees', title: 'Employees', component: EmployeesListPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/job-titles', title: 'Job titles', component: JobTitlesPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/roles', title: 'Roles & permissions', component: RolesPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/users', title: 'App users', component: UsersPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/keycloak', title: 'Keycloak sync', component: KeycloakSyncPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/provisioning', title: 'Provisioning', component: ProvisioningPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/audit', title: 'Audit log', component: AuditLogPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
    { path: '/settings', title: 'Settings', component: SettingsPageLazy, layout: 'main', showInMenu: true, permissions: ['tenant_admin'] },
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
