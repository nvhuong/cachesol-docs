import type { MiniAppPackage } from '@cachesol/shared-types';
import { manifest } from './manifest';

const Landing: MiniAppPackage = {
  manifest,

  // Landing is purely informational — no lifecycle side effects.
  lifecycle: {
    onMount: () => console.log('[Landing] Mounted'),
    onUnmount: () => console.log('[Landing] Unmounted'),
  },
};

export default Landing;
export { manifest } from './manifest';
export { LandingPage } from './pages/LandingPage';
export { MiniAppDetailPage } from './pages/MiniAppDetailPage';
export { RegistrationPage } from './pages/RegistrationPage';
export type * from './types/registration.types';
export type * from './types/miniapp-catalog.types';
