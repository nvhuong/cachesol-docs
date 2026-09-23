/**
 * Landing Mini App — Public catalog + registration.
 * NO authentication required for browse; POST /tenants/register requires no auth.
 */
import type { MiniAppManifest } from '@cachesol/shared-types';
import { lazy } from 'react';

const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })),
);
const MiniAppDetailPage = lazy(() =>
  import('./pages/MiniAppDetailPage').then((m) => ({ default: m.MiniAppDetailPage })),
);
const RegistrationPage = lazy(() =>
  import('./pages/RegistrationPage').then((m) => ({ default: m.RegistrationPage })),
);
const RegistrationSuccessPage = lazy(() =>
  import('./pages/RegistrationSuccessPage').then((m) => ({ default: m.RegistrationSuccessPage })),
);

export const manifest: MiniAppManifest = {
  id: 'landing-mini-app',
  name: 'CacheSol Landing',
  version: '1.0.0',
  description: 'Public landing page — discover mini-apps and register your tenant',
  icon: 'home',
  author: 'CacheSol',

  routes: [
    {
      path: '/',
      title: 'Home',
      component: LandingPage,
      layout: 'blank',
      showInMenu: false,
    },
    {
      path: '/apps',
      title: 'All apps',
      component: LandingPage,
      layout: 'blank',
      showInMenu: false,
    },
    {
      path: '/apps/:appId',
      title: 'App detail',
      component: MiniAppDetailPage,
      layout: 'blank',
      showInMenu: false,
    },
    {
      path: '/register',
      title: 'Register',
      component: RegistrationPage,
      layout: 'blank',
      showInMenu: false,
    },
    {
      path: '/register/success',
      title: 'Registration successful',
      component: RegistrationSuccessPage,
      layout: 'blank',
      showInMenu: false,
    },
  ],

  permissions: [], // Public

  menu: [], // No menu — public page

  api: {
    baseUrl: import.meta.env?.VITE_PLATFORM_REGISTRY_BASE_URL ?? '/api/platform-registry',
    endpoints: {
      tenantRegister: '/v1/tenants/register',
      miniAppsPublic: '/v1/public/mini-apps',
    },
  },
};
