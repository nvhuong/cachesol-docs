/**
 * Landing Mini App — Public catalog + registration.
 * NO authentication required for browse; POST /tenants/register requires no auth.
 */
import type { MiniAppManifest } from '@cachesol/shared-types';
import type { ComponentType } from 'react';
import { LandingPage } from '../pages/LandingPage';
import { MiniAppDetailPage } from '../pages/MiniAppDetailPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { RegistrationSuccessPage } from '../pages/RegistrationSuccessPage';

/** Convert eager component → lazy promise (matches MiniAppRoute.component signature). */
const eager = <T,>(c: T) => async () => ({ default: c as unknown as ComponentType });

const LandingPageLazy = eager(LandingPage);
const MiniAppDetailPageLazy = eager(MiniAppDetailPage);
const RegistrationPageLazy = eager(RegistrationPage);
const RegistrationSuccessPageLazy = eager(RegistrationSuccessPage);

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
      component: LandingPageLazy,
      layout: 'blank',
      showInMenu: false,
    },
    {
      path: '/apps',
      title: 'All apps',
      component: LandingPageLazy,
      layout: 'blank',
      showInMenu: false,
    },
    {
      path: '/apps/:appId',
      title: 'App detail',
      component: MiniAppDetailPageLazy,
      layout: 'blank',
      showInMenu: false,
    },
    {
      path: '/register',
      title: 'Register',
      component: RegistrationPageLazy,
      layout: 'blank',
      showInMenu: false,
    },
    {
      path: '/register/success',
      title: 'Registration successful',
      component: RegistrationSuccessPageLazy,
      layout: 'blank',
      showInMenu: false,
    },
  ],

  permissions: [], // Public

  menu: [], // No menu — public page

  api: {
    baseUrl: (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_PLATFORM_REGISTRY_BASE_URL ?? '/public-api/v1',
    endpoints: {
      tenantRegister: '/tenants/register',
      miniAppsPublic: '/public/mini-apps',
      miniAppDetail: '/public/mini-apps/:code',
    },
  },
};
