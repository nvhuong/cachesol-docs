import { create } from 'zustand';
import type { MiniAppPackage, MiniAppManifest } from '@cachesol/shared-types';

interface MiniAppState {
  miniApps: MiniAppPackage[];
  registered: boolean;
  registerMiniApps: (apps: MiniAppPackage[]) => void;
  getManifests: () => MiniAppManifest[];
  getRoutes: () => Array<{
    path: string;
    component: () => Promise<{ default: React.ComponentType }>;
    permissions?: string[];
    layout?: string;
  }>;
  getMenuItems: () => MiniAppManifest['menu'];
}

export const useMiniAppStore = create<MiniAppState>((set, get) => ({
  miniApps: [],
  registered: false,

  registerMiniApps: (apps) => {
    set({ miniApps: apps, registered: true });
  },

  getManifests: () => get().miniApps.map((app) => app.manifest),

  getRoutes: () => {
    const allRoutes = get().miniApps.flatMap((app) => 
      app.manifest.routes.map((route) => ({
        path: route.path.replace(/^\//, ''),
        component: route.component,
        permissions: route.permissions,
        layout: route.layout,
      }))
    );
    return allRoutes;
  },

  getMenuItems: () => {
    return get().miniApps.flatMap((app) => app.manifest.menu || []);
  },
}));
